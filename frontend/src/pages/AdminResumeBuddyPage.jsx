import React, { useState } from 'react';
import { aiApi } from '../api/aiApi';
import { StatusBadge } from '../components/common/StatusBadge';
import { Sparkles, Send, Bot, User, RefreshCw, Zap, CheckCircle2, ChevronRight } from 'lucide-react';

export const AdminResumeBuddyPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hello! I'm **Resume Buddy AI**, your talent acquisition copilot. I can search candidate databases, evaluate technical match scores, or formulate tailored interview questions.\n\nTry asking me: \n• *'Find candidates with React and TypeScript'* \n• *'Who is our top match for Senior Full Stack Engineer?'* \n• *'Generate 3 interview questions for backend architecture'*",
      candidates: []
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: input
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentPrompt = input;
    setInput('');
    setLoading(true);

    try {
      const res = await aiApi.resumeBuddyChat(currentPrompt);
      const aiMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: res.data.reply,
        candidates: res.data.matchedCandidates || []
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: 'I encountered an issue querying the talent database. Please try again.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (promptText) => {
    setInput(promptText);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#70C100] text-black shadow-md shadow-[#70C100]/25">
            <Sparkles className="h-6 w-6 text-black" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              Resume Buddy AI Copilot
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Conversational intelligence engine connected to your candidate repository
            </p>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm flex flex-col h-[600px] overflow-hidden transition-colors">
        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 text-xs ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#70C100] text-black shadow-xs font-black">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`max-w-xl rounded-2xl p-4 space-y-3 ${
                  m.sender === 'user'
                    ? 'bg-[#70C100] text-black font-medium shadow-xs rounded-tr-xs'
                    : 'bg-gray-50 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-750 text-gray-800 dark:text-gray-200 rounded-tl-xs'
                }`}
              >
                <div className="whitespace-pre-line leading-relaxed font-normal">{m.text}</div>

                {/* Candidate Results Cards */}
                {m.candidates && m.candidates.length > 0 && (
                  <div className="mt-3 space-y-2 pt-2 border-t border-gray-200/60 dark:border-gray-700">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#4e8500] dark:text-[#84e000] block">
                      Matched Profiles from Database:
                    </span>
                    <div className="grid grid-cols-1 gap-2">
                      {m.candidates.map((cand) => (
                        <div
                          key={cand.id}
                          className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-850 p-2.5 flex items-center justify-between text-xs shadow-2xs"
                        >
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">{cand.name}</p>
                            <p className="text-[10px] text-gray-500 dark:text-gray-400">
                              {cand.role} • {cand.experienceYears} yrs experience
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="rounded bg-[#70C100]/15 dark:bg-[#70C100]/15 px-1.5 py-0.5 text-[10px] font-bold text-[#4e8500] dark:text-[#84e000] border border-[#70C100]/30">
                              {cand.matchScore}% Match
                            </span>
                            <StatusBadge stage={cand.stage} size="xs" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {m.sender === 'user' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gray-900 dark:bg-gray-700 text-white shadow-xs">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 text-xs justify-start">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#70C100] text-black">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-2xl bg-gray-50 dark:bg-gray-800/80 border border-gray-100 dark:border-gray-750 p-4 text-gray-500 dark:text-gray-400 flex items-center gap-2">
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-[#559400] dark:text-[#84e000]" />
                <span>Resume Buddy is analyzing candidate profiles...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50 px-4 py-2.5 flex flex-wrap gap-2 text-[11px]">
          <span className="font-semibold text-gray-400 dark:text-gray-500 self-center mr-1">Suggestions:</span>
          {[
            'Find React & Frontend engineers',
            'Find Full Stack developers with Node.js',
            'Find AI/ML candidates',
            'Suggest interview questions'
          ].map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => handleQuickPrompt(prompt)}
              className="rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-2.5 py-1 text-gray-700 dark:text-gray-300 hover:border-[#70C100] hover:text-[#4e8500] dark:hover:text-[#84e000] shadow-2xs transition-colors cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Prompt Input Bar */}
        <form onSubmit={handleSend} className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex gap-2">
          <input
            type="text"
            placeholder="Ask Resume Buddy anything about your candidates, skills, or interviews..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:border-[#70C100] focus:outline-hidden"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-xl bg-[#70C100] hover:bg-[#62aa00] px-5 py-2.5 text-xs font-black text-black shadow-md shadow-[#70C100]/25 disabled:opacity-50 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>

    </div>
  );
};

