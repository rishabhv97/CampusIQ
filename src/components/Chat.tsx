import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User, MessageSquare } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '../lib/utils';
import { queryPlacementData } from '../services/gemini';
import { DashboardData, ChatMessage } from '../types';

interface ChatProps {
  data: DashboardData;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export function Chat({ data, messages, setMessages }: ChatProps) {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await queryPlacementData(input, data, messages);
      const botMessage: ChatMessage = { 
        role: 'model', 
        content: response.text || "I'm sorry, I couldn't process that.",
        urls: response.urls
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', content: "Error: Failed to get response from Gemini." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-full bg-white rounded-[2rem] border-none shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-white flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#8A4FFF] flex items-center justify-center text-white shadow-sm">
          <Bot size={20} />
        </div>
        <div>
          <h3 className="text-lg font-black text-[#111111] tracking-tight">Placement Intelligence Assistant</h3>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ask about companies, salaries, or trends</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-200">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 rounded-2xl bg-[#F4F4F5] flex items-center justify-center text-[#111111] mb-6">
              <MessageSquare size={32} />
            </div>
            <h4 className="text-2xl font-black text-[#111111] mb-2 tracking-tight">How can I help you?</h4>
            <p className="text-sm text-gray-500 font-medium max-w-xs">
              Ask questions like "Which companies visited for ECE in 2023?" or "What is the average salary trend?"
            </p>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={cn(
              "flex gap-4 max-w-[85%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-xl shrink-0 flex items-center justify-center shadow-sm",
              msg.role === 'user' ? "bg-[#111111] text-white" : "bg-[#8A4FFF] text-white"
            )}>
              {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
            </div>
            <div className="flex flex-col gap-2">
              <div className={cn(
                "p-4 rounded-[1.5rem] text-sm leading-relaxed shadow-sm",
                msg.role === 'user' 
                  ? "bg-[#111111] text-white rounded-tr-none" 
                  : "bg-[#F4F4F5] text-[#111111] rounded-tl-none overflow-x-auto"
              )}>
                <div className={cn(
                  "prose prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-gray-900 prose-pre:text-white prose-table:w-full prose-table:border-collapse prose-th:border prose-th:border-gray-200 prose-th:bg-white prose-th:p-3 prose-td:border prose-td:border-gray-200 prose-td:p-3 prose-td:bg-white",
                  msg.role === 'user' && "prose-invert"
                )}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
              {msg.urls && msg.urls.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-1">
                  {msg.urls.map((url, i) => (
                    <a 
                      key={i} 
                      href={url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-500 hover:text-[#8A4FFF] hover:border-[#8A4FFF] transition-colors truncate max-w-[200px]"
                    >
                      <span className="truncate">{new URL(url).hostname}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4 mr-auto max-w-[85%]">
            <div className="w-10 h-10 rounded-xl shrink-0 bg-[#8A4FFF] text-white flex items-center justify-center shadow-sm">
              <Bot size={18} />
            </div>
            <div className="p-4 rounded-[1.5rem] bg-[#F4F4F5] text-[#111111] rounded-tl-none flex items-center gap-2 shadow-sm">
              <Loader2 size={16} className="animate-spin text-[#8A4FFF]" />
              <span className="text-sm font-medium text-gray-500 italic">Gemini is thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-gray-100 bg-white">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question..."
            className="w-full pl-6 pr-14 py-4 bg-[#F4F4F5] border-none rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#8A4FFF]/20 transition-all text-[#111111] placeholder:text-gray-400"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={cn(
              "absolute right-2 p-3 rounded-xl transition-all",
              input.trim() && !isLoading 
                ? "bg-[#8A4FFF] text-white hover:bg-[#7A3EEF] shadow-sm" 
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            )}
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}
