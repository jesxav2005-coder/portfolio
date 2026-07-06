export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  } catch (e) {
    return dateStr;
  }
};

export const truncateText = (text, maxLength = 150) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
};

export const getSessionId = () => {
  let session = localStorage.getItem('chatbot_session');
  if (!session) {
    session = 'session_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('chatbot_session', session);
  }
  return session;
};
