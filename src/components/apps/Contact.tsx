import { useState, useRef, useEffect, useCallback } from 'react';

interface Message {
  id: string;
  from: 'user' | 'system';
  text: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
}

type Step = 'name' | 'email' | 'message' | 'done';

const Contact = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      from: 'system',
      text: "Hey! 👋 I'm glad you're here.",
      timestamp: new Date(Date.now() - 60000),
    },
  ]);
  const [step, setStep] = useState<Step>('name');
  const [input, setInput] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isTyping, setIsTyping] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  // Initial greeting sequence
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: 'intro',
            from: 'system',
            text: "Feel free to send me a message — let's start with your name! 😊",
            timestamp: new Date(),
          },
        ]);
      }, 1500);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input on mount
  useEffect(() => {
    const timer = setTimeout(() => inputRef.current?.focus(), 300);
    return () => clearTimeout(timer);
  }, [step]);

  const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

  const addSystemMessage = useCallback(
    (text: string, delay = 1200) => {
      setIsTyping(true);
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          setIsTyping(false);
          setMessages((prev) => [
            ...prev,
            {
              id: generateId(),
              from: 'system',
              text,
              timestamp: new Date(),
            },
          ]);
          resolve();
        }, delay);
      });
    },
    []
  );

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || step === 'done') return;

    // Validate email
    if (step === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      await addSystemMessage(
        "Hmm, that doesn't look like a valid email. Could you try again? 📧",
        800
      );
      return;
    }

    // Add user message
    const userMsg: Message = {
      id: generateId(),
      from: 'user',
      text: trimmed,
      timestamp: new Date(),
      status: 'sending',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Simulate delivery status
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === userMsg.id ? { ...m, status: 'delivered' } : m
        )
      );
    }, 600);

    // Mark as read after system responds
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === userMsg.id ? { ...m, status: 'read' } : m
        )
      );
    }, 1800);

    // Process step
    if (step === 'name') {
      setFormData((p) => ({ ...p, name: trimmed }));
      await addSystemMessage(
        `Nice to meet you, ${trimmed}! 🤝 What's your email address?`
      );
      setStep('email');
    } else if (step === 'email') {
      setFormData((p) => ({ ...p, email: trimmed }));
      await addSystemMessage(
        "Perfect! Now, what would you like to say? I'm all ears 👂"
      );
      setStep('message');
    } else if (step === 'message') {
      setFormData((p) => ({ ...p, message: trimmed }));
      await addSystemMessage(
        "Thanks for your message! 🎉 I'll get back to you as soon as possible."
      );
      await addSystemMessage('Have a wonderful day! ✨', 1000);
      setStep('done');
    }
  }, [input, step, addSystemMessage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleRestart = useCallback(() => {
    setMessages([
      {
        id: generateId(),
        from: 'system',
        text: "Let's start fresh! What's your name? 😊",
        timestamp: new Date(),
      },
    ]);
    setStep('name');
    setFormData({ name: '', email: '', message: '' });
    setInput('');
  }, []);

  const placeholders: Record<Step, string> = {
    name: "What's your name?",
    email: 'your@email.com',
    message: 'Type your message...',
    done: 'Message sent! ✨',
  };

  const stepLabels: Record<Step, string> = {
    name: 'Step 1 of 3 — Name',
    email: 'Step 2 of 3 — Email',
    message: 'Step 3 of 3 — Message',
    done: 'Complete',
  };

  // Group messages by time proximity for bubble clustering
  const shouldShowTimestamp = (index: number) => {
    if (index === 0) return true;
    const prev = messages[index - 1];
    const curr = messages[index];
    return curr.timestamp.getTime() - prev.timestamp.getTime() > 120000; // 2 min gap
  };

  const isLastInGroup = (index: number) => {
    if (index === messages.length - 1) return true;
    return messages[index + 1].from !== messages[index].from;
  };

  const isFirstInGroup = (index: number) => {
    if (index === 0) return true;
    return messages[index - 1].from !== messages[index].from;
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

  return (
    <div className="flex flex-col h-full bg-[#000000]">
      {/* ===== Conversation Header ===== */}
      <div
        className="shrink-0 flex items-center justify-center py-2 px-4 relative"
        style={{
          background:
            'linear-gradient(180deg, rgba(30,30,32,0.95) 0%, rgba(22,22,24,0.9) 100%)',
          backdropFilter: 'blur(40px)',
          borderBottom: '0.5px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Avatar */}
        <div className="flex flex-col items-center gap-0.5">
          <div className="relative">
            <div
              className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[15px] font-semibold"
              style={{
                background:
                  'linear-gradient(135deg, #5856D6 0%, #AF52DE 100%)',
                boxShadow: '0 2px 8px rgba(88,86,214,0.3)',
              }}
            >
              G
            </div>
            {/* Online indicator */}
            <div className="absolute -bottom-0.5 -right-0.5 w-[10px] h-[10px] rounded-full bg-[#34C759] border-[2px] border-[#1c1c1e]" />
          </div>
          <span className="text-[11px] font-medium text-white/80">
            Ganga
          </span>
        </div>

        {/* Video/Audio call buttons */}
        <div className="absolute right-3 flex items-center gap-3">
          <button
            className="text-white/40 hover:text-white/70 transition-colors"
            aria-label="Video call"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="5" width="14" height="14" rx="2" />
              <path d="M16 10l5-3v10l-5-3" />
            </svg>
          </button>
          <button
            className="text-white/40 hover:text-white/70 transition-colors"
            aria-label="Audio call"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z" />
            </svg>
          </button>
        </div>

        {/* Info button */}
        <button
          className="absolute left-3 text-white/40 hover:text-white/70 transition-colors"
          aria-label="Info"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* ===== Progress Indicator ===== */}
      <div className="shrink-0 px-4 py-1.5 flex items-center justify-center gap-2">
        {(['name', 'email', 'message'] as const).map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`
                h-[3px] rounded-full transition-all duration-500 ease-out
                ${
                  step === 'done' || i < ['name', 'email', 'message'].indexOf(
                    // @ts-ignore
                    step === 'done' ? 'message' : step)
                    ? 'w-8 bg-[#5856D6]'
                    : step === s
                      ? 'w-8 bg-[#5856D6]/60'
                      : 'w-8 bg-white/[0.06]'
                }
              `}
            />
          </div>
        ))}
      </div>

      {/* ===== Messages Area ===== */}
      <div
        ref={messageContainerRef}
        className="flex-1 overflow-auto px-3 pt-2 pb-1"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style>{`
          .messages-scroll::-webkit-scrollbar { display: none; }
        `}</style>

        <div className="space-y-[2px] messages-scroll">
          {messages.map((msg, i) => {
            const showTime = shouldShowTimestamp(i);
            const lastInGroup = isLastInGroup(i);
            const firstInGroup = isFirstInGroup(i);
            const isUser = msg.from === 'user';

            return (
              <div key={msg.id}>
                {/* Timestamp separator */}
                {showTime && (
                  <div className="flex justify-center py-3">
                    <span className="text-[10.5px] font-medium text-white/20 tracking-wide">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                )}

                {/* Message bubble */}
                <div
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'} ${
                    lastInGroup ? 'mb-[6px]' : 'mb-[1px]'
                  }`}
                  style={{
                    animation: `messageSlideIn 0.35s cubic-bezier(0.2, 0.9, 0.3, 1) both`,
                    animationDelay: `${i === messages.length - 1 ? '0.05s' : '0s'}`,
                  }}
                >
                  <div
                    className={`
                      max-w-[72%] px-[12px] py-[7px] text-[14.5px] leading-[1.35] relative
                      transition-all duration-200
                      ${isUser
                        ? 'text-white'
                        : 'text-white/[0.88]'
                      }
                    `}
                    style={{
                      background: isUser
                        ? 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
                        : 'linear-gradient(135deg, rgba(56,56,58,0.9) 0%, rgba(44,44,46,0.9) 100%)',
                      borderRadius: isUser
                        ? `18px ${firstInGroup ? '18px' : '6px'} ${lastInGroup ? '4px' : '6px'} 18px`
                        : `${firstInGroup ? '18px' : '6px'} 18px 18px ${lastInGroup ? '4px' : '6px'}`,
                      boxShadow: isUser
                        ? '0 1px 2px rgba(37,99,235,0.2), 0 2px 8px rgba(37,99,235,0.1)'
                        : '0 1px 2px rgba(0,0,0,0.15), 0 1px 4px rgba(0,0,0,0.1)',
                    }}
                  >
                    {msg.text}

                    {/* Delivery status for user messages */}
                    {isUser && lastInGroup && msg.status && (
                      <div className="flex justify-end mt-0.5">
                        <span className="text-[9.5px] font-medium text-white/40">
                          {msg.status === 'sending' && 'Sending...'}
                          {msg.status === 'sent' && 'Sent'}
                          {msg.status === 'delivered' && 'Delivered'}
                          {msg.status === 'read' && (
                            <span className="text-white/50">Read</span>
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing indicator */}
          {isTyping && (
            <div
              className="flex justify-start mb-2"
              style={{
                animation:
                  'messageSlideIn 0.3s cubic-bezier(0.2, 0.9, 0.3, 1) both',
              }}
            >
              <div
                className="px-[14px] py-[10px] rounded-full flex items-center gap-[4px]"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(56,56,58,0.9) 0%, rgba(44,44,46,0.9) 100%)',
                  borderRadius: '18px 18px 18px 4px',
                  boxShadow:
                    '0 1px 2px rgba(0,0,0,0.15), 0 1px 4px rgba(0,0,0,0.1)',
                }}
              >
                <div
                  className="w-[7px] h-[7px] rounded-full bg-white/30"
                  style={{ animation: 'typingBounce 1.4s ease-in-out infinite' }}
                />
                <div
                  className="w-[7px] h-[7px] rounded-full bg-white/30"
                  style={{
                    animation: 'typingBounce 1.4s ease-in-out 0.2s infinite',
                  }}
                />
                <div
                  className="w-[7px] h-[7px] rounded-full bg-white/30"
                  style={{
                    animation: 'typingBounce 1.4s ease-in-out 0.4s infinite',
                  }}
                />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ===== Input Area ===== */}
      {step !== 'done' ? (
        <div
          className="shrink-0 px-3 pb-3 pt-1.5"
          style={{
            borderTop: '0.5px solid rgba(255,255,255,0.04)',
          }}
        >
          {/* Step label */}
          <div className="flex items-center justify-between px-1 mb-1.5">
            <span className="text-[10px] font-medium text-white/20 tracking-wider uppercase">
              {stepLabels[step]}
            </span>
            {step === 'email' && (
              <span className="text-[10px] text-white/15">
                ↵ to send
              </span>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-end gap-2"
          >
            {/* Attachments button */}
            <button
              type="button"
              className="shrink-0 w-[32px] h-[34px] rounded-full flex items-center justify-center text-white/25 hover:text-white/50 hover:bg-white/[0.05] transition-all duration-150"
              aria-label="Attach"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v8M8 12h8" />
              </svg>
            </button>

            {/* Input field */}
            <div
              className={`
                flex-1 flex items-center rounded-full overflow-hidden transition-all duration-200
                ${inputFocused
                  ? 'ring-1 ring-[#5856D6]/30 bg-white/[0.07]'
                  : 'bg-white/[0.05]'
                }
              `}
              style={{
                border: '0.5px solid rgba(255,255,255,0.08)',
              }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder={placeholders[step]}
                className="flex-1 bg-transparent px-4 py-[8px] text-[14px] text-white/90 outline-none placeholder:text-white/20 caret-[#5856D6]"
                autoFocus
                autoComplete={step === 'email' ? 'email' : 'off'}
                type={step === 'email' ? 'email' : 'text'}
                inputMode={step === 'email' ? 'email' : 'text'}
              />

              {/* Emoji button (decorative) */}
              <button
                type="button"
                className="shrink-0 w-[30px] h-[30px] mr-0.5 rounded-full flex items-center justify-center text-white/20 hover:text-white/50 transition-colors"
                aria-label="Emoji"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                  <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Send button */}
            <button
              type="submit"
              disabled={!input.trim()}
              className={`
                shrink-0 w-[32px] h-[32px] rounded-full flex items-center justify-center
                transition-all duration-200 ease-out
                ${input.trim()
                  ? 'bg-[#3B82F6] hover:bg-[#2563EB] active:scale-90 shadow-[0_2px_8px_rgba(59,130,246,0.3)]'
                  : 'bg-white/[0.06] cursor-not-allowed'
                }
              `}
              aria-label="Send message"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                className={`transition-all duration-200 ${
                  input.trim()
                    ? 'text-white translate-x-[0.5px] -translate-y-[0.5px]'
                    : 'text-white/20'
                }`}
              >
                <path
                  d="M5.694 12L2.299 3.272c-.236-.607.356-1.188.942-.982l.093.04 18.468 8.5a.6.6 0 01.024 1.078l-.024.012-18.468 8.5c-.606.28-1.228-.296-1.035-.903l.035-.08L5.694 12zm0 0h8.806"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>
        </div>
      ) : (
        /* ===== Completion State ===== */
        <div
          className="shrink-0 px-4 py-4"
          style={{
            borderTop: '0.5px solid rgba(255,255,255,0.04)',
            background:
              'linear-gradient(180deg, rgba(22,22,24,0.5) 0%, rgba(22,22,24,0.8) 100%)',
          }}
        >
          <div className="flex flex-col items-center gap-3">
            {/* Success icon */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{
                background:
                  'linear-gradient(135deg, rgba(52,199,89,0.15) 0%, rgba(52,199,89,0.05) 100%)',
                border: '0.5px solid rgba(52,199,89,0.2)',
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#34C759"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  animation: 'checkDraw 0.5s ease-out 0.2s both',
                }}
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <div className="text-center">
              <p className="text-[13px] font-medium text-white/70">
                Message sent successfully
              </p>
              <p className="text-[11px] text-white/30 mt-0.5">
                Sent as {formData.name} · {formData.email}
              </p>
            </div>

            <button
              onClick={handleRestart}
              className="text-[12px] font-medium text-[#5856D6] hover:text-[#7C7AFF] transition-colors mt-1 px-4 py-1.5 rounded-full hover:bg-[#5856D6]/10"
            >
              Send another message
            </button>
          </div>
        </div>
      )}

      {/* ===== Keyframe Animations ===== */}
      <style>{`
        @keyframes messageSlideIn {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes typingBounce {
          0%, 60%, 100% {
            transform: translateY(0);
            opacity: 0.3;
          }
          30% {
            transform: translateY(-4px);
            opacity: 0.7;
          }
        }

        @keyframes checkDraw {
          from {
            stroke-dasharray: 30;
            stroke-dashoffset: 30;
          }
          to {
            stroke-dasharray: 30;
            stroke-dashoffset: 0;
          }
        }

        /* Hide scrollbar */
        .messages-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .messages-scroll::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Contact;