let recognitionInstance = null;
let isStarted = false;

export const isRecognitionSupported = () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  return !!SpeechRecognition;
};

export const startRecognition = (onResult, onStart, onEnd, onError, onSpeechStart) => {
  if (!isRecognitionSupported()) {
    if (onError) onError(new Error("Speech recognition not supported"));
    return null;
  }

  // Prevent multiple speech recognition instances from running simultaneously
  if (recognitionInstance) {
    try {
      recognitionInstance.stop();
    } catch (e) {
      console.warn("Error stopping existing recognition instance:", e);
    }
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const rec = new SpeechRecognition();
  rec.continuous = false;
  rec.interimResults = false;
  rec.lang = 'en-US';

  rec.onstart = () => {
    isStarted = true;
    if (onStart) onStart();
  };

  rec.onend = () => {
    isStarted = false;
    if (onEnd) onEnd();
  };

  rec.onerror = (event) => {
    if (onError) onError(event);
  };

  rec.onspeechstart = () => {
    if (onSpeechStart) onSpeechStart();
  };

  rec.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    if (onResult && transcript) {
      onResult(transcript);
    }
  };

  recognitionInstance = rec;
  rec.start();
  return rec;
};

export const stopRecognition = () => {
  if (recognitionInstance) {
    try {
      recognitionInstance.stop();
    } catch (e) {
      // already stopped or not started
    }
    recognitionInstance = null;
  }
  isStarted = false;
};

export const isRecognitionActive = () => {
  return isStarted;
};
