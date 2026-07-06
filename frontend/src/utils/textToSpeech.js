let activeUtterance = null;

export const stopSpeech = () => {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  activeUtterance = null;
};

export const getFemaleVoice = (voices = []) => {
  if (!window.speechSynthesis) return null;
  const list = voices.length > 0 ? voices : window.speechSynthesis.getVoices();
  if (list.length === 0) return null;

  const englishVoices = list.filter(v => v.lang.startsWith('en') || v.lang.startsWith('en-'));
  if (englishVoices.length === 0) return null;

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
    if (found) return found;
  }

  const femaleSpecific = englishVoices.find(v => 
    v.name.toLowerCase().includes('female') || 
    v.name.toLowerCase().includes('zira') || 
    v.name.toLowerCase().includes('siri') || 
    v.name.toLowerCase().includes('samantha') || 
    v.name.toLowerCase().includes('hazel') || 
    v.name.toLowerCase().includes('jenny') || 
    v.name.toLowerCase().includes('aria')
  );
  if (femaleSpecific) return femaleSpecific;

  return englishVoices[0];
};

export const speak = (text, onStart, onEnd, onError, voices = []) => {
  if (!window.speechSynthesis) {
    if (onError) onError(new Error("Speech synthesis not supported"));
    return;
  }

  stopSpeech();

  // Basic regex cleaning for text-to-speech reading (strip emojis & markdown)
  const cleanText = text
    .replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDFFF]/g, '')
    .replace(/\*|_|#/g, '');

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = 'en-US';
  utterance.rate = 0.95;
  utterance.pitch = 1.1;

  const voice = getFemaleVoice(voices);
  if (voice) {
    utterance.voice = voice;
  }

  utterance.onstart = () => {
    if (onStart) onStart();
  };

  utterance.onend = () => {
    activeUtterance = null;
    if (onEnd) onEnd();
  };

  utterance.onerror = (event) => {
    activeUtterance = null;
    if (onError) onError(event);
  };

  // Keep a strong reference to prevent browser garbage collection bug
  activeUtterance = utterance;
  window.speechSynthesis.speak(utterance);
};
