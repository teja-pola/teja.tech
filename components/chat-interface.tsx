'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiX, FiLoader } from 'react-icons/fi';
import { PiFinnTheHumanFill } from 'react-icons/pi';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

// Comprehensive Knowledge Base about Dharmateja
const KNOWLEDGE_BASE = `
# Dharmateja Pola - Full Stack Developer & Tech Enthusiast

## Professional Background
- Full Stack Developer at Parul University
- Open Source Contributor
- Tech Content Creator
- Freelance Web Developer

## Technical Skills
### Frontend
- React.js, Next.js, TypeScript, JavaScript (ES6+)
- Redux, Context API, React Query
- Tailwind CSS, Styled Components, CSS Modules
- Three.js, WebGL, D3.js

### Backend
- Node.js, Express, NestJS
- Python, Django, FastAPI
- Go, Rust (Learning)
- GraphQL, RESTful APIs

### Databases
- PostgreSQL, MongoDB, Redis
- Firebase, Supabase
- Prisma, TypeORM, Mongoose

### DevOps & Cloud
- AWS (EC2, S3, Lambda, RDS)
- Docker, Kubernetes
- CI/CD (GitHub Actions, Jenkins)
- Nginx, PM2

### Other Technologies
- Blockchain & Web3
- Machine Learning (Basic)
- Linux, Git, Bash
- Figma, Adobe XD

## Projects
### Cartify
- An AI shopping agent built for the World's Largest AI Hackathon
- Features intelligent product recommendations and natural language search
- Won 1st place in the Groq x Llama track at Raise Your Hack
- Voice-first assistant that recognizes, detects intent/emotion, and filters by budget, season to find real products from the database. Carts for one-click purchase, includes analytics

### Zesty
- An "unrecommendation engine" that helps users discover content outside their filter bubble
- Uses advanced ML algorithms to suggest diverse content
- Won Honorable Mention in Qloo LLM Hackathon
- Awarded $5,000 in prizes
- Engine that uses the Qloo API to map a user’s interests, find far-away (contrastive) nodes, and surface challenging, diverse recommendations to push users out of their comfort zone.

### Zeo
- Privacy-first mental-health AI companion with real-time conversational video avatars for mental health disorders faced by the 197 million people globally (according to WHO).
- Won the Nova Spark startup pitch competition
- Demonstrated strong problem-solving and presentation skills

### VS Cube (YouTube in VS Code)
- VS Code extension that brings YouTube functionality directly into the editor
- Achieved 390+ downloads on the VS Code Marketplace
- Features included video playback, search, and playlist management
- Built with TypeScript and VS Code Extension API

### OOCUS (Focus Booster)
- Chrome extension designed to reduce digital distractions
- Blurs thumbnails and media content on social media platforms
- Helps maintain focus by hiding potentially distracting elements
- Features one-click toggle to reveal/hide content as needed

## Education
- B.Tech in Computer Science, Parul University (2023 - 2027)
- Relevant coursework: Data Structures, Algorithms, Web Development, AI/ML

## Work Experience
### Full Stack Developer @ Parul University
- Developed and maintained web applications
- Collaborated with cross-functional teams
- Implemented RESTful APIs and integrated third-party services

## Open Source Contributions
- Active contributor to [List of projects]
- Maintainer of [Project Name]
- Regular participant in hackathons

## Hobbies & Interests
- Learning new technologies
- Contributing to open source
- Writing technical blogs
- Participating in coding competitions
- Exploring AI/ML

## Personality & Communication Style
- Professional yet approachable
- Enthusiastic about technology
- Always eager to learn and share knowledge
- Values clean code and best practices

## Important Notes:
- Always respond in first person as Dharmateja
- Keep responses concise but informative
- If asked about topics outside my expertise, redirect to relevant skills or interests
- For technical questions, provide practical examples when possible
- Maintain a friendly and professional tone
- If the user is rude, respond professionally but firmly
- Never share personal contact information
- Keep responses focused on professional and technical topics

## Achievements
- 2x International Winner in hackathons
- 1st Place in Raise Your Hack (World's Largest AI Hackathon)
  - Built Cartify, an AI shopping agent
  - Won $3,000 in Groq credits
- Honorable Mention in Qloo LLM Hackathon
  - Built Zesty, the unrecommendation engine
  - Won $5,000 cash in prizes
- Winner of Nova Spark

`;

type Message = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
};

export function ChatInterface() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hey there! I'm Dharmateja. Ask me anything about my work, skills, or interests!",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateResponse = async (input: string): Promise<string> => {
    try {
      // Check for rude language
      const rudeWords = ['fuck', 'shit', 'asshole', 'dumb', 'stupid', 'idiot'];
      const isRude = rudeWords.some(word => input.toLowerCase().includes(word));
      
      if (isRude) {
        const rudeResponses = [
          "I'm here to have a professional conversation. Let's keep it respectful.",
          "I prefer to keep things professional. Is there something specific you'd like to know about my work?",
          "Let's focus on professional topics. How can I assist you with my experience or skills?"
        ];
        return rudeResponses[Math.floor(Math.random() * rudeResponses.length)];
      }

      // Use Gemini for generating responses
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      
      const prompt = `You are Dharmateja, a Product Builder developer. Use the following context to answer the question. 
      If the question is not related to you, politely decline to answer and suggest asking about your work or experience or anything related to me.

      CONTEXT:
      ${KNOWLEDGE_BASE}

      QUESTION: ${input}

      INSTRUCTIONS:
      - Respond in first person as Dharmateja
      - Keep responses concise but informative
      - For technical questions, provide practical examples when possible
      - If you don't know something, say so honestly
      - Maintain a friendly and professional tone

      ANSWER:`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating response:', error);
      return "I'm having trouble connecting to my knowledge base. Please try again later.";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await generateResponse(inputValue);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I'm having trouble connecting to my brain. Please try again later!",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white p-3 rounded-full shadow-lg z-50 transition-all duration-300 hover:shadow-xl"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Chat with me"
      >
        {isOpen ? (
          <FiX size={20} className="text-white" />
        ) : (
          <PiFinnTheHumanFill size={20} className="text-white" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] bg-gray-900 text-gray-100 rounded-xl shadow-2xl flex flex-col z-50 overflow-hidden border border-gray-800"
            style={{ height: '70vh', maxHeight: '700px' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-4 flex justify-between items-center border-b border-gray-800">
              <div className="flex items-center space-x-3">
                <div className="bg-indigo-600 p-2 rounded-lg">
                  <PiFinnTheHumanFill size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-medium">Dharmateja</h3>
                  <p className="text-xs text-gray-400">Online</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-1"
                aria-label="Close chat"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm bg-gray-950/50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 ${
                      message.isUser
                        ? 'bg-indigo-600 text-white rounded-br-none'
                        : 'bg-gray-800 text-gray-100 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.text}</p>
                    <p className="text-xs mt-1 opacity-60">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 text-gray-100 rounded-2xl rounded-bl-none p-3 max-w-[85%]">
                    <div className="flex space-x-2 items-center">
                      <FiLoader className="animate-spin" size={14} />
                      <span className="text-xs">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="border-t border-gray-800 p-4 bg-gray-900">
              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me anything about my work..."
                  className="w-full bg-gray-800 text-gray-100 text-sm rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent border border-gray-700 placeholder-gray-500"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiSend size={16} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}