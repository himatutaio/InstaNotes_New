
import React, { useState, useEffect, useRef } from 'react';
import { EducationLevel, NoteData, ProcessingState, DifficultWord } from './types';
import { saveNote, getNotes, deleteNote, updateNote } from './services/storageService';
import { generateNoteFromImage } from './services/geminiService';
import { LiveTutor } from './components/LiveTutor';
import { Flashcard } from './components/Flashcard';

export default function App() {
  const [notes, setNotes] = useState<NoteData[]>([]);
  const [view, setView] = useState<'home' | 'create' | 'detail'>('home');
  const [selectedNote, setSelectedNote] = useState<NoteData | null>(null);
  const [processing, setProcessing] = useState<ProcessingState>({ status: 'idle' });
  const [uploadImage, setUploadImage] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<EducationLevel>(EducationLevel.VMBO_GT_TL);
  const [showTutor, setShowTutor] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Flashcard state
  const [showOnlyPractice, setShowOnlyPractice] = useState(false);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [newCardWord, setNewCardWord] = useState("");
  const [newCardDef, setNewCardDef] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileUploadRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    const loaded = await getNotes();
    setNotes(loaded);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadImage(reader.result as string);
        setView('create');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!uploadImage) return;

    setProcessing({ status: 'analyzing', message: 'Beeld analyseren en samenvatten...' });
    
    try {
      const result = await generateNoteFromImage(uploadImage, selectedLevel);
      
      const newNote: NoteData = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        ...result
      };

      await saveNote(newNote);
      setNotes([newNote, ...notes]);
      setSelectedNote(newNote);
      setView('detail');
      setProcessing({ status: 'idle' });
      setUploadImage(null);
    } catch (error) {
      console.error(error);
      setProcessing({ status: 'error', message: 'Er ging iets mis bij het genereren.' });
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Weet je zeker dat je deze notitie wilt verwijderen?')) {
      const updated = await deleteNote(id);
      setNotes(updated);
      if (selectedNote?.id === id) {
        setView('home');
        setSelectedNote(null);
      }
    }
  };

  const handleShare = async (e: React.MouseEvent, note: NoteData) => {
    e.stopPropagation();
    
    const shareText = `📚 Samenvatting: ${note.title}\n🎓 Niveau: ${note.educationLevel}\n\nKernpunten:\n${note.summaryPoints.map(p => `• ${p}`).join('\n')}\n\nGemaakt met InstaNotes.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: note.title,
          text: shareText,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(shareText);
      alert('Samenvatting gekopieerd naar klembord!');
    }
  };

  const togglePracticeWord = async (wordIndex: number) => {
    if (!selectedNote) return;

    // Create a deep copy of the selected note
    const updatedNote = { ...selectedNote, difficultWords: [...selectedNote.difficultWords] };
    const word = { ...updatedNote.difficultWords[wordIndex] };
    
    // Toggle the needsPractice boolean
    word.needsPractice = !word.needsPractice;
    updatedNote.difficultWords[wordIndex] = word;

    // Update state immediately for UI responsiveness
    setSelectedNote(updatedNote);
    
    // Update main notes list
    const updatedNotesList = notes.map(n => n.id === updatedNote.id ? updatedNote : n);
    setNotes(updatedNotesList);

    // Persist to storage
    await updateNote(updatedNote);
  };

  const handleAddFlashcard = async () => {
    if (!selectedNote || !newCardWord.trim() || !newCardDef.trim()) return;

    const newWord: DifficultWord = {
      word: newCardWord.trim(),
      definition: newCardDef.trim(),
      needsPractice: false
    };

    const updatedNote = { 
      ...selectedNote, 
      difficultWords: [...selectedNote.difficultWords, newWord] 
    };

    setSelectedNote(updatedNote);
    const updatedNotesList = notes.map(n => n.id === updatedNote.id ? updatedNote : n);
    setNotes(updatedNotesList);
    await updateNote(updatedNote);

    // Reset and close
    setNewCardWord("");
    setNewCardDef("");
    setShowAddCardModal(false);
  };

  // Filter logic
  const filteredNotes = notes.filter(note => {
    const query = searchQuery.toLowerCase();
    return (
      note.title.toLowerCase().includes(query) ||
      note.educationLevel.toLowerCase().includes(query) ||
      note.summaryPoints.some(point => point.toLowerCase().includes(query)) ||
      note.difficultWords.some(dw => dw.word.toLowerCase().includes(query))
    );
  });

  // Filter flashcards based on "Practice Only" toggle
  const filteredFlashcards = selectedNote?.difficultWords.filter(word => {
    if (showOnlyPractice) return word.needsPractice;
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-gray-50 max-w-md mx-auto shadow-2xl overflow-hidden relative">
      {/* Header */}
      <header className="bg-primary text-white p-4 shadow-md z-10">
        <div className="flex justify-between items-center">
          {view !== 'home' && (
             <button onClick={() => setView('home')} className="text-white/80 hover:text-white mr-2">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
               </svg>
             </button>
          )}
          <h1 className="text-xl font-bold tracking-wide flex-1 text-center mr-8">InstaNotes</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto no-scrollbar relative">
        
        {/* VIEW: HOME */}
        {view === 'home' && (
          <div className="p-4 space-y-6">
             {/* Hero / CTA */}
             <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                  </svg>
                </div>
                <h2 className="text-lg font-bold text-gray-800 mb-1">Nieuwe Notitie</h2>
                <p className="text-sm text-gray-500 mb-4">Maak een foto van je boek of upload een bestand</p>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 bg-primary text-white py-3 px-2 rounded-xl font-semibold shadow-lg shadow-primary/30 active:scale-95 transition-transform text-sm"
                  >
                    Start Camera
                  </button>
                  <button 
                    onClick={() => fileUploadRef.current?.click()}
                    className="flex-1 bg-white border-2 border-primary/10 text-primary py-3 px-2 rounded-xl font-semibold shadow-sm hover:bg-gray-50 active:scale-95 transition-transform text-sm"
                  >
                    Upload Foto
                  </button>
                </div>
                
                <input 
                  type="file" 
                  ref={fileInputRef}
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <input 
                  type="file" 
                  ref={fileUploadRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
             </div>

             {/* Search Bar */}
             <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Zoek notities..."
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary/50 focus:border-primary sm:text-sm shadow-sm transition-shadow"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
             </div>

             {/* Recent List */}
             <div>
               <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3 ml-1">Mijn Samenvattingen</h3>
               {filteredNotes.length === 0 ? (
                 <div className="text-center py-10 text-gray-400">
                   {notes.length > 0 ? <p>Geen resultaten gevonden voor "{searchQuery}"</p> : <p>Nog geen notities.</p>}
                 </div>
               ) : (
                 <div className="space-y-3">
                   {filteredNotes.map(note => (
                     <div 
                        key={note.id}
                        onClick={() => { setSelectedNote(note); setView('detail'); }}
                        className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 active:bg-gray-50 transition-colors cursor-pointer group"
                     >
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                          {note.originalImageBase64 ? (
                            <img src={note.originalImageBase64} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">📝</div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-800 truncate">{note.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                             <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600">{note.educationLevel}</span>
                             <span>• {new Date(note.timestamp).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-1">
                          <button 
                            onClick={(e) => handleShare(e, note)}
                            className="p-2 text-gray-300 hover:text-primary transition-colors"
                            title="Delen"
                          >
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                              </svg>
                          </button>
                          <button 
                            onClick={(e) => handleDelete(e, note.id)}
                            className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                            title="Verwijderen"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                          </button>
                        </div>
                     </div>
                   ))}
                 </div>
               )}
             </div>
          </div>
        )}

        {/* VIEW: CREATE */}
        {view === 'create' && uploadImage && (
          <div className="p-4 flex flex-col h-full">
            <div className="flex-1 bg-black rounded-xl overflow-hidden mb-4 relative shadow-inner">
               <img src={uploadImage} alt="Preview" className="w-full h-full object-contain" />
               <button 
                  onClick={() => setView('home')}
                  className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full backdrop-blur-sm"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
               </button>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Kies je onderwijsniveau</label>
              <select 
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value as EducationLevel)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {Object.values(EducationLevel).map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </div>

            <button
               onClick={handleAnalyze}
               disabled={processing.status !== 'idle' && processing.status !== 'error'}
               className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-primary/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {processing.status === 'analyzing' ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyseren...
                </>
              ) : (
                <>
                  ✨ Genereer Samenvatting
                </>
              )}
            </button>
          </div>
        )}

        {/* VIEW: DETAIL */}
        {view === 'detail' && selectedNote && (
          <div className="p-4 pb-24 space-y-6">
            <div className="space-y-2">
               <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wide">
                 {selectedNote.educationLevel}
               </span>
               <h2 className="text-2xl font-bold text-gray-900 leading-tight">{selectedNote.title}</h2>
               <p className="text-gray-400 text-xs">Gegenereerd op {new Date(selectedNote.timestamp).toLocaleDateString()}</p>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
               <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">
                 <span className="text-xl">📋</span> Kernpunten
               </h3>
               <ul className="space-y-3">
                 {selectedNote.summaryPoints.map((point, i) => (
                   <li key={i} className="flex gap-3 text-gray-700 leading-relaxed">
                     <span className="text-primary font-bold">•</span>
                     <span>{point}</span>
                   </li>
                 ))}
               </ul>
            </div>

            {selectedNote.difficultWords.length > 0 && (
              <>
                {/* List View */}
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="flex items-center gap-2 font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">
                    <span className="text-xl">🧠</span> Moeilijke Woorden
                  </h3>
                  <div className="grid gap-3">
                    {selectedNote.difficultWords.map((item, i) => (
                      <div key={i} className="bg-gray-50 p-3 rounded-lg">
                        <div className="font-bold text-gray-900 mb-1">{item.word}</div>
                        <div className="text-sm text-gray-600 italic">{item.definition}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Flashcards View */}
                <div>
                   <div className="flex justify-between items-center mb-4">
                     <div className="flex items-center gap-2">
                        <h3 className="flex items-center gap-2 font-bold text-gray-800">
                          <span className="text-xl">🧩</span> Flitskaarten
                        </h3>
                        <button 
                          onClick={() => setShowAddCardModal(true)}
                          className="bg-primary/10 text-primary p-1.5 rounded-full hover:bg-primary/20 transition-colors"
                          title="Voeg kaart toe"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                        </button>
                     </div>
                     
                     <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                       <div className="relative inline-flex items-center cursor-pointer">
                         <input 
                           type="checkbox" 
                           className="sr-only peer" 
                           checked={showOnlyPractice}
                           onChange={() => setShowOnlyPractice(!showOnlyPractice)}
                         />
                         <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                       </div>
                       Alleen oefenen
                     </label>
                   </div>

                   {filteredFlashcards && filteredFlashcards.length > 0 ? (
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                       {filteredFlashcards.map((item, i) => {
                         // Find the actual index in the original array to pass correct index to togglePracticeWord
                         // This is needed because map index 'i' here is from the filtered array
                         const originalIndex = selectedNote.difficultWords.findIndex(w => w.word === item.word);
                         
                         return (
                           <Flashcard 
                             key={i} 
                             word={item.word} 
                             definition={item.definition} 
                             needsPractice={item.needsPractice}
                             onTogglePractice={() => togglePracticeWord(originalIndex)}
                           />
                         );
                       })}
                     </div>
                   ) : (
                     <div className="text-center py-8 bg-white rounded-xl border border-dashed border-gray-300">
                       <div className="text-4xl mb-2">🎉</div>
                       <p className="text-gray-500">
                         {showOnlyPractice 
                           ? "Geen woorden gemarkeerd om te oefenen!" 
                           : "Geen flitskaarten beschikbaar."}
                       </p>
                     </div>
                   )}
                </div>
              </>
            )}
            
            {/* FAB for Live Tutor */}
            <div className="fixed bottom-6 right-6 z-20">
               <button 
                 onClick={() => setShowTutor(true)}
                 className="bg-secondary text-white p-4 rounded-full shadow-lg shadow-secondary/40 hover:scale-110 transition-transform flex items-center gap-2 font-bold pr-6"
               >
                 <span className="text-2xl">🎓</span>
                 <span>Vraag Docent</span>
               </button>
            </div>
          </div>
        )}
      </main>
      
      {/* Live Tutor Overlay */}
      {showTutor && selectedNote && (
        <LiveTutor 
          noteContext={selectedNote} 
          onClose={() => setShowTutor(false)} 
        />
      )}

      {/* Add Flashcard Modal */}
      {showAddCardModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl transform transition-all scale-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Nieuwe Flitskaart</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Woord / Begrip</label>
                <input 
                  type="text" 
                  value={newCardWord}
                  onChange={(e) => setNewCardWord(e.target.value)}
                  placeholder="bv. Fotosynthese"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Betekenis</label>
                <textarea 
                  value={newCardDef}
                  onChange={(e) => setNewCardDef(e.target.value)}
                  placeholder="De betekenis..."
                  rows={3}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary focus:outline-none resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowAddCardModal(false)}
                  className="flex-1 py-3 text-gray-600 font-semibold hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Annuleren
                </button>
                <button 
                  onClick={handleAddFlashcard}
                  disabled={!newCardWord.trim() || !newCardDef.trim()}
                  className="flex-1 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Toevoegen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
