import React, { useState } from 'react';
import { signIn, signUp } from '../services/supabaseService';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
  isForced?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess, isForced = false }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (isLogin) {
        await signIn(email, password);
        onSuccess();
        onClose();
      } else {
        await signUp(email, password);
        // Don't close immediately on signup, show confirmation message
        setSuccessMsg('Registratie gelukt! Controleer je email inbox (en spam) om je account te bevestigen voordat je inlogt.');
        setIsLogin(true); // Switch to login view
      }
    } catch (err: any) {
      console.error(err);
      if (err.message && err.message.includes("Email not confirmed")) {
        setError("Je emailadres is nog niet bevestigd. Controleer je inbox.");
      } else if (err.message && err.message.includes("Invalid login credentials")) {
        setError("Ongeldig emailadres of wachtwoord.");
      } else {
        setError(err.message || 'Er is een fout opgetreden.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 animate-fade-in backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-sm p-8 shadow-2xl relative">
        {!isForced && (
           <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
               <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
             </svg>
           </button>
        )}

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">
            {isForced ? 'Limiet bereikt' : (isLogin ? 'Welkom terug' : 'Maak een account')}
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            {isForced 
              ? 'Je hebt je 3 gratis samenvattingen gebruikt. Log in of registreer om onbeperkt door te gaan.' 
              : (isLogin ? 'Log in om je notities te beheren' : 'Registreer voor onbeperkte toegang')}
          </p>
        </div>

        {successMsg && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-200">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
              placeholder="naam@voorbeeld.nl"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Wachtwoord</label>
            <input 
              type="password" 
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg border border-red-100">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? 'Laden...' : (isLogin ? 'Inloggen' : 'Registreren')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          {isLogin ? 'Nog geen account?' : 'Heb je al een account?'}
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(null); setSuccessMsg(null); }}
            className="text-primary font-bold ml-1 hover:underline focus:outline-none"
          >
            {isLogin ? 'Registreer hier' : 'Log in'}
          </button>
        </div>
      </div>
    </div>
  );
};