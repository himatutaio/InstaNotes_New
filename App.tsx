import React, { useState, useEffect, useCallback } from 'react';
import { EducationLevel, NoteData } from './types';
import * as StorageService from './services/storageService';
import * as GeminiService from './services/geminiService';
import { supabase, signOut } from './services/supabaseService';
import { LiveTutor } from './components/LiveTutor';
import { User } from '@supabase/supabase-js';

// --- Sub-Components ---

// 1. Auth Modal
const AuthModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  forcedMessage?: string;
}> = ({ isOpen, onClose, initialMode = 'login', forcedMessage }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setMode(initialMode);
    setError('');
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        // Auto sign in happens usually, or allow user to switch to login if confirmation needed
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
      onClose();
    } catch (err: any) {
      setError(err.message || "Er ging iets mis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-2xl font-bold text-gray-800">
               {mode === 'login' ? 'Inloggen' : 'Registreren'}
             </h2>
             {!forcedMessage && (
               <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                 </svg>
               </button>
             )}
          </div>

          {forcedMessage && (
            <div className="bg-indigo-50 border border-indigo-100 text-indigo-800 text-sm p-3 rounded-xl mb-6">
              {forcedMessage}
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
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
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
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Laden...' : (mode === 'login' ? 'Inloggen' : 'Registreren')}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            {mode === 'login' ? (
              <>
                Nog geen account?{' '}
                <button onClick={() => setMode('signup')} className="text-primary font-semibold hover:underline">
                  Registreer hier
                </button>
              </>
            ) : (
              <>
                Heb je al een account?{' '}
                <button onClick={() => setMode('login')} className="text-primary font-semibold hover:underline">
                  Log in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. Level Selector
const LevelSelector: React.FC<{ 
  onSelect: (level: EducationLevel) => void;
  selectedLevel?: EducationLevel 
}> = ({ onSelect, selectedLevel }) => {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-md w-full mx-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Kies je niveau</h2>
      <p className="text-gray-500 text-center mb-6 text-sm">We passen de samenvatting aan op jouw onderwijsniveau.</p>
      <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto no-scrollbar">
        {Object.values(EducationLevel).map((level) => (
          <button
            key={level}
            onClick={() => onSelect(level)}
            className={`p-3 text-sm font-medium rounded-xl border transition-all ${
              selectedLevel === level
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/30'
                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
            }`}
          >
            {level}
          </button>
        ))}
      </div>
    </div>
  );
};

// 3. Note Detail View
const NoteDetail: React.FC<{ 
  note: NoteData; 
  onBack: () => void;
  onNext: () => void;
  onShare: () => void;
  onLiveTutor: () => void;
}> = ({ note, onBack, onNext, onShare, onLiveTutor }) => {
  const [searchContext, setSearchContext] = useState<string | null>(null);
  const [loadingContext, setLoadingContext] = useState(false);
  const [isImageOpen, setIsImageOpen] = useState(false);

  const handleDeepDive = async () => {
    setLoadingContext(true);
    const result = await GeminiService.getMoreContext(note.title);
    setSearchContext(result);
    setLoadingContext(false);
  }

  return (
    <>
      {/* Fullscreen Image Modal */}
      {isImageOpen && note.originalImageBase64 && (
        <div 
            className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center animate-fade-in p-2 cursor-zoom-out"
            onClick={() => setIsImageOpen(false)}
        >
            <button 
                onClick={() => setIsImageOpen(false)}
                className="absolute top-6 right-6 text-white bg-white/20 p-2 rounded-full backdrop-blur-md z-50 hover:bg-white/30 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <img 
                src={note.originalImageBase64} 
                alt="Full view" 
                className="max-w-full max-h-full object-contain rounded-sm"
                onClick={(e) => e.stopPropagation()} 
            />
        </div>
      )}

      <div className="flex flex-col h-full bg-white animate-fade-in pb-20 overflow-y-auto">
        {/* Header Image */}
        <div 
            className="relative w-full h-48 bg-gray-200 shrink-0 cursor-zoom-in group"
            onClick={() => note.originalImageBase64 && setIsImageOpen(true)}
        >
          {note.originalImageBase64 ? (
              <img src={note.originalImageBase64} alt="Source" className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
          ) : (
              <div className="flex items-center justify-center h-full text-gray-400">Geen afbeelding</div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4 pointer-events-none">
              <h1 className="text-2xl font-bold text-white line-clamp-2">{note.title}</h1>
          </div>
          
          <button 
            onClick={(e) => {
                e.stopPropagation();
                onBack();
            }} 
            className="absolute top-4 left-4 bg-black/30 p-2 rounded-full text-white backdrop-blur-md hover:bg-black/50 transition-colors z-10"
          >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
          </button>

          {note.originalImageBase64 && (
            <div className="absolute top-4 right-4 bg-black/30 p-2 rounded-full text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 15h-4.5m4.5 0v-4.5m0 4.5L15 15M3.75 20.25h4.5m-4.5 0v-4.5m0 4.5L9 15" />
                </svg>
            </div>
          )}
        </div>

        <div className="p-5 space-y-6">
          {/* Controls */}
          <div className="flex items-center gap-3">
               <button onClick={onShare} className="flex-1 p-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                  </svg>
                  <span>Delen</span>
               </button>
          </div>

          {/* Live Tutor Button */}
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-4 text-white flex items-center justify-between shadow-lg cursor-pointer" onClick={onLiveTutor}>
              <div>
                  <h3 className="font-bold text-lg">Hulp nodig?</h3>
                  <p className="text-white/80 text-sm">Praat met je AI docent over deze stof.</p>
              </div>
              <div className="bg-white/20 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                  </svg>
              </div>
          </div>

          {/* Summary */}
          <div className="bg-background rounded-2xl p-5">
              <h3 className="font-bold text-lg text-gray-800 mb-3 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Kernpunten
              </h3>
              <ul className="space-y-3">
                  {note.summaryPoints.map((point, idx) => (
                      <li key={idx} className="flex gap-3 text-gray-700 leading-relaxed">
                          <span className="text-primary font-bold">•</span>
                          <span>{point}</span>
                      </li>
                  ))}
              </ul>
          </div>

          {/* Difficult Words */}
          <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100">
               <h3 className="font-bold text-lg text-orange-800 mb-3">Moeilijke Woorden</h3>
               <div className="space-y-4">
                  {note.difficultWords.map((item, idx) => (
                      <div key={idx} className="border-b border-orange-100 last:border-0 pb-2 last:pb-0">
                          <span className="font-bold text-gray-800 block">{item.word}</span>
                          <span className="text-gray-600 text-sm">{item.definition}</span>
                      </div>
                  ))}
                  {note.difficultWords.length === 0 && (
                      <p className="text-gray-500 italic">Geen moeilijke woorden gevonden.</p>
                  )}
               </div>
          </div>

          {/* Search Grounding / Deep Dive */}
          <div className="mt-4">
            <button 
              onClick={handleDeepDive} 
              className="text-sm text-primary font-medium flex items-center gap-1 mb-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
              </svg>
              Google "Meer info"
            </button>
            
            {loadingContext && <p className="text-xs text-gray-400 animate-pulse">Zoeken op Google...</p>}
            
            {searchContext && (
               <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-100">
                 <h4 className="font-bold text-blue-800 text-xs uppercase mb-1">Google Zoekresultaat</h4>
                 {searchContext}
               </div>
            )}
          </div>

          {/* Next Button (Action) */}
          <button onClick={onNext} className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold text-lg shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2">
              <span>Volgende</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
          </button>
        </div>
      </div>
    </>
  );
};


// Main App
export default function App() {
  const [view, setView] = useState<'home' | 'create' | 'detail'>('home');
  const [notes, setNotes] = useState<NoteData[]>([]);
  const [selectedNote, setSelectedNote] = useState<NoteData | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<EducationLevel | undefined>(undefined);
  const [processingState, setProcessingState] = useState<{ status: string, message: string }>({ status: 'idle', message: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [showLiveTutor, setShowLiveTutor] = useState(false);

  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalConfig, setAuthModalConfig] = useState<{mode: 'login' | 'signup', message?: string}>({ mode: 'login' });

  // Load notes and user on mount
  useEffect(() => {
    StorageService.getNotes().then(setNotes);

    // Supabase Auth Listener
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Filter notes
  const filteredNotes = notes.filter(n => {
    const q = searchQuery.toLowerCase();
    return n.title.toLowerCase().includes(q) || n.summaryPoints.some(p => p.toLowerCase().includes(q));
  });

  const checkUsageLimit = (): boolean => {
    if (user) return true; // Logged in users are unlimited
    const count = StorageService.getUsageCount();
    return count < StorageService.MAX_FREE_USAGE;
  };

  const handleStartCreate = () => {
    if (!checkUsageLimit()) {
      setAuthModalConfig({
        mode: 'signup',
        message: 'Je hebt je gratis 3 samenvattingen gebruikt. Registreer gratis om verder te gaan!'
      });
      setIsAuthModalOpen(true);
      return;
    }

    setSelectedLevel(undefined);
    setProcessingState({ status: 'idle', message: '' });
    setView('create');
  };

  const handleLevelSelect = (level: EducationLevel) => {
    setSelectedLevel(level);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !selectedLevel) return;
    
    // Double check limit before processing (in case they sat on the screen)
    if (!checkUsageLimit()) {
      setAuthModalConfig({
        mode: 'signup',
        message: 'Je limiet is bereikt. Log in om door te gaan.'
      });
      setIsAuthModalOpen(true);
      return;
    }

    const file = e.target.files[0];
    setProcessingState({ status: 'uploading', message: 'Foto uploaden...' });

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      
      try {
        setProcessingState({ status: 'analyzing', message: 'AI analyseert tekst...' });
        const generatedData = await GeminiService.generateNoteFromImage(base64, selectedLevel);
        
        const newNote: NoteData = {
          ...generatedData,
          id: Date.now().toString(),
          timestamp: Date.now()
        };

        await StorageService.saveNote(newNote);
        
        // Increment usage if not logged in
        if (!user) {
          StorageService.incrementUsageCount();
        }

        setNotes(prev => [newNote, ...prev]);
        setSelectedNote(newNote);
        setProcessingState({ status: 'complete', message: 'Klaar!' });
        setView('detail');

      } catch (error) {
        console.error(error);
        setProcessingState({ status: 'error', message: 'Kon samenvatting niet maken. Probeer opnieuw.' });
        setTimeout(() => setProcessingState({ status: 'idle', message: '' }), 3000);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if(confirm("Weet je zeker dat je deze notitie wilt verwijderen?")) {
        await StorageService.deleteNote(id);
        setNotes(prev => prev.filter(n => n.id !== id));
    }
  };

  const handleShare = async () => {
    if (selectedNote && navigator.share) {
      try {
        await navigator.share({
          title: selectedNote.title,
          text: `Check deze samenvatting: ${selectedNote.title}\n\n${selectedNote.summaryPoints.join('\n')}`,
        });
      } catch (err) {
        console.log('Share canceled');
      }
    } else {
        alert("Delen wordt niet ondersteund op dit apparaat.");
    }
  };

  const handleAuthClick = () => {
    if (user) {
      if(confirm('Wil je uitloggen?')) {
        signOut();
      }
    } else {
      setAuthModalConfig({ mode: 'login', message: undefined });
      setIsAuthModalOpen(true);
    }
  };

  // Render Home View
  const renderHome = () => (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-white p-6 shadow-sm z-10">
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
                 <div className="bg-primary p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
                    </svg>
                 </div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">InstaNotes</h1>
            </div>
            
            {/* User Profile / Login */}
            <button 
              onClick={handleAuthClick}
              className={`p-2 rounded-full border transition-all ${user ? 'bg-primary text-white border-primary' : 'bg-gray-100 text-gray-500 border-transparent hover:bg-gray-200'}`}
            >
               {user ? (
                  // Logged in icon
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
               ) : (
                  // Logged out icon
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
               )}
            </button>
        </div>
        
        {/* Search */}
        <div className="relative">
            <input 
                type="text" 
                placeholder="Zoeken in je notities..." 
                className="w-full bg-gray-100 border-none rounded-xl py-3 pl-10 pr-4 text-gray-700 focus:ring-2 focus:ring-primary/20 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mb-4 opacity-50">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <p>Nog geen notities.</p>
            </div>
        ) : (
            filteredNotes.map(note => (
                <div 
                    key={note.id} 
                    onClick={() => { setSelectedNote(note); setView('detail'); }}
                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 active:scale-98 transition-transform cursor-pointer"
                >
                    <div className="w-16 h-16 bg-gray-200 rounded-lg shrink-0 overflow-hidden">
                         {note.originalImageBase64 ? (
                            <img src={note.originalImageBase64} alt="" className="w-full h-full object-cover" />
                         ) : (
                             <div className="w-full h-full flex items-center justify-center bg-indigo-50 text-indigo-300">
                                 AI
                             </div>
                         )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate">{note.title}</h3>
                        <p className="text-xs text-secondary font-medium mb-1">{note.educationLevel}</p>
                        <p className="text-sm text-gray-500 line-clamp-2">{note.summaryPoints.join(' ')}</p>
                    </div>
                    <button 
                        onClick={(e) => handleDelete(e, note.id)} 
                        className="self-start p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </button>
                </div>
            ))
        )}
      </div>

      {/* FAB */}
      <div className="absolute bottom-6 right-6 z-20">
        <button 
            onClick={handleStartCreate}
            className="w-14 h-14 bg-primary text-white rounded-full shadow-lg shadow-primary/40 flex items-center justify-center hover:scale-110 transition-transform"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
        </button>
      </div>
    </div>
  );

  // Render Create Flow
  const renderCreate = () => (
    <div className="h-full bg-gray-50 flex flex-col items-center justify-center relative">
        <button onClick={() => setView('home')} className="absolute top-4 left-4 p-2 bg-white rounded-full shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 text-gray-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
        </button>

        {!selectedLevel ? (
            <LevelSelector onSelect={handleLevelSelect} selectedLevel={selectedLevel} />
        ) : processingState.status === 'idle' ? (
            <div className="flex flex-col items-center gap-6 animate-fade-in w-full max-w-sm px-6">
                 <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Nieuwe notitie</h2>
                    <p className="text-gray-500">Niveau: <span className="text-primary font-semibold">{selectedLevel}</span></p>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4 w-full">
                     {/* Camera Option */}
                     <label className="aspect-square bg-white border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-indigo-50 transition-colors">
                        <input type="file" accept="image/*" capture="environment" onChange={handleFileChange} className="hidden" />
                        <div className="bg-primary/10 p-4 rounded-full mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                            </svg>
                        </div>
                        <span className="font-semibold text-gray-700 text-sm">Maak foto</span>
                     </label>

                     {/* Upload Option */}
                     <label className="aspect-square bg-white border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-secondary hover:bg-emerald-50 transition-colors">
                        <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        <div className="bg-secondary/10 p-4 rounded-full mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-secondary">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                        </div>
                        <span className="font-semibold text-gray-700 text-sm">Upload foto</span>
                     </label>
                 </div>

                 <button onClick={() => setSelectedLevel(undefined)} className="text-gray-400 text-sm underline">
                    Niveau wijzigen
                 </button>
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center gap-4 text-center px-8">
                {processingState.status === 'error' ? (
                     <div className="bg-red-50 text-red-500 p-4 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                        </svg>
                     </div>
                ) : (
                    <div className="relative w-20 h-20">
                        <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
                    </div>
                )}
                <h3 className="text-xl font-bold text-gray-800">{processingState.message}</h3>
                <p className="text-gray-500 text-sm">Een ogenblik geduld...</p>
            </div>
        )}
    </div>
  );

  return (
    <div className="h-full w-full bg-background overflow-hidden relative">
      {view === 'home' && renderHome()}
      {view === 'create' && renderCreate()}
      {view === 'detail' && selectedNote && (
          <NoteDetail 
            note={selectedNote} 
            onBack={() => setView('home')} 
            onNext={handleStartCreate}
            onShare={handleShare}
            onLiveTutor={() => setShowLiveTutor(true)}
          />
      )}

      {showLiveTutor && selectedNote && (
        <LiveTutor 
            noteContext={selectedNote} 
            onClose={() => setShowLiveTutor(false)} 
        />
      )}

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalConfig.mode}
        forcedMessage={authModalConfig.message}
      />
    </div>
  );
}