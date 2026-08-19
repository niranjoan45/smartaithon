import React, { useState } from 'react';
import { 
  ShieldAlert, 
  PlusCircle, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  AlertTriangle, 
  Flame, 
  Camera, 
  Video, 
  Mic, 
  Navigation, 
  Radio, 
  UserCheck, 
  Upload,
  Trash2,
  Cpu
} from 'lucide-react';
import { useCityStore } from '../stores/useCityStore';
import { useAuthStore } from '../stores/useAuthStore';
import { EventSourceType } from '../types/incident';

export function UserDashboardPage() {
  const { user } = useAuthStore();
  const { normalizedIncidents, setReportModalOpen, ingestSourceEvent } = useCityStore();

  // Local report form state for embedded quick reporting
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('Sector 4 Innovation Tower');
  const [pictures, setPictures] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | undefined>();
  const [audioUrl, setAudioUrl] = useState<string | undefined>();
  const [gpsLocation, setGpsLocation] = useState<{ latitude: number; longitude: number; accuracy?: number } | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // GPS Location Capture
  const handleGPSLocation = () => {
    if (!navigator.geolocation) {
      const dynamicLat = Number((19.075 + (Math.random() * 0.03)).toFixed(4));
      const dynamicLon = Number((72.870 + (Math.random() * 0.03)).toFixed(4));
      setGpsLocation({ latitude: dynamicLat, longitude: dynamicLon, accuracy: 5 });
      setLocationName(`North Highway Interchange (GPS: ${dynamicLat}°N, ${dynamicLon}°E)`);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        setGpsLocation({ latitude, longitude, accuracy });
        setLocationName(`Live GPS Locked (${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E)`);
      },
      (err) => {
        const dynamicLat = Number((19.075 + (Math.random() * 0.03)).toFixed(4));
        const dynamicLon = Number((72.870 + (Math.random() * 0.03)).toFixed(4));
        setGpsLocation({ latitude: dynamicLat, longitude: dynamicLon, accuracy: 5 });
        setLocationName(`North Highway Interchange (GPS: ${dynamicLat}°N, ${dynamicLon}°E)`);
      },
      { enableHighAccuracy: true, timeout: 4000 }
    );
  };

  // Picture upload handler
  const handlePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPictures(prev => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Video upload handler
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoUrl(URL.createObjectURL(file));
  };

  // Audio upload handler
  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAudioUrl(URL.createObjectURL(file));
  };

  // Form submit handler
  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() && !description.trim()) return;

    setIsSubmitting(true);
    const now = Date.now();
    const event = {
      id: `SRC-CITIZEN-${Math.floor(Math.random() * 9000 + 1000)}`,
      sourceType: 'CITIZEN' as const,
      timestamp: now,
      formattedTime: new Date(now).toLocaleTimeString(),
      latitude: gpsLocation?.latitude || 19.082,
      longitude: gpsLocation?.longitude || 72.888,
      position3D: [
        Number(((Math.random() - 0.5) * 50).toFixed(1)), 
        0.5, 
        Number(((Math.random() - 0.5) * 50).toFixed(1))
      ] as [number, number, number],
      locationText: locationName,
      rawText: `${title}: ${description}`,
      confidence: 0.90,
      mediaType: 'TEXT' as const,
      mediaAttachments: {
        pictures: pictures.length > 0 ? pictures : undefined,
        videoUrl,
        audioUrl
      },
      gpsLocation: gpsLocation || { latitude: 19.082, longitude: 72.888, accuracy: 10 },
      metadata: { peopleAtRiskCount: 2 }
    };

    await ingestSourceEvent(event);
    setIsSubmitting(false);
    setSubmitSuccess(`Report submitted successfully! Fused with AI City Guardian canvas.`);
    setTitle('');
    setDescription('');
    setPictures([]);
    setVideoUrl(undefined);
    setAudioUrl(undefined);
    setTimeout(() => setSubmitSuccess(null), 5000);
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-950 p-6 text-slate-100 font-mono space-y-6">
      {/* Welcome Banner & Quick Action */}
      <div className="bg-gradient-to-r from-orange-950 via-slate-900 to-slate-950 border border-orange-600/40 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-orange-400 font-bold text-xs uppercase tracking-widest mb-1">
            <UserCheck className="w-4 h-4" />
            <span>CITIZEN PORTAL & EMERGENCY REPORTING</span>
          </div>
          <h1 className="text-2xl font-orbitron font-bold text-white">
            Welcome back, {user?.name || 'Alex Mercer'}
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Report emergencies with photos, video, audio & GPS location. Track real-time response dispatches and view live city safety bulletins.
          </p>
        </div>
        <button
          onClick={() => setReportModalOpen(true)}
          className="px-5 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-orbitron font-bold text-xs transition-all shadow-lg flex items-center gap-2 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>REPORT AN INCIDENT</span>
        </button>
      </div>

      {/* Grid Layout: Main Reporting Form + Safety Feed & Contacts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1 & 2: Quick Report Submission + Active Citizen Reports */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Direct Incident Reporting Box */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-orange-500 font-orbitron font-bold text-sm">
                <ShieldAlert className="w-5 h-5 text-orange-500 animate-pulse" />
                <span>NEW INCIDENT REPORT FORM</span>
              </div>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full">
                ROLE: CITIZEN / USER
              </span>
            </div>

            {submitSuccess && (
              <div className="bg-emerald-950/80 border border-emerald-500 text-emerald-300 p-3 rounded-xl flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{submitSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSubmitReport} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">INCIDENT TITLE / SUMMARY</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Smoke visible at Sector 4 Innovation Tower"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1 flex items-center justify-between">
                  <span>LOCATION / LANDMARK</span>
                  <button
                    type="button"
                    onClick={handleGPSLocation}
                    className="text-[10px] text-orange-400 hover:text-orange-300 flex items-center gap-1 font-bold underline"
                  >
                    <Navigation className="w-3 h-3" />
                    <span>USE GPS LOCATION</span>
                  </button>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-white focus:outline-none focus:border-orange-500"
                  />
                  <MapPin className="w-4 h-4 text-orange-500 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">DETAILED DESCRIPTION</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe visible hazard, smoke color, victims, vehicle types..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Media Attachments Section */}
              <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-3">
                <div className="text-[11px] font-bold text-orange-400 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Attach Media Files (Photos, Video Clips, Audio Record)</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {/* Photo Upload */}
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg space-y-2">
                    <div className="font-bold text-blue-400 flex items-center gap-1.5 text-[11px]">
                      <Camera className="w-3.5 h-3.5" />
                      <span>Upload Photos</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePictureUpload}
                      className="block w-full text-[10px] text-slate-400 file:py-1 file:px-2 file:rounded file:border-0 file:bg-blue-950 file:text-blue-300 cursor-pointer"
                    />
                    {pictures.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {pictures.map((p, i) => (
                          <img key={i} src={p} alt="Thumbnail" className="w-10 h-10 object-cover rounded border border-slate-700" />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Video Upload */}
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg space-y-2">
                    <div className="font-bold text-purple-400 flex items-center gap-1.5 text-[11px]">
                      <Video className="w-3.5 h-3.5" />
                      <span>Upload Video</span>
                    </div>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="block w-full text-[10px] text-slate-400 file:py-1 file:px-2 file:rounded file:border-0 file:bg-purple-950 file:text-purple-300 cursor-pointer"
                    />
                    {videoUrl && (
                      <span className="text-[10px] text-purple-300 font-bold block truncate">✔ Video Attached</span>
                    )}
                  </div>

                  {/* Audio Upload */}
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg space-y-2">
                    <div className="font-bold text-emerald-400 flex items-center gap-1.5 text-[11px]">
                      <Mic className="w-3.5 h-3.5" />
                      <span>Upload Audio</span>
                    </div>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioUpload}
                      className="block w-full text-[10px] text-slate-400 file:py-1 file:px-2 file:rounded file:border-0 file:bg-emerald-950 file:text-emerald-300 cursor-pointer"
                    />
                    {audioUrl && (
                      <span className="text-[10px] text-emerald-300 font-bold block truncate">✔ Audio Attached</span>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-orbitron font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Cpu className="w-4 h-4" />
                <span>{isSubmitting ? 'PROCESSING REPORT...' : 'SUBMIT INCIDENT REPORT'}</span>
              </button>
            </form>
          </div>

          {/* Active Citizen Reports Track List */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 font-orbitron font-bold text-sm text-white">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>LIVE INCIDENTS & DISPATCH FEED</span>
              </div>
              <span className="text-xs text-slate-400">{normalizedIncidents.length} Active Incidents</span>
            </div>

            <div className="space-y-3">
              {normalizedIncidents.map((inc) => (
                <div 
                  key={inc.id} 
                  className="bg-slate-950 border border-slate-800 p-4 rounded-xl space-y-2 hover:border-orange-500/50 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        inc.severity === 'P1' ? 'bg-red-950 text-red-400 border border-red-800' :
                        inc.severity === 'P2' ? 'bg-orange-950 text-orange-400 border border-orange-800' :
                        'bg-slate-800 text-slate-300'
                      }`}>
                        {inc.severity} Severity
                      </span>
                      <span className="font-bold text-white text-xs">{inc.id}</span>
                      <span className="text-[11px] text-slate-400">• {inc.type}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {inc.formattedTimeAgo}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 font-medium">{inc.rawText}</p>

                  {/* Media & GPS Badges */}
                  <div className="flex flex-wrap gap-2 text-[10px]">
                    {inc.mediaAttachments?.pictures && inc.mediaAttachments.pictures.length > 0 && (
                      <span className="bg-blue-950 text-blue-400 border border-blue-800 px-2 py-0.5 rounded font-bold">
                        📷 {inc.mediaAttachments.pictures.length} Photos Attached
                      </span>
                    )}
                    {inc.mediaAttachments?.videoUrl && (
                      <span className="bg-purple-950 text-purple-400 border border-purple-800 px-2 py-0.5 rounded font-bold">
                        🎥 Video Clip Attached
                      </span>
                    )}
                    {inc.mediaAttachments?.audioUrl && (
                      <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-bold">
                        🎙 Audio Clip Attached
                      </span>
                    )}
                    {inc.gpsLocation && (
                      <span className="bg-amber-950 text-amber-400 border border-amber-800 px-2 py-0.5 rounded font-bold">
                        📍 GPS Locked ({inc.gpsLocation.latitude.toFixed(4)}°, {inc.gpsLocation.longitude.toFixed(4)}°)
                      </span>
                    )}
                  </div>

                  {/* Real-time Status & Admin Dispatch Tracker */}
                  <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-900 gap-2">
                    <div className="flex items-center gap-1.5 text-slate-300 font-bold">
                      <MapPin className="w-3.5 h-3.5 text-orange-400" />
                      <span>{inc.locationText}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {inc.assignedResourceId && (
                        <span className="text-emerald-300 font-bold bg-emerald-950 border border-emerald-700 px-2.5 py-1 rounded-lg text-[10px] flex items-center gap-1 animate-pulse">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Admin Dispatched: {inc.assignedResourceId} (ETA 3.2m)</span>
                        </span>
                      )}
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold ${
                        inc.status === 'ACTIVE' ? 'bg-red-950 text-red-300 border border-red-800' :
                        inc.status === 'DISPATCHED' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                        'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        {inc.status === 'ACTIVE' ? 'STATUS: ACTIVE (AWAITING DISPATCH)' :
                         inc.status === 'DISPATCHED' ? 'STATUS: DISPATCHED & EN ROUTE' :
                         'STATUS: RESOLVED & CONTAINED'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Column 3: Safety Bulletins & Emergency Directory */}
        <div className="space-y-6">

          {/* Live Safety Bulletins */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg space-y-3">
            <div className="flex items-center gap-2 font-orbitron font-bold text-xs text-orange-400 border-b border-slate-800 pb-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <span>LIVE CITY SAFETY BULLETINS</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-orange-950/40 border border-orange-800 p-3 rounded-xl space-y-1">
                <div className="font-bold text-orange-300 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Sector 4 Safety Advisory</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Fire dispatch active at Sector 4 Innovation Tower. Avoid North Highway interchange to allow emergency responders clear passage.
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl space-y-1">
                <div className="font-bold text-cyan-300 flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5" />
                  <span>AI Guardian Telemetry Active</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Autonomous sensor array monitoring acoustic & optical feeds across all 5 municipal sectors.
                </p>
              </div>
            </div>
          </div>

          {/* Emergency Hotlines Directory */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg space-y-3">
            <div className="flex items-center gap-2 font-orbitron font-bold text-xs text-white border-b border-slate-800 pb-2">
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>EMERGENCY SERVICES DIRECTORY</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Fire & Rescue Control</div>
                  <div className="text-[10px] text-slate-400">Structural & Industrial Fire</div>
                </div>
                <span className="font-mono font-bold text-orange-400 text-sm">101</span>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Emergency Medical Dispatch</div>
                  <div className="text-[10px] text-slate-400">Trauma & Ambulance Response</div>
                </div>
                <span className="font-mono font-bold text-red-400 text-sm">102</span>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Police Central Precinct</div>
                  <div className="text-[10px] text-slate-400">Law Enforcement & Traffic</div>
                </div>
                <span className="font-mono font-bold text-blue-400 text-sm">100</span>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Disaster Management Command</div>
                  <div className="text-[10px] text-slate-400">Municipal Crisis Hotline</div>
                </div>
                <span className="font-mono font-bold text-emerald-400 text-sm">108</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
