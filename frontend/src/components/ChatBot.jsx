import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, MessageCircle } from 'lucide-react';
import { chatWithAI } from '../services/api';

export default function ChatBot({ onPlanUpdate }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! Ask me to plan meals, adjust your grocery list, or suggest budget-friendly swaps.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const response = await chatWithAI(userMessage, history);

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response.message || response.reply },
      ]);

      if (response.plan) {
        onPlanUpdate?.(response.plan);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Sorry, something went wrong: ${err.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card">
      <div className="mb-4 flex items-center gap-2">
        <MessageCircle size={20} className="text-sage-600" />
        <h2 className="font-semibold text-sage-900">AI Chat</h2>
      </div>

      <div className="mb-4 max-h-64 space-y-3 overflow-y-auto rounded-xl bg-cream-50 p-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                msg.role === 'user'
                  ? 'bg-sage-600 text-white'
                  : 'bg-white text-sage-800 shadow-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="input-field flex-1"
          disabled={loading}
        />
        <button type="submit" className="btn-primary px-4" disabled={loading || !input.trim()}>
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
        </button>
      </form>
    </section>
  );
}
