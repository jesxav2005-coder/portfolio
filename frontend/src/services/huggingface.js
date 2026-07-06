import api from './api';

const RELATED_KEYWORDS = [
  'skill', 'project', 'education', 'internship', 'certification', 'resume', 
  'contact', 'experience', 'career', 'boxing', 'ncc', 'rotaract', 'jeshintha', 
  'college', 'school', 'canteen', 'punch detector', 'score', 'job', 'work', 
  'email', 'phone', 'about', 'who are you', 'who is', 'hello', 'hi', 'hey', 
  'github', 'linkedin', 'cv', 'portfoli', 'achievement', 'award', 'vishwakarma', 
  'gold', 'silver', 'medal', 'school', 'cgpa', 'rotarach', 'chairman', 'back to school'
];

export const isQueryRelated = (query) => {
  const cleanQuery = query.toLowerCase().trim();
  if (cleanQuery.length === 0) return false;
  
  // Basic greetings are always allowed
  if (['hi', 'hello', 'hey', 'greetings', 'morning', 'evening', 'welcome'].some(g => cleanQuery === g)) {
    return true;
  }

  return RELATED_KEYWORDS.some(keyword => cleanQuery.includes(keyword));
};

export const getHuggingFaceResponse = async (userMessage, sessionId, history) => {
  // 1. Strict filter for Jeshintha/portfolio relevance
  if (!isQueryRelated(userMessage)) {
    return {
      success: true,
      data: {
        response: "I am Jeshintha's portfolio assistant. Please ask me something about Jeshintha's skills, projects, experience, education, or career."
      }
    };
  }

  // Check if a client environment key is provided
  const hfApiKey = import.meta.env.VITE_HF_API_KEY;
  const hfModel = import.meta.env.VITE_HF_MODEL || 'meta-llama/Meta-Llama-3-8B-Instruct';

  if (hfApiKey && hfApiKey !== 'dummy-key') {
    try {
      // Pull portfolio context dynamically from frontend APIs
      let profileData = {};
      let skillsData = [];
      let projectsData = [];
      let experiencesData = [];
      
      try {
        const [profileRes, skillsRes, projectsRes, expRes] = await Promise.all([
          api.get('/api/portfolio/profile'),
          api.get('/api/portfolio/skills'),
          api.get('/api/portfolio/projects'),
          api.get('/api/portfolio/experiences')
        ]);
        profileData = profileRes.data?.data || {};
        skillsData = skillsRes.data?.data || [];
        projectsData = projectsRes.data?.data || [];
        experiencesData = expRes.data?.data || [];
      } catch (e) {
        console.warn("Failed to retrieve live portfolio context, using defaults:", e);
      }

      const systemPrompt = `You are an AI assistant for Jeshintha X's developer portfolio. Answer questions about their background, skills, projects, work experiences (internships), education, achievements, and how to contact them. Be concise, friendly, and professional. Never make up information not in this data.
      
      NAME: Jeshintha X
      TITLE: Computer Science Engineering Student
      BIO: CSE Engineering Student with interests in AI, ML, Full Stack Development, and IoT.
      EDUCATION:
      - B.E. in Computer Science & Engineering at Prince Dr. K. Vasudevan College of Engineering and Technology (CGPA: 84.5%, 2023 - 2027)
      - Higher Secondary School (XII) at Revoor Padmanaba Chettiar Mat High Sec School (490/600, 2022 - 2023)
      - Secondary School (Class X) at V.O.C Mat High Sec School
      SKILLS: ${skillsData.map(s => s.name).join(', ') || 'Python, FastAPI, HTML/CSS, JavaScript, MySQL, Streamlit'}
      PROJECTS: ${JSON.stringify(projectsData.map(p => ({ title: p.title, tech: p.tech_stack })))}
      EXPERIENCES: ${JSON.stringify(experiencesData.map(exp => ({ role: exp.role, company: exp.company, desc: exp.description })))}
      CONTACT: jesxav2005@gmail.com
      `;

      const response = await fetch(`https://api-inference.huggingface.co/models/${hfModel}/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${hfApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: hfModel,
          messages: [
            { role: 'system', content: systemPrompt },
            ...history.map(h => ({ role: h.role, content: h.content })),
            { role: 'user', content: userMessage }
          ],
          max_tokens: 250,
          temperature: 0.3
        })
      });

      if (!response.ok) {
        throw new Error(`Hugging Face API returned status: ${response.status}`);
      }

      const json = await response.json();
      const botResponse = json.choices[0].message.content;
      return {
        success: true,
        data: {
          response: botResponse
        }
      };
    } catch (err) {
      console.error("Error making direct Hugging Face API call, falling back to backend chatbot:", err);
    }
  }

  // Secure default: Call backend API endpoint which wraps Hugging Face API with server-side keys
  try {
    const res = await api.post('/api/chatbot/message', {
      message: userMessage,
      session_id: sessionId,
      history: history
    });
    return {
      success: res.data.success,
      data: {
        response: res.data.data.response
      }
    };
  } catch (err) {
    console.error("Error connecting to backend chatbot:", err);
    throw err;
  }
};
