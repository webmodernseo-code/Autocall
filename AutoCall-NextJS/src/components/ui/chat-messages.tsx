"use client";

import translationI18n from '@/i18n';
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, RotateCcw, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export interface ChatMessagesProps {
  messages?: ChatMessage[];
  autoPlay?: boolean;
  autoPlayDelay?: number;
  typingDuration?: number;
  showReplay?: boolean;
  interactive?: boolean;
  loop?: boolean;
  loopDelay?: number;
  className?: string;
  title?: string;
  subtitle?: string;
  aiAvatar?: string;
  userAvatar?: string;
}

const DEFAULT_MESSAGES: ChatMessage[] = [
  {
    id: "1",
    sender: "assistant",
    content:
      "Bonjour ! Je suis l'assistant vocal AutoCall. Comment puis-je vous aider aujourd'hui ?",
  },
  {
    id: "2",
    sender: "user",
    content: "Je souhaite automatiser la prise de rendez-vous téléphonique pour mon cabinet.",
  },
  {
    id: "3",
    sender: "assistant",
    content:
      "Excellente initiative ! AutoCall se synchronise directement avec votre agenda en temps réel, qualifie chaque appel et confirme le rendez-vous par SMS instantané.",
  },
  {
    id: "4",
    sender: "user",
    content:
      "Que se passe-t-il si un client appelle en pleine nuit avec une urgence ?",
  },
  {
    id: "5",
    sender: "assistant",
    content:
      "L'IA décroche 24h/24 en moins de 2 secondes, filtre le degré d'urgence selon vos critères et vous notifie instantanément par alerte prioritaire.",
  },
  {
    id: "6",
    sender: "user",
    content: "Puis-je tester la voix et les scénarios en direct ?",
  },
  {
    id: "7",
    sender: "assistant",
    content:
      "Absolument. Vous pouvez écouter la démo interactive ci-dessous ou lancer votre essai gratuit dès maintenant sans carte bancaire.",
  },
];

/**
 * Avatar Assistant IA animé avec véritable photo de profil, aura lumineuse et ondes acoustiques
 */
export function AnimatedAssistantAvatar({
  src = "/images/avatar-ai.jpg",
  isSpeaking = false,
  size = "md",
  className,
}: {
  src?: string;
  isSpeaking?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClasses =
    size === "sm" ? "h-6 w-6" : size === "lg" ? "h-10 w-10" : "h-8 w-8";

  return (
    <div className={cn("relative flex shrink-0 items-center justify-center select-none", className)}>
      {/* 1. Halo lumineux pulsant & fluide */}
      <motion.div
        className="absolute -inset-1 rounded-full bg-gradient-to-tr from-blue-600/35 via-cyan-500/25 to-sky-400/35 blur-xs pointer-events-none"
        animate={{
          scale: isSpeaking ? [1, 1.35, 1] : [1, 1.15, 1],
          opacity: isSpeaking ? [0.65, 0.95, 0.65] : [0.35, 0.65, 0.35],
        }}
        transition={{
          duration: isSpeaking ? 1.3 : 2.6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* 2. Ondes sonores rayonnantes quand l'IA parle ou tape */}
      {isSpeaking && (
        <>
          <motion.div
            className="absolute -inset-2 rounded-full border border-blue-400/40 pointer-events-none"
            initial={{ scale: 0.85, opacity: 0.8 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
          <motion.div
            className="absolute -inset-3 rounded-full border border-cyan-400/30 pointer-events-none"
            initial={{ scale: 0.85, opacity: 0.6 }}
            animate={{ scale: 1.75, opacity: 0 }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              delay: 0.35,
              ease: "easeOut",
            }}
          />
        </>
      )}

      {/* 3. Photo de profil de l'IA avec bordure subtile */}
      <motion.div
        className={cn(
          "relative rounded-full ring-2 ring-blue-500/50 shadow-md shadow-blue-500/25 overflow-hidden bg-neutral-900",
          sizeClasses
        )}
        whileHover={{ scale: 1.08 }}
        transition={{ duration: 0.2 }}
      >
        <img
          src={src}
          alt="Assistant Vocal IA"
          className="h-full w-full object-cover"
        />
      </motion.div>

      {/* Micro-badge étincelle IA en superposition en bas à droite */}
      <div className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-blue-600 ring-1 ring-black text-white shadow-xs">
        <Sparkles className="h-2 w-2" />
      </div>
    </div>
  );
}

/**
 * Avatar Client avec véritable photo de profil
 */
export function AnimatedUserAvatar({
  src = "/images/avatar-client.jpg",
  size = "md",
  className,
}: {
  src?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClasses =
    size === "sm" ? "h-6 w-6" : size === "lg" ? "h-10 w-10" : "h-8 w-8";

  return (
    <div className={cn("relative flex shrink-0 items-center justify-center select-none", className)}>
      <motion.div
        className={cn(
          "relative rounded-full ring-2 ring-white/20 shadow-md overflow-hidden bg-neutral-800",
          sizeClasses
        )}
        whileHover={{ scale: 1.08 }}
        transition={{ duration: 0.2 }}
      >
        <img
          src={src}
          alt={translationI18n.t('admin.client_label')}
          className="h-full w-full object-cover"
        />
      </motion.div>
    </div>
  );
}

function TypingIndicator({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-2xl rounded-tl-md border border-white/10 bg-zinc-800/90 px-4 py-3 backdrop-blur-sm shadow-sm",
        className,
      )}
    >
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400"
          animate={{ opacity: [0.4, 1, 0.4], y: [0, -5, 0] }}
          transition={{
            duration: 0.75,
            repeat: Infinity,
            delay: i * 0.15,
            ease: "easeInOut",
          }}
        />
      ))}
    </motion.div>
  );
}

function MessageBubble({
  message,
  isLatest,
  aiAvatar = "/images/avatar-ai.jpg",
  userAvatar = "/images/avatar-client.jpg",
}: {
  message: ChatMessage;
  isLatest?: boolean;
  aiAvatar?: string;
  userAvatar?: string;
}) {
  const isUser = message.sender === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.96, x: isUser ? 16 : -16 }}
      animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
    >
      <div className={cn("flex items-end gap-2.5", isUser && "flex-row-reverse")}>
        {!isUser ? (
          <AnimatedAssistantAvatar src={aiAvatar} isSpeaking={isLatest} size="md" />
        ) : (
          <AnimatedUserAvatar src={userAvatar} size="md" />
        )}
        <motion.div
          layout
          className={cn(
            "max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
            isUser
              ? "rounded-tr-md bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-[0_8px_24px_-4px_rgba(37,99,235,0.35)] ring-1 ring-white/10"
              : "rounded-tl-md border border-white/10 bg-zinc-800/90 text-zinc-100 backdrop-blur-sm shadow-[0_4px_16px_-2px_rgba(0,0,0,0.35)]",
          )}
          whileHover={{ scale: 1.01, y: -1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {message.content}
        </motion.div>
      </div>
    </motion.div>
  );
}

export function ChatMessages({
  messages = DEFAULT_MESSAGES,
  autoPlay = true,
  autoPlayDelay = 1800,
  typingDuration = 1200,
  showReplay = true,
  interactive = false,
  loop = true,
  loopDelay = 3500,
  className,
  title = "AutoCall",
  subtitle = "Standard vocal intelligent 24h/24",
  aiAvatar = "/images/avatar-ai.jpg",
  userAvatar = "/images/avatar-client.jpg",
}: ChatMessagesProps) {
  const [visibleCount, setVisibleCount] = useState(
    autoPlay ? 0 : messages.length,
  );
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(messages);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isAutoPlaying = useRef(false);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, []);

  const revealNext = useCallback(
    async function reveal(index: number) {
      if (index >= chatMessages.length) {
        if (loop && isAutoPlaying.current) {
          // Pause de lecture à la fin avant de reboucler
          await new Promise((r) => setTimeout(r, loopDelay));
          if (isAutoPlaying.current) {
            setVisibleCount(0);
            await new Promise((r) => setTimeout(r, 400));
            reveal(0);
          }
        } else {
          isAutoPlaying.current = false;
        }
        return;
      }

      const message = chatMessages[index];

      if (message.sender === "assistant") {
        setIsTyping(true);
        await new Promise((r) => setTimeout(r, typingDuration));
        setIsTyping(false);
      }

      setVisibleCount(index + 1);
      await new Promise((r) => setTimeout(r, 100));
      scrollToBottom();

      await new Promise((r) =>
        setTimeout(
          r,
          Math.max(
            300,
            autoPlayDelay -
              (message.sender === "assistant" ? typingDuration : 0) -
              100,
          ),
        ),
      );

      if (isAutoPlaying.current) {
        reveal(index + 1);
      }
    },
    [chatMessages, autoPlayDelay, typingDuration, scrollToBottom, loop, loopDelay],
  );

  const replay = useCallback(() => {
    setVisibleCount(0);
    setChatMessages(messages);
    isAutoPlaying.current = true;
    setTimeout(() => revealNext(0), 100);
  }, [messages, revealNext]);

  useEffect(() => {
    setChatMessages(messages);
    if (autoPlay) {
      setVisibleCount(0);
      isAutoPlaying.current = true;
      const timer = setTimeout(() => revealNext(0), 500);
      return () => {
        clearTimeout(timer);
        isAutoPlaying.current = false;
      };
    } else {
      setVisibleCount(messages.length);
    }
  }, [messages, autoPlay, revealNext]);

  useEffect(() => {
    scrollToBottom();
  }, [visibleCount, isTyping, scrollToBottom]);

  const handleSend = useCallback(() => {
    if (!inputValue.trim() || !interactive) return;

    // L'interaction de l'utilisateur stoppe la boucle autoPlay
    isAutoPlaying.current = false;

    const newMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      content: inputValue.trim(),
    };

    setChatMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setVisibleCount((prev) => prev + 1);

    setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const assistantReply: ChatMessage = {
          id: `assistant-${Date.now()}`,
          sender: "assistant",
          content:
            "Merci pour votre message ! Notre standard téléphonique intelligent peut automatiser ce scénario pour vos clients dès aujourd'hui.",
        };
        setChatMessages((prev) => [...prev, assistantReply]);
        setVisibleCount((prev) => prev + 1);
      }, typingDuration);
    }, 400);
  }, [inputValue, interactive, typingDuration]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      className={cn(
        "relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-zinc-900 to-zinc-950 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.5)]",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 px-4 py-3 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <AnimatedAssistantAvatar src={aiAvatar} isSpeaking={isTyping} size="md" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white tracking-tight">{title}</h3>
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/25">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                En direct
              </span>
            </div>
            <p className="text-xs text-white/50">{subtitle}</p>
          </div>
        </div>
        {showReplay && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={replay}
            aria-label="Replay conversation"
            className="flex items-center gap-1.5 rounded-lg bg-white/5 px-3 py-1.5 text-xs text-white/70 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Rejouer
          </motion.button>
        )}
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        role="log"
        aria-label="Chat messages"
        aria-live="polite"
        className="flex-1 space-y-3.5 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
      >
        {chatMessages.slice(0, visibleCount).map((message, i) => (
          <MessageBubble
            key={message.id}
            message={message}
            isLatest={i === visibleCount - 1 && message.sender === "assistant"}
            aiAvatar={aiAvatar}
            userAvatar={userAvatar}
          />
        ))}

        <AnimatePresence>
          {isTyping && (
            <div className="flex items-end gap-2.5 justify-start">
              <AnimatedAssistantAvatar src={aiAvatar} isSpeaking={true} size="md" />
              <TypingIndicator />
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="border-t border-white/5 p-3 bg-white/[0.01]">
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-800/50 px-4 py-2 backdrop-blur-sm focus-within:border-white/20 focus-within:bg-zinc-800/70 transition-colors">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!interactive}
            placeholder={
              interactive
                ? "Tester en direct : posez une question au standard IA..."
                : "Mode démonstration interactif"
            }
            aria-label={
              interactive ? "Votre message" : "Entrée du chat"
            }
            className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/35 disabled:cursor-not-allowed"
          />
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleSend}
            disabled={!interactive || !inputValue.trim()}
            aria-label="Send message"
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg transition-colors cursor-pointer",
              interactive && inputValue.trim()
                ? "bg-blue-600 text-white hover:bg-blue-500 shadow-sm shadow-blue-500/40"
                : "bg-white/5 text-white/30",
            )}
          >
            <Send className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default ChatMessages;
