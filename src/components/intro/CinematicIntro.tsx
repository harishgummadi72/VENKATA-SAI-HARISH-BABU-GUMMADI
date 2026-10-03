"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Play, Volume2, VolumeX } from "lucide-react";
import styles from "./cinematic-intro.module.css";

const SEEN_KEY = "harish:intro:v2";
const REPLAY_EVENT = "harish:replay-intro";
const VIDEO_SRC = "/assets/videos/portfolio-entry.mp4";

export function ReplayIntroButton() {
  return (
    <button
      type="button"
      className={styles.replay}
      onClick={() => window.dispatchEvent(new Event(REPLAY_EVENT))}
    >
      <Play size={12} />
      Replay intro
    </button>
  );
}

export default function CinematicIntro() {
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const previousOverflow = useRef<string | null>(null);

  const [phase, setPhase] = useState<"idle" | "playing" | "exiting">("idle");
  const [run, setRun] = useState(0);
  const [muted, setMuted] = useState(true);
  const [reduced, setReduced] = useState(false);

  const restorePage = useCallback(() => {
    if (previousOverflow.current !== null) {
      document.body.style.overflow = previousOverflow.current;
    }

    previousOverflow.current = null;
    delete document.documentElement.dataset.portfolioIntro;
  }, []);

  const finish = useCallback(
    (immediate = false) => {
      const element = dialog.current;
      const player = video.current;

      if (player) {
        player.pause();
        player.currentTime = 0;
      }

      if (!element?.open) return;

      const close = () => {
        element.close();
        restorePage();
        setPhase("idle");
      };

      if (
        immediate ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        close();
      } else {
        setPhase("exiting");
        window.setTimeout(close, 350);
      }
    },
    [restorePage],
  );

  const begin = useCallback((replay: boolean) => {
    const element = dialog.current;
    if (!element || element.open) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!replay) {
      if (reduceMotion || window.location.hash || window.scrollY > 80) return;

      try {
        if (sessionStorage.getItem(SEEN_KEY)) return;
      } catch {}
    }

    setReduced(reduceMotion);
    setMuted(true);
    setRun((value) => value + 1);
    setPhase("playing");

    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.dataset.portfolioIntro = "playing";

    element.showModal();

    try {
      sessionStorage.setItem(SEEN_KEY, "seen");
    } catch {}
  }, []);

  useEffect(() => {
    const dialogElement = dialog.current;
    const videoElement = video.current;
    const frame = requestAnimationFrame(() => begin(false));

    const replay = () => begin(true);
    const hidden = () => {
      if (document.hidden) finish(true);
    };

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    const motionChanged = () => {
      if (motionPreference.matches) finish(true);
    };

    window.addEventListener(REPLAY_EVENT, replay);
    document.addEventListener("visibilitychange", hidden);
    motionPreference.addEventListener("change", motionChanged);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener(REPLAY_EVENT, replay);
      document.removeEventListener("visibilitychange", hidden);
      motionPreference.removeEventListener("change", motionChanged);
      videoElement?.pause();
      dialogElement?.close();
      restorePage();
    };
  }, [begin, finish, restorePage]);

  return (
    <dialog
      ref={dialog}
      className={styles.dialog}
      data-phase={phase}
      aria-label="Portfolio introduction"
      onCancel={(event) => {
        event.preventDefault();
        finish(true);
      }}
    >
      {phase !== "idle" && (
        <div key={run} className={styles.film}>
          <video
            ref={video}
            className={styles.video}
            autoPlay={!reduced}
            muted={muted}
            playsInline
            preload="auto"
            onCanPlay={() => {
              if (!reduced) void video.current?.play().catch(() => undefined);
            }}
            onEnded={() => finish()}
            onError={() => finish(true)}
            aria-hidden="true"
          >
            <source src={VIDEO_SRC} type="video/mp4" />
          </video>

          <div className={styles.overlay} />

          <div className={styles.controls}>
            <span className={styles.brand}>
              HB <span>/</span> PORTFOLIO INTRO
            </span>

            <div className={styles.actions}>
              {!reduced && (
                <button
                  type="button"
                  onClick={() => setMuted((value) => !value)}
                  className={styles.control}
                  aria-pressed={!muted}
                >
                  {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
                  <span>Sound {muted ? "off" : "on"}</span>
                </button>
              )}

              <button
                type="button"
                autoFocus
                onClick={() => finish(true)}
                className={styles.skip}
              >
                {reduced ? "Enter portfolio" : "Skip intro"}
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}
