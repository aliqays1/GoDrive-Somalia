import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Clock, MapPin, ShieldCheck, FileText, Camera, CreditCard, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import DigitalContractModal from '../components/DigitalContractModal';
import EvidenceUploadModal from '../components/EvidenceUploadModal';
import SomaliPaymentModal from '../components/SomaliPaymentModal';
import QRPassModal from '../components/QRPassModal';

const COUNTRIES = [
  { name: 'Afghanistan', code: 'af' },
  { name: 'Albania', code: 'al' },
  { name: 'Algeria', code: 'dz' },
  { name: 'Andorra', code: 'ad' },
  { name: 'Angola', code: 'ao' },
  { name: 'Antigua and Barbuda', code: 'ag' },
  { name: 'Argentina', code: 'ar' },
  { name: 'Australia', code: 'au' },
  { name: 'Canada', code: 'ca' },
  { name: 'China', code: 'cn' },
  { name: 'Djibouti', code: 'dj' },
  { name: 'Egypt', code: 'eg' },
  { name: 'Ethiopia', code: 'et' },
  { name: 'France', code: 'fr' },
  { name: 'Georgia', code: 'ge' },
  { name: 'Germany', code: 'de' },
  { name: 'India', code: 'in' },
  { name: 'Italy', code: 'it' },
  { name: 'Kenya', code: 'ke' },
  { name: 'Netherlands', code: 'nl' },
  { name: 'Oman', code: 'om' },
  { name: 'Qatar', code: 'qa' },
  { name: 'Saudi Arabia', code: 'sa' },
  { name: 'Somalia', code: 'so' },
  { name: 'South Africa', code: 'za' },
  { name: 'Sweden', code: 'se' },
  { name: 'Turkey', code: 'tr' },
  { name: 'United Arab Emirates', code: 'ae' },
  { name: 'United Kingdom', code: 'gb' },
  { name: 'United States of America', code: 'us' },
  { name: 'Yemen', code: 'ye' }
];

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [car, setCar] = useState(null);

  // Form step state
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [pickupTime, setPickupTime] = useState('14:00');
  const [pickupType, setPickupType] = useState('Airport Pickup');
  const [pickupLocation, setPickupLocation] = useState('Aden Adde Airport Parking B');
  const [originCountry, setOriginCountry] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const filteredCountries = COUNTRIES.filter(c => c.name.toLowerCase().includes(originCountry.toLowerCase()));

  // Completed steps & modals
  const [signedName, setSignedName] = useState('');
  const [evidenceData, setEvidenceData] = useState(null);
  const [completedReservation, setCompletedReservation] = useState(null);

  const [showContract, setShowContract] = useState(false);
  const [showEvidence, setShowEvidence] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    axios.get(`/api/cars/${id}`)
      .then(res => setCar(res.data))
      .catch(() => {
        setCar({
          _id: id,
          name: 'Toyota Land Cruiser V8 VX-R 2024',
          dailyRate: 150,
          weeklyRate: 900,
          monthlyRate: 3200,
          licensePlate: 'SMR-9901',
          images: ['https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=800&q=80']
        });
      });
  }, [id]);

  // Calculations
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  const rentalDays = diffTime > 120 ? 120 : diffTime;

  let baseRate = 0;
  let discountPct = 0;

  if (car) {
    if (rentalDays >= 30) {
      const m = Math.floor(rentalDays / 30);
      const r = rentalDays % 30;
      baseRate = (m * car.monthlyRate) + (r * car.dailyRate);
      discountPct = 0.15;
    } else if (rentalDays >= 7) {
      const w = Math.floor(rentalDays / 7);
      const r = rentalDays % 7;
      baseRate = (w * car.weeklyRate) + (r * car.dailyRate);
      discountPct = 0.10;
    } else {
      baseRate = rentalDays * car.dailyRate;
    }
  }

  const discount = baseRate * discountPct;
  const netRental = baseRate - discount;
  const insuranceFee = 25;
  const tax = netRental * 0.05;
  const deposit = 100;
  const totalAmount = netRental + insuranceFee + tax + deposit;

  const handlePaymentSuccess = (paymentDetails) => {
    setShowPayment(false);

    // Call API to register booking
    const bookingPayload = {
      carId: car._id,
      startDate,
      endDate,
      pickupTime,
      originCountry,
      pickupType,
      pickupLocation,
      rentalDays,
      basePrice: baseRate,
      discount,
      insuranceFee,
      tax,
      deposit,
      totalAmount,
      digitalSignature: signedName || user?.name,
      paymentMethod: paymentDetails.paymentMethod
    };

    axios.post('/api/reservations', bookingPayload)
      .then(res => {
        setCompletedReservation(res.data.reservation);
        setShowQR(true);
      })
      .catch(() => {
        // Fallback local
        const mockRes = {
          _id: `res-${Date.now()}`,
          reservationNumber: `SMR-2026-${Math.floor(10000 + Math.random() * 90000)}`,
          startDate,
          endDate,
          pickupTime,
          pickupType,
          pickupLocation,
          rentalDays,
          totalAmount,
          paymentMethod: paymentDetails.paymentMethod,
          paymentStatus: 'Paid',
          status: 'Confirmed'
        };
        setCompletedReservation(mockRes);
        setShowQR(true);
      });
  };

  if (!car) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Complete Vehicle Reservation</h1>
        <p className="text-xs text-slate-400">Follow the 3-step checkout to secure your car in Somalia.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Booking Form & Step Cards */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Step 1: Schedule & Pickup Location */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center">
              <Calendar className="w-4 h-4 mr-2" /> Step 1: Pickup Schedule & Location
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Arrival Date</label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    if (e.target.value > endDate) setEndDate(e.target.value);
                  }}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Return Date</label>
                <input
                  type="date"
                  min={startDate}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Pickup Time</label>
                <input
                  type="time"
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-emerald-500"
                />
              </div>

              <div className="relative">
                <label className="text-xs text-slate-400 mb-1 block">Expected Country of Origin</label>
                <input
                  type="text"
                  placeholder="Where are you traveling from?"
                  value={originCountry}
                  onChange={(e) => {
                    setOriginCountry(e.target.value);
                    setShowCountryDropdown(true);
                  }}
                  onFocus={() => setShowCountryDropdown(true)}
                  onBlur={() => setTimeout(() => setShowCountryDropdown(false), 200)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-emerald-500"
                />
                
                {/* Custom Autocomplete Dropdown */}
                {showCountryDropdown && (
                  <div className="absolute z-50 w-full mt-1 bg-slate-50 border border-slate-300 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                    {filteredCountries.map((country, idx) => (
                      <div
                        key={idx}
                        onMouseDown={(e) => {
                          e.preventDefault(); // Prevents input onBlur from firing first
                          setOriginCountry(country.name);
                          setShowCountryDropdown(false);
                        }}
                        className="px-4 py-2 cursor-pointer hover:bg-slate-200 flex items-center text-slate-900 text-sm"
                      >
                        <img 
                          src={`https://flagcdn.com/w20/${country.code}.png`}
                          srcSet={`https://flagcdn.com/w40/${country.code}.png 2x`}
                          width="20"
                          alt={country.name}
                          className="mr-3 shadow-sm rounded-sm"
                        />
                        <span className="w-8 text-slate-600 font-medium">{country.code.toUpperCase()}</span>
                        <span className={originCountry === country.name ? "font-bold text-blue-600" : ""}>{country.name}</span>
                      </div>
                    ))}
                    {filteredCountries.length === 0 && (
                      <div className="px-4 py-3 text-slate-500 text-sm text-center">No countries found</div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs text-slate-400 mb-1 block">Pickup Method</label>
                <select
                  value={pickupType}
                  onChange={(e) => setPickupType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-emerald-500"
                >
                  <option value="Airport Pickup">Airport Terminal Pickup</option>
                  <option value="Hotel Pickup">Hotel Escort Pickup</option>
                  <option value="Self Pickup">Self Pickup at Fleet Bay</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">Station Bay Address</label>
              <select
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-emerald-500"
              >
                <option value="Aden Adde Airport Parking B">Aden Adde Airport Parking B</option>
                <option value="Hargeisa Egal Airport Gates">Hargeisa Egal Airport Gates</option>
                <option value="Kismayo National Parks">Kismayo National Parks</option>
                <option value="Garowe City Center Hub">Garowe City Center Hub</option>
                <option value="Bosaso Port Plaza">Bosaso Port Plaza</option>
              </select>
            </div>
          </div>

          {/* Step 2: Digital Contract */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center">
              <FileText className="w-4 h-4 mr-2" /> Step 2: Legal Agreement
            </h3>

            <div className="grid grid-cols-1 gap-4">
              
              {/* Contract Button */}
              <button
                type="button"
                onClick={() => setShowContract(true)}
                className={`p-4 rounded-2xl border text-left transition flex items-center justify-between ${
                  signedName
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="space-y-1">
                  <span className="text-xs font-bold block">1. Sign Digital Rental Contract</span>
                  <span className="text-[11px] text-slate-400 block">
                    {signedName ? `Signed by: ${signedName}` : 'Requires e-signature consent'}
                  </span>
                </div>
                {signedName ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <FileText className="w-5 h-5 text-slate-500" />}
              </button>

            </div>
          </div>

          {/* Step 3: Checkout Action */}
          <button
            type="button"
            onClick={() => {
              if (!pickupTime) {
                alert('Please enter your expected pickup time.');
                return;
              }
              if (!originCountry) {
                alert('Please select your Expected Country of Origin.');
                return;
              }

              const today = new Date().toISOString().split('T')[0];
              if (startDate < today) {
                alert('Arrival Date cannot be in the past.');
                return;
              }
              if (endDate < startDate) {
                alert('Return Date cannot be before the Arrival Date.');
                return;
              }
              if (!signedName) {
                setShowContract(true);
                return;
              }
              setShowPayment(true);
            }}
            className="w-full py-4 rounded-2xl font-black text-sm bg-gradient-to-r from-emerald-500 to-emerald-400 text-slate-950 hover:from-emerald-400 hover:to-emerald-300 shadow-glow-green transition flex items-center justify-center space-x-2"
          >
            <CreditCard className="w-5 h-5" />
            <span>Pay & Generate Boarding Pass (${totalAmount.toFixed(2)} USD)</span>
          </button>

        </div>

        {/* Right: Booking Summary Column */}
        <div>
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 sticky top-24">
            
            <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
              <img src={car.images?.[0]} alt={car.name} className="w-16 h-12 object-cover rounded-xl border border-slate-800" />
              <div>
                <h4 className="text-xs font-bold text-white leading-tight">{car.name}</h4>
                <span className="text-[11px] text-slate-400">{rentalDays} Days Rental</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Base Rate ({rentalDays} Days)</span>
                <span className="font-bold text-white">${baseRate.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Discount ({(discountPct * 100).toFixed(0)}%)</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-300">
                <span>Comprehensive Insurance</span>
                <span>${insuranceFee.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span>Local Govt Tax (5%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-slate-300">
                <span>Refundable Deposit</span>
                <span>${deposit.toFixed(2)}</span>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                <span className="text-sm font-bold text-white">Total Charge</span>
                <span className="text-2xl font-black text-emerald-400">${totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center text-emerald-400 font-bold">
                <Lock className="w-3.5 h-3.5 mr-1" /> Accepted Payment Modes
              </div>
              <p>PayPal • Visa • MasterCard • EVC Plus • Zaad • Sahal</p>
            </div>

          </div>
        </div>

      </div>

      {/* Modals */}
      {showContract && (
        <DigitalContractModal
          car={car}
          user={user}
          onAccept={(sig) => {
            setSignedName(sig);
            setShowContract(false);
          }}
          onClose={() => setShowContract(false)}
        />
      )}

      {showEvidence && (
        <EvidenceUploadModal
          reservation={{ reservationNumber: 'SMR-2026-NEW' }}
          onComplete={(data) => {
            setEvidenceData(data);
            setShowEvidence(false);
          }}
          onClose={() => setShowEvidence(false)}
        />
      )}

      {showPayment && (
        <SomaliPaymentModal
          amount={totalAmount}
          onPaymentSuccess={handlePaymentSuccess}
          onClose={() => setShowPayment(false)}
        />
      )}

      {showQR && (
        <QRPassModal
          reservation={completedReservation}
          car={car}
          onClose={() => {
            setShowQR(false);
            navigate('/my-bookings');
          }}
        />
      )}

    </div>
  );
}
