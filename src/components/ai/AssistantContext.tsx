"use client";

import React, { createContext, useContext, useState, useRef, useCallback, useEffect, ReactNode } from "react";

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  isError?: boolean;
  errorCode?: string;
  isStreaming?: boolean;
  links?: { label: string; url: string }[];
}

interface AssistantContextType {
  isOpen: boolean;
  openAssistant: (initialQuestion?: string) => void;
  closeAssistant: () => void;
  messages: ChatMessage[];
  sendMessage: (query: string) => Promise<void>;
  stopGeneration: () => void;
  retryLastMessage: () => void;
  clearChat: () => void;
  isStreaming: boolean;
  isLoading: boolean;
  isConfigured: boolean;
  lastErrorCode: string | null;
  errorMessage: string | null;
  inputQuery: string;
  setInputQuery: (q: string) => void;
  hasActiveRequest: boolean;
}

const AssistantContext = createContext<AssistantContextType | undefined>(undefined);

const INITIAL_GREETING: ChatMessage = {
  id: "welcome-init",
  sender: "assistant",
  text: "Welcome to Harish's AI Portfolio Assistant. I can answer questions about Harish's software development, academic background at Narasaraopeta Engineering College, programming skills in C, Java, Python, HTML, Supabase, and cybersecurity interests. How may I assist you?",
  timestamp: "Just now",
  links: [
    { label: "Academic Journey", url: "/#education" },
    { label: "Technical Skills", url: "/#skills" },
    { label: "Achievements", url: "/#achievements" },
    { label: "Contact Harish", url: "/#contact" }
  ]
};

// Helper to extract markdown links [label](url) from assistant reply
function extractMarkdownLinks(text: string): { label: string; url: string }[] {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const links: { label: string; url: string }[] = [];
  const seen = new Set<string>();
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    const label = match[1].trim();
    const url = match[2].trim();
    if (!seen.has(url)) {
      seen.add(url);
      links.push({ label, url });
    }
  }

  return links;
}

export function AssistantProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);
  const [lastErrorCode, setLastErrorCode] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_GREETING]);
  const [lastUserQuery, setLastUserQuery] = useState<string>("");

  const abortControllerRef = useRef<AbortController | null>(null);
  const isRequestInFlightRef = useRef(false);

  // Check provider configuration status on mount
  useEffect(() => {
    let isMounted = true;
    async function checkConfiguration() {
      try {
        const res = await fetch("/api/assistant");
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setIsConfigured(!!data.configured);
          }
        }
      } catch {
        if (isMounted) {
          setIsConfigured(false);
        }
      }
    }
    checkConfiguration();
    return () => {
      isMounted = false;
    };
  }, []);

  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsStreaming(false);
    setIsLoading(false);
    isRequestInFlightRef.current = false;
  }, []);

  const sendMessage = useCallback(async (rawQuery: string) => {
    const trimmed = rawQuery.trim();
    if (!trimmed) return;

    // Guarantee that submitting a question sends exactly one request
    if (isRequestInFlightRef.current) {
      return;
    }

    isRequestInFlightRef.current = true;
    setErrorMessage(null);
    setLastErrorCode(null);
    setLastUserQuery(trimmed);

    const userMessageId = `user-${Date.now()}`;
    const assistantMessageId = `assistant-${Date.now()}`;
    const timestampStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const userMsg: ChatMessage = {
      id: userMessageId,
      sender: "user",
      text: trimmed,
      timestamp: timestampStr
    };

    // Prepare assistant message slot
    const assistantPlaceholder: ChatMessage = {
      id: assistantMessageId,
      sender: "assistant",
      text: "",
      timestamp: timestampStr,
      isStreaming: true
    };

    setMessages((prev) => [...prev, userMsg, assistantPlaceholder]);
    setIsLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    // 30-second timeout safeguard
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 30000);

    try {
      // Gather multi-turn history from current session
      const currentHistory = messages.slice(-6).map((m) => ({
        sender: m.sender,
        text: m.text
      }));

      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: trimmed,
          history: currentHistory
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      setIsLoading(false);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errCode = errorData.error || "UNKNOWN_ERROR";
        setLastErrorCode(errCode);

        let failureText = "Harish’s AI assistant is temporarily unavailable. Please try again later or use the direct contact links.";
        let failureLinks: { label: string; url: string }[] | undefined = [
          { label: "Contact Harish", url: "/#contact" }
        ];

        if (errCode === "AI_NOT_CONFIGURED") {
          setIsConfigured(false);
          failureText = "Harish’s AI assistant is temporarily unavailable. Please try again later or use the direct contact links.";
        } else if (errCode === "RATE_LIMITED") {
          failureText = errorData.message || "Inquiry limit reached. Please wait a moment before sending another question.";
          failureLinks = undefined;
        } else if (errCode === "MALFORMED_REQUEST") {
          failureText = errorData.message || "A valid question or query is required.";
          failureLinks = undefined;
        } else if (errorData.message) {
          failureText = errorData.message;
        }

        setErrorMessage(failureText);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  text: failureText,
                  isError: true,
                  errorCode: errCode,
                  isStreaming: false,
                  links: failureLinks
                }
              : msg
          )
        );
        return;
      }

      // Successful 200 response -> Provider is verified configured
      setIsConfigured(true);

      if (!res.body) {
        throw new Error("No response stream available.");
      }

      setIsStreaming(true);
      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let accumulatedText = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const cleanLine = line.trim();
          if (cleanLine.startsWith("data: ")) {
            const dataPayload = cleanLine.slice(6);
            if (dataPayload === "[DONE]") {
              continue;
            }
            try {
              const parsed = JSON.parse(dataPayload);
              if (parsed.text) {
                accumulatedText += parsed.text;
                // Live token streaming
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMessageId
                      ? {
                          ...msg,
                          text: accumulatedText,
                          isStreaming: true
                        }
                      : msg
                  )
                );
              } else if (parsed.error) {
                setErrorMessage(parsed.error);
                accumulatedText += `\n\n${parsed.error}`;
              }
            } catch {
              // Frame boundary
            }
          }
        }
      }

      // Stream completed cleanly
      const extractedLinks = extractMarkdownLinks(accumulatedText);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? {
                ...msg,
                text: accumulatedText || "I received your question but generated an empty response. Please try asking again.",
                isStreaming: false,
                links: extractedLinks.length > 0 ? extractedLinks : undefined
              }
            : msg
        )
      );

    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === "AbortError") {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  text: msg.text ? `${msg.text} \n\n*(Generation stopped)*` : "Generation stopped by visitor.",
                  isStreaming: false
                }
              : msg
          )
        );
      } else {
        const failMsg = "The request timed out or encountered a connection error. Please try again later or use the contact links.";
        setErrorMessage(failMsg);
        setLastErrorCode("NETWORK_ERROR");
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId
              ? {
                  ...msg,
                  text: failMsg,
                  isError: true,
                  errorCode: "NETWORK_ERROR",
                  isStreaming: false,
                  links: [{ label: "Contact Harish", url: "/#contact" }]
                }
              : msg
          )
        );
      }
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      abortControllerRef.current = null;
      isRequestInFlightRef.current = false;
    }
  }, [messages]);

  const retryLastMessage = useCallback(() => {
    // Disable Retry if server configuration is missing
    if (lastErrorCode === "AI_NOT_CONFIGURED" || !isConfigured) {
      return;
    }

    if (lastUserQuery && !isRequestInFlightRef.current) {
      setMessages((prev) => {
        if (
          prev.length > 0 &&
          prev[prev.length - 1].sender === "assistant" &&
          (prev[prev.length - 1].isError || !prev[prev.length - 1].text)
        ) {
          return prev.slice(0, -1);
        }
        return prev;
      });
      sendMessage(lastUserQuery);
    }
  }, [lastErrorCode, isConfigured, lastUserQuery, sendMessage]);

  const clearChat = useCallback(() => {
    stopGeneration();
    setErrorMessage(null);
    setLastErrorCode(null);
    setLastUserQuery("");
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: "assistant",
        text: "Conversation cleared. Feel free to ask anything about Harish's academic journey, technical skills in C, Java, Python, HTML, Supabase, or development goals.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        links: [
          { label: "Academic Journey", url: "/#education" },
          { label: "Technical Skills", url: "/#skills" },
          { label: "Achievements", url: "/#achievements" },
          { label: "Contact Harish", url: "/#contact" }
        ]
      }
    ]);
  }, [stopGeneration]);

  const openAssistant = useCallback((initialQuestion?: string) => {
    setIsOpen(true);
    fetch("/api/assistant")
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.configured === "boolean") {
          setIsConfigured(data.configured);
        }
      })
      .catch(() => {});

    if (initialQuestion && initialQuestion.trim() && !isRequestInFlightRef.current) {
      setTimeout(() => {
        sendMessage(initialQuestion.trim());
      }, 50);
    }
  }, [sendMessage]);

  const closeAssistant = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <AssistantContext.Provider
      value={{
        isOpen,
        openAssistant,
        closeAssistant,
        messages,
        sendMessage,
        stopGeneration,
        retryLastMessage,
        clearChat,
        isStreaming,
        isLoading,
        isConfigured,
        lastErrorCode,
        errorMessage,
        inputQuery,
        setInputQuery,
        hasActiveRequest: isLoading || isStreaming
      }}
    >
      {children}
    </AssistantContext.Provider>
  );
}

export function useAssistant() {
  const context = useContext(AssistantContext);
  if (!context) {
    throw new Error("useAssistant must be used within an AssistantProvider");
  }
  return context;
}
