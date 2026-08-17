import React, { useState } from 'react';
import { X, Bot, Send } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useCityStore } from '../../stores/useCityStore';

export function CopilotDrawer() {
  const location = useLocation();
  const { isCopilotOpen, setCopilotOpen, riskZones, normalizedIncidents, resources } = useCityStore();
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: 'Greetings Commander. I am GUARDIAN AI. I am monitoring live incident signals, optimization solver state, and predictive risk grids.'
    }
  ]);

  if (!isCopilotOpen) return null;

  const handleAsk = (q: string) => {
    const userMsg = q || query;
    if (!userMsg.trim()) return;

    const newMsgs = [...messages, { sender: 'user' as const, text: userMsg }];
    setMessages(newMsgs);
    setQuery('');

    const lower = userMsg.toLowerCase();
    let answer = '';

    if (location.pathname.startsWith('/incidents')) {
      const topInc = normalizedIncidents[0] || { id: 'INC-1051', severity: 'P1', severityScore: 94 };
      answer = `Currently investigating ${normalizedIncidents.length} active emergency incidents. Top critical incident is ${topInc.id} (${topInc.severity} severity score ${topInc.severityScore}/100).`;
    } else if (location.pathname.startsWith('/resources')) {
      answer = `Monitoring ${resources.length} emergency units (${resources.filter(r => r.status === 'DISPATCHED').length} dispatched, ${resources.filter(r => r.status === 'AVAILABLE').length} available).`;
    } else if (location.pathname.startsWith('/risk')) {
      const topZone = riskZones[0] || { id: 'ZONE-A17', riskScore: 87 };
      answer = `${topZone.id} has highest simulated risk (${topZone.riskScore}/100 HIGH). Recommended: Pre-position 1 Fire Truck (-4.3m response saved).`;
    } else if (lower.includes('real') || lower.includes('forecast')) {
      answer = 'This is a simulation-based predictive model using synthetic data. It is not a validated real-world forecast.';
    } else {
      answer = `AI City Guardian online. Systems operational across PostgreSQL persistence, Phase 3 optimization, Phase 4 multi-source fusion, and Phase 5 risk prediction.`;
    }

    setTimeout(() => {
      setMessages([...newMsgs, { sender: 'ai', text: answer }]);
    }, 350);
  };

  return (
    <div className="fixed right-0 top-14 bottom-0 z-50 w-96 bg-white/95 backdrop-blur-md border-l border-slate-200 shadow-2xl flex flex-col font-mono text-xs select-none animate-slide-in text-slate-900">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-orange-50/80">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-orange-600 animate-pulse" />
          <div>
            <h3 className="font-orbitron font-bold text-xs text-slate-900">GUARDIAN AI ASSISTANT</h3>
            <p className="text-[9px] text-slate-600">Context-Aware Operations Copilot</p>
          </div>
        </div>
        <button
          onClick={() => setCopilotOpen(false)}
          className="p-1 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Stream Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-xl max-w-[90%] leading-relaxed ${
              m.sender === 'user'
                ? 'ml-auto bg-orange-600 text-white font-medium shadow-sm'
                : 'mr-auto bg-slate-100 border border-slate-200 text-slate-900'
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-3 border-t border-slate-200 bg-slate-50 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAsk('')}
          placeholder="Ask Guardian Copilot..."
          className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500"
        />
        <button
          onClick={() => handleAsk('')}
          className="px-3 py-2 rounded-xl bg-orange-600 text-white hover:bg-orange-500 font-bold"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
