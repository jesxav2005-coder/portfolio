import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Mic, Volume2, VolumeX } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useApi } from '../../hooks/useApi';
import { getSessionId } from '../../utils/helpers';

export const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello and welcome to Jeshintha's portfolio.

I am your AI assistant and I will guide you through the portfolio.

Jeshintha is a Computer Science Engineering student with interests in Artificial Intelligence, Full Stack Development, Machine Learning, and innovative technology solutions.

You can explore projects, certifications, technical skills, achievements, and experience.

Feel free to ask me any questions about the portfolio, and I will be happy to assist you.

Thank you for visiting, and enjoy exploring the portfolio.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // default to unmuted so it talks automatically
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognitionSupported, setRecognitionSupported] = useState(false);
  const [synthesisSupported, setSynthesisSupported] = useState(false);
  const [voices, setVoices] = useState([]);

  // Load and listen to browser voices list changes
  useEffect(() => {
    if (!window.speechSynthesis) return;
    const updateVoices = () => {
      setVoices(window.speechSynthesis.getVoices());
    };
    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  const isMutedRef = useRef(isMuted);
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Automatically open the chatbot after a short delay for entry animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Helper to query and select the best available female English voice
  const getFemaleVoice = () => {
    if (!window.speechSynthesis) return null;
    // Fallback to direct getVoices if state not yet populated
    const voicesList = voices.length > 0 ? voices : window.speechSynthesis.getVoices();
    if (voicesList.length === 0) return null;
    
    // Filter to English languages first
    const englishVoices = voicesList.filter(v => v.lang.startsWith('en') || v.lang.startsWith('en-'));
    if (englishVoices.length === 0) return null;

    // Prioritized list of highly human-sounding female neural voices
    const preferredNames = [
      'Microsoft Aria Online (Natural)',
      'Microsoft Aria',
      'Microsoft Jenny Online (Natural)',
      'Microsoft Jenny',
      'Google UK English Female',
      'Google US English Female',
      'Google UK English',
      'Google US English',
      'Samantha',
      'Siri',
      'Hazel'
    ];

    for (const name of preferredNames) {
      const found = englishVoices.find(v => v.name.includes(name));
      if (found) {
        console.log("Selected preferred human female voice:", found.name);
        return found;
      }
    }

    // Fallback to any voice with female indicators
    const femaleSpecific = englishVoices.find(v => 
      v.name.toLowerCase().includes('female') || 
      v.name.toLowerCase().includes('zira') || 
      v.name.toLowerCase().includes('siri') || 
      v.name.toLowerCase().includes('samantha') || 
      v.name.toLowerCase().includes('hazel') || 
      v.name.toLowerCase().includes('jenny') || 
      v.name.toLowerCase().includes('aria')
    );
    if (femaleSpecific) {
      console.log("Selected fallback human female voice:", femaleSpecific.name);
      return femaleSpecific;
    }

    // Fallback to first English voice
    console.log("Fallback English voice:", englishVoices[0].name);
    return englishVoices[0];
  };

  const speakText = (text) => {
    if (!synthesisSupported || isMuted) return;
    window.speechSynthesis.cancel(); // Stop any currently speaking voice
    setIsSpeaking(false);

    // Basic regex cleaning for text-to-speech reading (strip emojis & markdown)
    const cleanText = text
      .replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDFFF]/g, '')
      .replace(/\*|_|#/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-US';
    utterance.rate = 0.95;
    utterance.pitch = 1.1;

    const femaleVoice = getFemaleVoice();
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      utteranceRef.current = null;
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      utteranceRef.current = null;
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Autoplay voice greeting on first user interaction (bypasses browser autoplay restrictions)
  useEffect(() => {
    if (!window.speechSynthesis) return;

    // Trigger voices list load immediately
    window.speechSynthesis.getVoices();

    if (sessionStorage.getItem('has_heard_welcome') === 'true') {
      return;
    }

    let hasSpoken = false;
    const playWelcome = () => {
      if (hasSpoken) return;
      if (sessionStorage.getItem('has_heard_welcome') === 'true') return;
      if (isMutedRef.current) return;
      
      hasSpoken = true;
      sessionStorage.setItem('has_heard_welcome', 'true');

      const welcomeText = `Hello and welcome to Jeshintha's portfolio.

I am your AI assistant and I will guide you through the portfolio.

Jeshintha is a Computer Science Engineering student with interests in Artificial Intelligence, Full Stack Development, Machine Learning, and innovative technology solutions.

You can explore projects, certifications, technical skills, achievements, and experience.

Feel free to ask me any questions about the portfolio, and I will be happy to assist you.

Thank you for visiting, and enjoy exploring the portfolio.`;

      speakText(welcomeText);

      // Clean up event listeners after speaking once
      window.removeEventListener('click', playWelcome);
      window.removeEventListener('keydown', playWelcome);
      window.removeEventListener('touchstart', playWelcome);
    };

    window.addEventListener('click', playWelcome);
    window.addEventListener('keydown', playWelcome);
    window.addEventListener('touchstart', playWelcome);

    return () => {
      window.removeEventListener('click', playWelcome);
      window.removeEventListener('keydown', playWelcome);
      window.removeEventListener('touchstart', playWelcome);
    };
  }, [synthesisSupported]);

  const messagesEndRef = useRef(null);
  const { postChatbotMessage } = useApi();
  const sessionId = useRef(getSessionId());
  const recognitionRef = useRef(null);
  const utteranceRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Speech Recognition & Synthesis Initialization
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setRecognitionSupported(true);
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => setIsListening(true);
      rec.onend = () => setIsListening(false);
      
      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(transcript);
        }
      };

      rec.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          toast.error('Microphone access blocked. Please check browser permissions (HTTPS or localhost is required).');
        } else if (event.error === 'network') {
          toast.error('Speech API network communication error.');
        } else if (event.error !== 'no-speech' && event.error !== 'aborted') {
          toast.error(`Voice input error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }

    if (window.speechSynthesis) {
      setSynthesisSupported(true);
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (newMuted) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      toast.success('Text-to-speech output enabled!');
    }
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const history = messages
        .filter((msg, idx) => idx > 0)
        .map((msg) => ({ role: msg.role, content: msg.content }));

      const response = await postChatbotMessage(userMessage, sessionId.current, history);
      
      if (response.data.success) {
        const botReply = response.data.data.response;
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: botReply },
        ]);
        speakText(botReply);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "I'm having trouble connecting to the server. Please try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestion = async (suggestionText) => {
    if (loading) return;
    setMessages((prev) => [...prev, { role: 'user', content: suggestionText }]);
    setLoading(true);

    try {
      const history = messages
        .filter((msg, idx) => idx > 0)
        .map((msg) => ({ role: msg.role, content: msg.content }));

      const response = await postChatbotMessage(suggestionText, sessionId.current, history);
      
      if (response.data.success) {
        const botReply = response.data.data.response;
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: botReply },
        ]);
        speakText(botReply);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "I'm having trouble connecting to the server. Please try again later." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]" style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
      {/* Voice Wave Equalizer Animation Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes voiceWave {
          0%, 100% { height: 4px; }
          50% { height: 16px; }
        }
        .wave-bar {
          animation: voiceWave 0.8s ease-in-out infinite;
        }
      `}} />
      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`p-5 sm:p-6 rounded-full bg-indigo-600 text-white shadow-2xl hover:bg-indigo-700 transition-all neon-glow neon-glow-hover focus:outline-none focus:ring-2 focus:ring-indigo-500 relative ${
          isSpeaking && !isOpen ? 'animate-[pulse_1.5s_infinite]' : ''
        }`}
        aria-label="Open Chatbot"
      >
        {isOpen ? <X className="w-7 h-7 sm:w-8 sm:h-8" /> : <MessageSquare className="w-7 h-7 sm:w-8 sm:h-8" />}
        
        {/* Glowing voice animation badge if closed and speaking */}
        {isSpeaking && !isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4.5 w-4.5 bg-indigo-500 flex items-center justify-center">
              <div className="flex gap-[1px] items-end h-2">
                <div className="w-[1.5px] bg-white rounded-full wave-bar" style={{ animationDelay: '0s', height: '3px' }}></div>
                <div className="w-[1.5px] bg-white rounded-full wave-bar" style={{ animationDelay: '0.2s', height: '6px' }}></div>
                <div className="w-[1.5px] bg-white rounded-full wave-bar" style={{ animationDelay: '0.4s', height: '4px' }}></div>
              </div>
            </span>
          </span>
        )}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute bottom-20 right-0 w-[24rem] sm:w-[32rem] max-w-[calc(100vw-32px)] h-[36rem] sm:h-[45rem] max-h-[calc(100vh-120px)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col transition-colors duration-300"
          >
            {/* Header */}
            <div className="bg-neon-gradient px-5 py-4 flex items-center justify-between text-white shrink-0 shadow-md">
              <div className="flex items-center gap-3">
                <Bot className="w-6 h-6 sm:w-7 sm:h-7 animate-bounce" />
                <div>
                  <h4 className="font-bold text-base sm:text-lg">Jeshintha's AI Assistant</h4>
                  {isSpeaking ? (
                    <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-indigo-200">
                      <span className="font-medium animate-pulse">Speaking</span>
                      <div className="flex items-end gap-[2px] h-3 px-0.5">
                        <div className="w-[2px] bg-indigo-200 rounded-full wave-bar" style={{ animationDelay: '0s', height: '6px' }}></div>
                        <div className="w-[2px] bg-indigo-200 rounded-full wave-bar" style={{ animationDelay: '0.15s', height: '10px' }}></div>
                        <div className="w-[2px] bg-indigo-200 rounded-full wave-bar" style={{ animationDelay: '0.3s', height: '4px' }}></div>
                        <div className="w-[2px] bg-indigo-200 rounded-full wave-bar" style={{ animationDelay: '0.45s', height: '8px' }}></div>
                      </div>
                    </div>
                  ) : (
                    <span className="text-[11px] sm:text-xs text-indigo-200">Claude-3.5 Sonnet</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* TTS Speak/Mute Toggle */}
                {synthesisSupported && (
                  <button
                    onClick={toggleMute}
                    className="p-2 rounded-lg hover:bg-indigo-700 text-indigo-100 hover:text-white transition-colors"
                    title={isMuted ? "Enable speech voice output" : "Mute speech voice output"}
                  >
                    {isMuted ? <VolumeX className="w-5 h-5 sm:w-6 sm:h-6" /> : <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />}
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    if (synthesisSupported) window.speechSynthesis.cancel();
                  }}
                  className="p-2 rounded-lg hover:bg-indigo-700 text-white/80 hover:text-white transition-colors"
                  aria-label="Close panel"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-grow p-5 overflow-y-auto space-y-5 bg-slate-50 dark:bg-slate-950/40">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    {/* Icon */}
                    <div className={`p-2 rounded-full shrink-0 ${msg.role === 'user' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                      {msg.role === 'user' ? <User className="w-5 h-5 sm:w-6 sm:h-6" /> : <Bot className="w-5 h-5 sm:w-6 sm:h-6" />}
                    </div>

                    {/* Bubble */}
                    <div
                      className={`p-4 sm:p-5 rounded-2xl text-base sm:text-lg leading-relaxed whitespace-pre-line ${
                        msg.role === 'user'
                          ? 'bg-indigo-600 text-white rounded-tr-none'
                          : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none shadow-sm'
                      }`}
                    >
                      <div>{msg.content}</div>
                      
                      {/* Speaker icon for the welcome message (index 0) */}
                      {msg.role === 'assistant' && idx === 0 && (
                        <div className="mt-3 flex items-center gap-3 flex-wrap">
                          {synthesisSupported && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const welcomeText = `Hello and welcome to Jeshintha's portfolio.
 
 I am your AI assistant and I will guide you through the portfolio.
 
 Jeshintha is a Computer Science Engineering student with interests in Artificial Intelligence, Full Stack Development, Machine Learning, and innovative technology solutions.
 
 You can explore projects, certifications, technical skills, achievements, and experience.
 
 Feel free to ask me any questions about the portfolio, and I will be happy to assist you.
 
 Thank you for visiting, and enjoy exploring the portfolio.`;
                                speakText(welcomeText);
                              }}
                              className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-all bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1.5 rounded-xl border border-indigo-150 dark:border-indigo-900/50 neon-glow-hover"
                              title="Replay welcome message"
                            >
                              <Volume2 className="w-4 h-4" />
                              <span>Replay Welcome</span>
                            </button>
                          )}
                          
                          {isSpeaking && (
                            <div className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                              <span className="animate-pulse">Speaking...</span>
                              <div className="flex items-end gap-[3px] h-4 w-6 px-1">
                                <div className="w-[3px] bg-indigo-500 dark:bg-indigo-400 rounded-full wave-bar" style={{ animationDelay: '0s' }}></div>
                                <div className="w-[3px] bg-indigo-500 dark:bg-indigo-400 rounded-full wave-bar" style={{ animationDelay: '0.15s' }}></div>
                                <div className="w-[3px] bg-indigo-500 dark:bg-indigo-400 rounded-full wave-bar" style={{ animationDelay: '0.3s' }}></div>
                                <div className="w-[3px] bg-indigo-500 dark:bg-indigo-400 rounded-full wave-bar" style={{ animationDelay: '0.45s' }}></div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 shrink-0">
                      <Bot className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />
                    </div>
                    <div className="flex items-center space-x-1.5 p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-2xl rounded-tl-none shadow-sm">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggestion Chips */}
            <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex flex-wrap gap-2 shrink-0">
              {[
                "Tell me about Punch Detector 🥊",
                "Where did she intern? 🏢",
                "Boxing achievements? 🏅",
                "Contact info 📞"
              ].map((suggestion, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSuggestion(suggestion)}
                  className="text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-slate-700 dark:text-slate-350 hover:text-indigo-600 dark:hover:text-indigo-400 border border-slate-200 dark:border-slate-755 rounded-full transition-colors active:scale-95 shrink-0"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-3 items-center shrink-0">
              {/* Mic Speech Input */}
              {recognitionSupported && (
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-3 rounded-xl border transition-all ${
                    isListening 
                      ? 'bg-violet-500 border-violet-600 text-white animate-pulse neon-glow' 
                      : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 dark:text-slate-350'
                  }`}
                  title={isListening ? "Listening... Click to stop" : "Speak query voice input"}
                >
                  <Mic className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              )}
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isListening ? "Listening..." : "Ask me something..."}
                disabled={isListening}
                className="flex-grow px-4 py-3 text-base sm:text-lg rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-955 text-slate-900 dark:text-white focus:text-indigo-600 dark:focus:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={loading || !input.trim() || isListening}
                className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50 transition-all neon-glow-hover"
                aria-label="Send message"
              >
                <Send className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
export default ChatWidget;
