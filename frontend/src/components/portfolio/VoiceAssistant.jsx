import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Mic, MicOff, Volume2, VolumeX, RefreshCw, Sparkles, Send } from 'lucide-react';
import { speak, stopSpeech } from '../../utils/textToSpeech';
import { startRecognition, stopRecognition, isRecognitionSupported } from '../../utils/speechRecognition';
import { getHuggingFaceResponse } from '../../services/huggingface';
import { getSessionId } from '../../utils/helpers';
import './VoiceAssistant.css';

export const VoiceAssistant = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello, welcome to Jeshintha's portfolio. I am Jeshintha's AI assistant. Feel free to ask me about Jeshintha's skills, projects, internships, experience, education, and achievements.",
    },
  ]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [voices, setVoices] = useState([]);
  const [recognitionAvailable, setRecognitionAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputText, setInputText] = useState('');

  const shouldListenRef = useRef(false);
  const isMutedRef = useRef(isMuted);
  const messagesEndRef = useRef(null);
  const sessionId = useRef(getSessionId());

  // Keep references synced
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Scroll transcription box to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Load and listen to browser voices list changes
  useEffect(() => {
    if (!window.speechSynthesis) return;
    const updateVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };
    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
    setRecognitionAvailable(isRecognitionSupported());

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // Continuous speech recognition loop
  const startListeningLoop = () => {
    if (!isRecognitionSupported()) {
      setRecognitionAvailable(false);
      return;
    }

    shouldListenRef.current = true;
    startRecognition(
      // onResult: transcript text detected
      (transcript) => {
        if (transcript.trim()) {
          handleSendVoiceQuery(transcript);
        }
      },
      // onStart: listening active
      () => {
        setIsListening(true);
      },
      // onEnd: recognition closed
      () => {
        setIsListening(false);
        // Automatically restart if loop is active and assistant is NOT speaking
        if (shouldListenRef.current && !window.speechSynthesis.speaking) {
          setTimeout(() => {
            if (shouldListenRef.current && !isListening && !window.speechSynthesis.speaking) {
              startListeningLoop();
            }
          }, 200);
        }
      },
      // onError: logs errors and attempts loop restarts if valid
      (err) => {
        console.warn("Speech recognition error:", err.error);
        if (err.error === 'not-allowed') {
          shouldListenRef.current = false;
          setIsListening(false);
        }
      },
      // onSpeechStart: DETECT USER SPEAKING TO INTERRUPT ASSISTANT IMMEDIATELY
      () => {
        // Interruption: If the user starts talking, stop speaker instantly
        if (window.speechSynthesis.speaking) {
          stopSpeech();
          setIsSpeaking(false);
        }
      }
    );
  };

  const stopListeningLoop = () => {
    shouldListenRef.current = false;
    stopRecognition();
    setIsListening(false);
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;

    const query = inputText.trim();
    setInputText('');

    if (isListening) {
      stopListeningLoop();
    }

    handleSendVoiceQuery(query);
  };

  // Handles sending the user transcript query to Hugging Face API
  const handleSendVoiceQuery = async (queryText) => {
    if (!queryText.trim() || loading) return;

    // Append user query to chat transcription list
    setMessages((prev) => [...prev, { role: 'user', content: queryText }]);
    setLoading(true);
    stopListeningLoop(); // pause listening while API yields response

    const normalizedQuery = queryText.toLowerCase().trim();

    // 1. Check for Admin Redirect
    const isAdminRedirect = 
      normalizedQuery.includes("go to admin") || 
      normalizedQuery.includes("open admin") || 
      normalizedQuery.includes("redirect me to admin") || 
      normalizedQuery.includes("show admin") || 
      normalizedQuery.includes("admin panel") || 
      normalizedQuery.includes("login admin") ||
      normalizedQuery.includes("direct me to the admin") ||
      normalizedQuery.includes("direct me to admin") ||
      normalizedQuery.includes("go to the admin");

    if (isAdminRedirect) {
      const reply = "Sure! Redirecting you to the admin panel now.";
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
      
      const doRedirect = () => {
        setIsOpen(false);
        navigate('/admin');
      };

      if (!isMutedRef.current) {
        speak(
          reply,
          () => setIsSpeaking(true),
          () => {
            setIsSpeaking(false);
            doRedirect();
          },
          () => {
            setIsSpeaking(false);
            doRedirect();
          },
          voices
        );
      } else {
        doRedirect();
      }
      setLoading(false);
      return;
    }

    // 2. Check for Page Section Scrolling
    let targetSection = null;
    let sectionName = "";

    if (normalizedQuery.includes("go to skills") || normalizedQuery.includes("show skills") || normalizedQuery.includes("skills section")) {
      targetSection = "skills";
      sectionName = "skills";
    } else if (normalizedQuery.includes("go to projects") || normalizedQuery.includes("show projects") || normalizedQuery.includes("projects section")) {
      targetSection = "projects";
      sectionName = "projects";
    } else if (normalizedQuery.includes("go to experience") || normalizedQuery.includes("show experience") || normalizedQuery.includes("experience section") || normalizedQuery.includes("go to internships") || normalizedQuery.includes("show internships")) {
      targetSection = "experience";
      sectionName = "experience";
    } else if (normalizedQuery.includes("go to contact") || normalizedQuery.includes("show contact") || normalizedQuery.includes("contact section") || normalizedQuery.includes("send message")) {
      targetSection = "contact";
      sectionName = "contact";
    } else if (normalizedQuery.includes("go to about") || normalizedQuery.includes("show about") || normalizedQuery.includes("about section") || normalizedQuery.includes("go to background")) {
      targetSection = "about";
      sectionName = "about";
    } else if (normalizedQuery.includes("go to certifications") || normalizedQuery.includes("show certificates") || normalizedQuery.includes("certificates section") || normalizedQuery.includes("go to credentials")) {
      targetSection = "certifications";
      sectionName = "certifications";
    }

    if (targetSection) {
      const reply = `Sure! Taking you to the ${sectionName} section.`;
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
      
      const doScroll = () => {
        const element = document.getElementById(targetSection);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      };

      if (!isMutedRef.current) {
        speak(
          reply,
          () => setIsSpeaking(true),
          () => {
            setIsSpeaking(false);
            doScroll();
            startListeningLoop();
          },
          () => {
            setIsSpeaking(false);
            doScroll();
            startListeningLoop();
          },
          voices
        );
      } else {
        doScroll();
        startListeningLoop();
      }
      setLoading(false);
      return;
    }

    try {
      const history = messages
        .filter((_, idx) => idx > 0) // exclude default greeting from history
        .map((msg) => ({ role: msg.role, content: msg.content }));

      const res = await getHuggingFaceResponse(queryText, sessionId.current, history);
      
      if (res.success) {
        const reply = res.data.response;
        setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
        
        // Speak response aloud
        if (!isMutedRef.current) {
          speak(
            reply,
            () => setIsSpeaking(true),
            () => {
              setIsSpeaking(false);
              // Restart listening loop when speaking completes
              startListeningLoop();
            },
            () => {
              setIsSpeaking(false);
              startListeningLoop();
            },
            voices
          );
        } else {
          // If muted, resume listening loop immediately
          startListeningLoop();
        }
      }
    } catch (err) {
      const errorMsg = "Sorry, I had trouble connecting to the service. Please try again.";
      setMessages((prev) => [...prev, { role: 'assistant', content: errorMsg }]);
      if (!isMutedRef.current) {
        speak(errorMsg, () => setIsSpeaking(true), () => setIsSpeaking(false), () => setIsSpeaking(false), voices);
      }
    } finally {
      setLoading(false);
    }
  };

  const hasTriggeredRef = useRef(false);

  // Trigger welcome speech and start listening loop when the chatbot is opened
  useEffect(() => {
    if (!isOpen) {
      // If closed, make sure we stop listening and speaking
      shouldListenRef.current = false;
      stopRecognition();
      stopSpeech();
      setIsListening(false);
      setIsSpeaking(false);
      return;
    }

    // Chatbot is open! Check if we should play the welcome greeting
    if (hasTriggeredRef.current) {
      // Welcome already played previously, just make sure we start listening
      if (!isListening) {
        startListeningLoop();
      }
      return;
    }

    // Set trigger flag so we only play welcome greeting once
    hasTriggeredRef.current = true;

    if (sessionStorage.getItem('has_heard_voice_welcome') !== 'true') {
      sessionStorage.setItem('has_heard_voice_welcome', 'true');
      
      const welcomeText = "Hello, welcome to Jeshintha's portfolio. I am Jeshintha's AI assistant. Feel free to ask me about Jeshintha's skills, projects, internships, experience, education, and achievements.";
      speak(
        welcomeText,
        () => setIsSpeaking(true),
        () => {
          setIsSpeaking(false);
          startListeningLoop();
        },
        (err) => {
          console.warn("Autoplay speech block or failure:", err);
          setIsSpeaking(false);
          startListeningLoop();
        },
        voices
      );
    } else {
      // Welcome already heard, start listening directly
      startListeningLoop();
    }
  }, [isOpen, voices]);

  // Listen to the custom event from the video ending to automatically pop open the panel
  useEffect(() => {
    const handleOpenAndGreet = () => {
      setIsOpen(true);
    };

    window.addEventListener('open-ai-voice', handleOpenAndGreet);

    return () => {
      window.removeEventListener('open-ai-voice', handleOpenAndGreet);
    };
  }, []);

  // Dispatch event to mute the video player when chatbot is opened
  useEffect(() => {
    if (isOpen) {
      window.dispatchEvent(new CustomEvent('mute-video'));
    }
  }, [isOpen]);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (nextMuted) {
      stopSpeech();
      setIsSpeaking(false);
    } else {
      // Re-read last message if unmuted
      if (messages.length > 0) {
        const lastMsg = messages[messages.length - 1];
        if (lastMsg.role === 'assistant') {
          speak(lastMsg.content, () => setIsSpeaking(true), () => setIsSpeaking(false), () => setIsSpeaking(false), voices);
        }
      }
    }
  };

  const handleManualMicToggle = () => {
    if (isListening) {
      stopListeningLoop();
    } else {
      stopSpeech();
      setIsSpeaking(false);
      startListeningLoop();
    }
  };

  const replayWelcome = () => {
    stopSpeech();
    stopListeningLoop();
    setIsSpeaking(false);

    const welcomeText = "Hello, welcome to Jeshintha's portfolio. I am Jeshintha's AI assistant. Feel free to ask me about Jeshintha's skills, projects, internships, experience, education, and achievements.";
    speak(
      welcomeText,
      () => setIsSpeaking(true),
      () => {
        setIsSpeaking(false);
        startListeningLoop();
      },
      () => {
        setIsSpeaking(false);
        startListeningLoop();
      },
      voices
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]" style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
      {/* Floating Toggle Icon */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`p-5 sm:p-6 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-2xl hover:from-indigo-700 hover:to-violet-700 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 relative`}
        aria-label="Open Voice Assistant"
      >
        {isOpen ? <X className="w-7 h-7 sm:w-8 sm:h-8" /> : <Mic className="w-7 h-7 sm:w-8 sm:h-8 animate-pulse" />}
        
        {/* Pulsing ring indicator if active in background */}
        {(isListening || isSpeaking) && !isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSpeaking ? 'bg-violet-400' : 'bg-indigo-400'}`}></span>
            <span className={`relative inline-flex rounded-full h-4 w-4 ${isSpeaking ? 'bg-violet-500' : 'bg-indigo-500'}`}></span>
          </span>
        )}
      </motion.button>

      {/* Expanded Voice Mode Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute bottom-20 right-0 w-[24rem] sm:w-[32rem] max-w-[calc(100vw-32px)] h-[36rem] sm:h-[45rem] max-h-[calc(100vh-120px)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-slate-900 dark:text-slate-100"
          >
            {/* Header */}
            <div className="bg-slate-50 dark:bg-slate-950 px-5 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-650 dark:text-indigo-400 border border-indigo-500/20">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-bold text-base sm:text-lg bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-200 dark:to-violet-200 bg-clip-text text-transparent">AI Voice Mode</h4>
                  <span className="text-[11px] sm:text-xs text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider">Neural Assistant</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Replay intro */}
                <button
                  onClick={replayWelcome}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-650 hover:text-slate-900 border border-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-white dark:border-slate-800 transition-colors"
                  title="Replay Introduction Welcome"
                >
                  <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
                {/* Mute speaker */}
                <button
                  onClick={toggleMute}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-650 hover:text-slate-900 border border-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-white dark:border-slate-800 transition-colors"
                  title={isMuted ? "Unmute Assistant voice" : "Mute Assistant voice"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-rose-500" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600 dark:text-indigo-400" />}
                </button>
                {/* Close panel */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-650 hover:text-slate-900 border border-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-white dark:border-slate-800 transition-colors"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Central ChatGPT-style Voice Equalizer Visualizer */}
            <div className="flex flex-col items-center justify-center py-6 sm:py-8 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-850 shrink-0">
              <div className="relative flex items-center justify-center h-40">
                {/* Pulsing visual outer rings */}
                <div className={`voice-ring ${isListening ? 'listening' : ''} ${isSpeaking ? 'speaking' : ''}`} />
                <div className={`voice-ring-2 ${isListening ? 'listening' : ''} ${isSpeaking ? 'speaking' : ''}`} />
                
                {/* Central Orb */}
                <div className={`voice-orb ${isListening ? 'listening' : ''} ${isSpeaking ? 'speaking' : ''}`}>
                  {isListening && (
                    <Mic className="w-12 h-12 text-indigo-650 dark:text-indigo-400 animate-bounce" />
                  )}
                  {isSpeaking && (
                    <Volume2 className="w-12 h-12 text-indigo-555 dark:text-violet-400 animate-pulse" />
                  )}
                  {!isListening && !isSpeaking && (
                    <MicOff className="w-12 h-12 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Status & Subheadings */}
              <div className="mt-5 text-center px-4">
                <span className={`text-sm sm:text-base font-semibold block transition-colors duration-300 ${
                  isListening ? 'text-indigo-600 dark:text-indigo-400' : isSpeaking ? 'text-indigo-500 dark:text-violet-400' : 'text-slate-500 dark:text-slate-400'
                }`}>
                  {isListening 
                    ? 'Listening... Speak now' 
                    : isSpeaking 
                      ? 'Speaking...' 
                      : loading 
                        ? 'Thinking...' 
                        : 'Voice Mode Paused'}
                </span>
                <span className="text-[10px] sm:text-xs text-slate-550 dark:text-slate-550 mt-1 block">
                  {isListening 
                    ? 'Your voice interrupts the assistant automatically' 
                    : 'Tap the microphone icon below to start listening'}
                </span>
              </div>
            </div>

            {/* Scrollable Transcription Bubbles Area */}
            <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-slate-50/40 dark:bg-slate-900/60 chat-scroll">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <span className="text-[10px] text-slate-500 font-semibold mb-1 uppercase tracking-wider px-1">
                      {msg.role === 'user' ? 'You' : 'Assistant'}
                    </span>
                    <div
                      className={`p-3.5 sm:p-4 rounded-2xl text-sm sm:text-base leading-relaxed whitespace-pre-line ${
                        msg.role === 'user'
                          ? 'bg-indigo-600 text-white rounded-tr-none shadow-indigo-900/10'
                          : 'bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/50 text-slate-800 dark:text-slate-200 rounded-tl-none'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex flex-col items-start max-w-[85%]">
                    <span className="text-[10px] text-indigo-650 dark:text-indigo-400 font-bold mb-1 uppercase tracking-wider">Thinking</span>
                    <div className="flex items-center space-x-1.5 p-4 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 rounded-2xl rounded-tl-none">
                      <div className="w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Controls Bar (Typing Input + Send + Mic) */}
            <form 
              onSubmit={handleTextSubmit} 
              className="p-4 bg-slate-550 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-850 flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                placeholder={isListening ? "Listening... or type message" : "Type a message..."}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onFocus={() => {
                  if (isListening) {
                    stopListeningLoop();
                  }
                }}
                className="flex-grow bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
                disabled={loading}
              />

              {/* Send Button */}
              <button
                type="submit"
                disabled={loading || !inputText.trim()}
                className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-40 disabled:hover:bg-indigo-600 transition-colors"
                title="Send Message"
              >
                <Send className="w-5 h-5" />
              </button>

              {/* Mic Toggle Button */}
              {recognitionAvailable && (
                <button
                  type="button"
                  onClick={handleManualMicToggle}
                  disabled={loading}
                  className={`p-3 rounded-xl transition-all border ${
                    isListening 
                      ? 'bg-violet-500/20 border-violet-500/30 text-violet-400 hover:bg-violet-500/30' 
                      : 'bg-slate-100 hover:bg-slate-200 text-indigo-600 border border-slate-200 dark:bg-slate-900 dark:border-slate-800 dark:text-indigo-400 dark:hover:bg-slate-800'
                  }`}
                  title={isListening ? "Stop continuous listening" : "Start continuous listening"}
                >
                  {isListening ? <Mic className="w-5 h-5 animate-pulse" /> : <MicOff className="w-5 h-5" />}
                </button>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceAssistant;
