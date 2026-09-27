"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ArrowRight, Play, Volume2, VolumeX } from "lucide-react";
import IntroMontage, { type IntroContent } from "./IntroMontage";
import { startIntroAudio } from "./intro-audio";
import styles from "./cinematic-intro.module.css";

const SEEN_KEY = "harish:intro:v1";
const REPLAY_EVENT = "harish:replay-intro";
const DURATION = 7200;

export function ReplayIntroButton() {
  return (
    <button type="button" className={styles.replay} onClick={() => window.dispatchEvent(new Event(REPLAY_EVENT))}>
      <Play size={12} aria-hidden="true" />
      Replay intro
    </button>
  );
}

export default function CinematicIntro({ content }: { content: IntroContent }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const audio = useRef<AudioContext | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const previousOverflow = useRef<string | null>(null);
  const startedAt = useRef(0);
  const [phase, setPhase] = useState<"idle" | "playing" | "exiting">("idle");
  const [run, setRun] = useState(0);
  const [sound, setSound] = useState(false);
  const [reduced, setReduced] = useState(false);
  const id = useId().replaceAll(":", "");

  const stopAudio = useCallback(() => {
    if (audio.current) void audio.current.close().catch(() => undefined);
    audio.current = null;
  }, []);

  const restorePage = useCallback(() => {
    if (previousOverflow.current !== null) document.body.style.overflow = previousOverflow.current;
    previousOverflow.current = null;
    delete document.documentElement.dataset.portfolioIntro;
  }, []);

  const finish = useCallback((immediate = false) => {
    clearTimeout(timer.current);
    stopAudio();
    setSound(false);
    if (!dialog.current?.open) return;
    const close = () => {
      dialog.current?.close();
      restorePage();
      setPhase("idle");
    };
    if (immediate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) close();
    else {
      setPhase("exiting");
      timer.current = setTimeout(close, 550);
    }
  }, [restorePage, stopAudio]);

  const begin = useCallback((replay: boolean) => {
    const element = dialog.current;
    if (!element || element.open) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!replay) {
      if (reduceMotion || window.location.hash || window.scrollY > 80) return;
      try { if (sessionStorage.getItem(SEEN_KEY)) return; } catch { /* Storage is optional. */ }
    }
    setReduced(reduceMotion);
    setRun((value) => value + 1);
    setPhase("playing");
    setSound(false);
    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.dataset.portfolioIntro = "playing";
    startedAt.current = performance.now();
    element.showModal();
    try { sessionStorage.setItem(SEEN_KEY, "seen"); } catch { /* Still playable without storage. */ }
    timer.current = setTimeout(() => finish(), reduceMotion ? 2000 : DURATION);
  }, [finish]);

  useEffect(() => {
    const element = dialog.current;
    const frame = requestAnimationFrame(() => begin(false));
    const replay = () => begin(true);
    const hidden = () => { if (document.hidden) finish(true); };
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const motionChanged = () => { if (motionPreference.matches) finish(true); };
    window.addEventListener(REPLAY_EVENT, replay);
    document.addEventListener("visibilitychange", hidden);
    motionPreference.addEventListener("change", motionChanged);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer.current);
      window.removeEventListener(REPLAY_EVENT, replay);
      document.removeEventListener("visibilitychange", hidden);
      motionPreference.removeEventListener("change", motionChanged);
      stopAudio();
      element?.close();
      restorePage();
    };
  }, [begin, finish, restorePage, stopAudio]);

  const toggleSound = () => {
    if (sound) {
      stopAudio();
      setSound(false);
      return;
    }
    try {
      audio.current = startIntroAudio((performance.now() - startedAt.current) / 1000, DURATION / 1000);
      setSound(Boolean(audio.current));
    } catch { setSound(false); }
  };

  return (
    <dialog
      ref={dialog}
      className={styles.dialog}
      data-phase={phase}
      data-reduced={reduced}
      aria-label="Venkata Sai Harish Babu Gummadi portfolio introduction"
      onCancel={(event) => { event.preventDefault(); finish(true); }}
    >
      <p className="sr-only">A short introduction to Venkata Sai Harish Babu Gummadi&apos;s portfolio. Skip at any time to explore the portfolio.</p>
      {phase !== "idle" && (
        <div key={run} className={styles.film}>
          <div className={styles.atmosphere} aria-hidden="true" />
          <svg className={styles.montage} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <g className={styles.montageTrack}><IntroMontage content={content} /></g>
          </svg>
          <div className={styles.vignette} aria-hidden="true" />

          <div className={styles.titleStage} aria-hidden="true">
            <svg viewBox="0 0 1440 900" className={styles.titleSvg}>
              <defs>
                <text id={`${id}-name`} x="155" y="545" fontFamily="var(--font-inter), sans-serif" fontSize="270" fontWeight="900" textLength="1130" lengthAdjust="spacingAndGlyphs">HARISH</text>
                <clipPath id={`${id}-mask`}><use href={`#${id}-name`} /></clipPath>
                <linearGradient id={`${id}-metal`} x1="0" x2="0.15" y1="0" y2="1">
                  <stop offset="0" stopColor="#ffefcc" />
                  <stop offset=".36" stopColor="#d7b981" />
                  <stop offset=".49" stopColor="#9e7549" />
                  <stop offset=".52" stopColor="#f2ddae" />
                  <stop offset=".76" stopColor="#b28c54" />
                  <stop offset="1" stopColor="#f5dfb4" />
                </linearGradient>
              </defs>
              <g className={styles.namePullback}>
                <g className={styles.extrusion} fill="#412b1b" stroke="#412b1b" strokeWidth="3">
                  <use href={`#${id}-name`} transform="translate(7 10)" />
                  <use href={`#${id}-name`} transform="translate(4 6)" />
                </g>
                <g clipPath={`url(#${id}-mask)`}>
                  <g className={styles.letterMontage}><IntroMontage content={content} /></g>
                </g>
                <use href={`#${id}-name`} className={styles.metal} fill={`url(#${id}-metal)`} stroke="#f4ddb0" strokeWidth=".7" />
              </g>
              <text x="720" y="256" textAnchor="middle" className={styles.surname} fill="#e8d5b4" fontSize="37" letterSpacing="19">GUMMADI</text>
              <path className={styles.rule} d="M375 602h690" stroke="#b28a58" strokeWidth="1" />
              <text x="720" y="659" textAnchor="middle" className={styles.descriptor} fill="#c0a88a" fontSize="18" letterSpacing="8">SOFTWARE. WEB. SECURITY.</text>
            </svg>
            <div className={styles.lightSweep} />
          </div>

          <div className={styles.controls}>
            <span className={styles.brand}>HB <span>/</span> THE INTRODUCTION</span>
            <div className={styles.actions}>
              {!reduced && <button type="button" onClick={toggleSound} className={styles.control} aria-pressed={sound} aria-label={sound ? "Turn intro sound off" : "Turn intro sound on"}>
                {sound ? <Volume2 size={15} /> : <VolumeX size={15} />}
                <span>Sound {sound ? "on" : "off"}</span>
              </button>}
              <button type="button" autoFocus onClick={() => finish(true)} className={styles.skip}>
                {reduced ? "Enter portfolio" : "Skip intro"} <ArrowRight size={15} aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className={styles.caption} aria-hidden="true">
            <span className={styles.chapterOne}>THE WORK</span>
            <span className={styles.chapterTwo}>THE PERSON BEHIND IT</span>
          </div>
          <div className={styles.progress} aria-hidden="true"><span /></div>
        </div>
      )}
    </dialog>
  );
}
