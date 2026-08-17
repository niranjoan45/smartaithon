import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCityStore } from '../stores/useCityStore';
import { Truck, ArrowRight, ShieldCheck, Activity } from 'lucide-react';

export function ResourcesPage() {
  const navigate = useNavigate();
  const { resources, selectResource } = useCityStore();
  const [filter, setFilter] = useState<'ALL' | 'AVAILABLE' | 'DISPATCHED' | 'BUSY'>('ALL');

  const filteredResources = resources.filter(r => filter === 'ALL' || r.status === filter);

  return (
    <div className="w-full h-full flex bg-[#111315] p-4 gap-4 font-mono text-xs overflow-hidden select-none text-[#E7E5DF]">
      <div className="flex-1 bg-[#191C1F] rounded-xl border border-[#3A3F42] p-5 flex flex-col gap-4 overflow-hidden">
        {/* Header & Filter Tabs */}
        <div className="flex justify-between items-center border-b border-[#3A3F42] pb-3">
          <div>
            <h2 className="font-orbitron font-bold text-base text-white">
              EMERGENCY FLEET MANAGEMENT
            </h2>
            <p className="text-[10px] text-[#A9AAA5]">Live Telemetry & Capability Monitoring</p>
          </div>

          <div className="flex gap-1.5 bg-[#111315] p-1 rounded border border-[#3A3F42]">
            {(['ALL', 'AVAILABLE', 'DISPATCHED', 'BUSY'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded text-[10px] font-bold transition-all ${
                  filter === tab
                    ? 'bg-amber-500 text-black shadow-md'
                    : 'text-[#A9AAA5] hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Resources Table */}
        <div className="flex-1 overflow-y-auto pr-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#3A3F42] text-[10px] text-[#A9AAA5] font-bold uppercase">
                <th className="py-2.5 px-3">CALLSIGN</th>
                <th className="py-2.5 px-3">TYPE</th>
                <th className="py-2.5 px-3">STATUS</th>
                <th className="py-2.5 px-3">DRIVER</th>
                <th className="py-2.5 px-3">SPEED</th>
                <th className="py-2.5 px-3">ASSIGNMENT</th>
                <th className="py-2.5 px-3">CAPABILITIES</th>
                <th className="py-2.5 px-3">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3A3F42]/60">
              {filteredResources.map((res) => (
                <tr
                  key={res.id}
                  onClick={() => {
                    selectResource(res.id);
                    navigate(`/resources/${res.id}`);
                  }}
                  className="cursor-pointer transition-all hover:bg-[#202427] text-[#E7E5DF]"
                >
                  <td className="py-3 px-3 font-bold text-white">{res.callsign}</td>
                  <td className="py-3 px-3">{res.type}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      res.status === 'AVAILABLE'
                        ? 'badge-success'
                        : 'badge-warning'
                    }`}>
                      {res.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[#A9AAA5]">{res.driverName}</td>
                  <td className="py-3 px-3 text-[#E7E5DF]">{res.speedKmH} km/h</td>
                  <td className="py-3 px-3 text-amber-400 font-bold">{res.currentIncidentId || 'Standby'}</td>
                  <td className="py-3 px-3">
                    <div className="flex flex-wrap gap-1">
                      {res.capabilities.map((cap, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 rounded text-[8px] bg-[#111315] text-[#A9AAA5] border border-[#3A3F42]">
                          {cap}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        selectResource(res.id);
                        navigate(`/resources/${res.id}`);
                      }}
                      className="p-1.5 rounded bg-[#202427] hover:bg-amber-500 text-white hover:text-black transition-all"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
