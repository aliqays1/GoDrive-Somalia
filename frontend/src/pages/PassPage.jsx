import React from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { ShieldCheck, MapPin, Calendar, Car, Globe, UserCheck, Clock } from 'lucide-react';

export default function PassPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const carName = searchParams.get('car') || 'Vehicle';
  const loc = searchParams.get('loc') || 'GoDrive Station';
  const date = searchParams.get('date');
  const time = searchParams.get('time') || '14:00';
  const country = searchParams.get('country') || 'Unknown';
  const name = searchParams.get('name') || 'Unsigned';

  // Hardcoded to your local Wi-Fi IP
  const qrUrl = `http://192.168.100.159:3000/pass/${id}?${searchParams.toString()}`;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center p-6 justify-center">
      
      {/* Printable Ticket Pass Container */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl p-6 border border-emerald-500/30 shadow-glow-green text-center space-y-6 max-w-sm w-full relative overflow-hidden">
        
        <div className="flex items-center justify-center space-x-2 mb-2">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          <h3 className="text-lg font-bold text-white">Digital Pass</h3>
        </div>

        {/* Ticket Header Badge */}
        <div className="bg-emerald-500 text-slate-950 font-black text-xs uppercase tracking-widest py-1.5 px-5 rounded-full inline-block">
          GoDrive Official
        </div>

        <div className="space-y-1">
          <span className="text-[10px] text-slate-400 font-bold tracking-widest block uppercase">Reservation</span>
          <span className="text-2xl font-black tracking-widest text-emerald-400 font-mono">
            {id}
          </span>
        </div>

        {/* QR Code Container */}
        <div className="bg-white p-4 rounded-2xl inline-block shadow-lg mx-auto">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrUrl)}`}
            alt="Reservation QR Code"
            className="w-48 h-48 object-contain mx-auto"
          />
        </div>

        <p className="text-xs text-slate-400 font-medium">
          Show this QR code to Security Guards at the parking gate for immediate vehicle release.
        </p>

        {/* Pass Details */}
        <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 text-sm text-left space-y-3 text-slate-300">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="flex items-center text-slate-400">
              <UserCheck className="w-4 h-4 text-emerald-400 mr-2" /> Booker
            </span>
            <span className="font-bold text-white text-right max-w-[150px] truncate">{name}</span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="flex items-center text-slate-400">
              <Globe className="w-4 h-4 text-emerald-400 mr-2" /> Origin
            </span>
            <span className="font-bold text-white text-right max-w-[150px] truncate">{country}</span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="flex items-center text-slate-400">
              <Car className="w-4 h-4 text-emerald-400 mr-2" /> Vehicle
            </span>
            <span className="font-bold text-white max-w-[150px] text-right truncate">{carName}</span>
          </div>

          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="flex items-center text-slate-400">
              <MapPin className="w-4 h-4 text-emerald-400 mr-2" /> Station
            </span>
            <span className="font-bold text-white text-right max-w-[150px] truncate">{loc}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center text-slate-400">
              <Clock className="w-4 h-4 text-emerald-400 mr-2" /> Pickup
            </span>
            <span className="font-bold text-emerald-400 text-right">
              {date ? new Date(date).toLocaleDateString() : 'Date'} @ {time}
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
