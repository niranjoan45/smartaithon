import React, { useState } from 'react';
import { X, Bot, Send } from 'lucide-react';
import { useCityStore } from '../../stores/useCityStore';

export function GuardianCopilot() {
  const { isCopilotOpen, setCopilotOpen } = useCityStore();

  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: 'Greetings Commander. I am GUARDIAN AI. I am evaluating spatial risk grid density, simulated category distributions, resource coverage gaps, and proactive pre-positioning benefits.'
    }
  ]);

  if (!isCopilotOpen) return null;

  const presetQuestions = [
    'Which zone has highest risk?',
    'Why is Zone A17 high risk?',
    'What incident type is most likely there?',
    'Where should we pre-position a fire truck?',
    'Is this a real prediction?'
  ];

  const handleAsk = (q: string) => {
    const userMsg = q || query;
    if (!userMsg.trim()) return;

    const newMsgs = [...messages, { sender: 'user' as const, text: userMsg }];
    setMessages(newMsgs);
    setQuery('');

    const state = useCityStore.getState();
    const zones = state.riskZones;
    const topZone = zones[0] || { id: 'ZONE-A17', riskScore: 87, riskLevel: 'HIGH', estimatedTimeSavedMin: 4.3 };
    const lower = userMsg.toLowerCase();
    let answer = '';

    if (lower.includes('real') || lower.includes('forecast') || lower.includes('accuracy')) {
      answer = 'This is a simulation-based predictive model using the application\'s synthetic incident density and spatial feature data. It is not a validated real-world forecast.';
    } else if (lower.includes('highest') || lower.includes('highest risk') || lower.includes('top risk')) {
      answer = `${topZone.id} (${topZone.name}) has the highest simulated risk score of ${topZone.riskScore}/100 [${topZone.riskLevel}].`;
    } else if (lower.includes('why') || lower.includes('a17')) {
      answer = `${topZone.id} is high risk due to: + High historical incident concentration, + 3 recent fused emergency incidents, + Weak local Fire Truck coverage (8.4m ETA gap).`;
    } else if (lower.includes('type') || lower.includes('likely') || lower.includes('category')) {
      answer = `The most likely incident type in ${topZone.id} is FIRE (64% simulated distribution), followed by ACCIDENT (21%) and MEDICAL (15%).`;
    } else if (lower.includes('pre-position') || lower.includes('truck') || lower.includes('save')) {
      answer = `We recommend pre-positioning 1 FIRE TRUCK near ${topZone.id}. This reduces projected emergency response time from 8.4m to 4.1m, saving 4.3 minutes!`;
    } else {
      answer = `Analyzing ${zones.length} spatial risk zones across the smart city grid. Top risk zone is ${topZone.id} (Risk Score ${topZone.riskScore}/100). [PREDICTIVE MODE: SIMULATION]`;
    }

    setTimeout(() => {
      setMessages([...newMsgs, { sender: 'ai', text: answer }]);
    }, 350);
  };

  return (
    <div className="fixed right-6 bottom-24 z-50 w-96 pointer-events-auto animate-fade-in">
      <div className="glass-panel-glow p-4 rounded-2xl border border-cyan-500/40 shadow-2xl flex flex-col h-[480px]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500 flex items-center justify-center text-cyan-400">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h3 className="font-orbitron font-bold text-xs text-cyan-300 hud-text-glow">
                GUARDIAN AI COPILOT
              </h3>
              <div className="text-[9px] font-mono text-slate-400">PREDICTIVE RISK ASSISTANT</div>
            </div>
          </div>
          <button 
            onClick={() => setCopilotOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Preset Questions Chips */}
        <div className="py-2 border-b border-slate-800/80 flex flex-wrap gap-1.5 overflow-x-auto">
          {presetQuestions.map((pq, idx) => (
            <button
              key={idx}
              onClick={() => handleAsk(pq)}
              className="px-2 py-1 rounded-lg bg-slate-900/80 border border-cyan-500/20 text-[10px] font-mono text-cyan-300 hover:bg-cyan-950/60 hover:border-cyan-400 transition-all whitespace-nowrap"
            >
              {pq}
            </button>
          ))}
        </div>

        {/* Chat Stream */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2.5 font-mono text-xs my-2">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-xl max-w-[85%] ${
                m.sender === 'user'
                  ? 'ml-auto bg-cyan-950/80 border border-cyan-500/30 text-cyan-100'
                  : 'mr-auto bg-slate-900/90 border border-slate-700/80 text-slate-200'
              }`}
            >
              {m.text}
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="pt-2 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk('')}
            placeholder="Ask about predictive risk..."
            className="flex-1 bg-slate-900/90 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-mono text-cyan-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
          <button
            onClick={() => handleAsk('')}
            className="px-3 py-2 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all font-bold"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
