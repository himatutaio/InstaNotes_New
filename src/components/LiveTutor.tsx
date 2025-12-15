import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { NoteData } from '../types';

interface LiveTutorProps {
  noteContext?: NoteData;
  onClose: () => void;
}

export const LiveTutor: React.FC<LiveTutorProps> = ({ noteContext, onClose }) => {
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState("Klaar om te verbinden...");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showVideo, setShowVideo] = useState(false);

  // Audio Context refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  
  // Gemini Session
  const sessionPromiseRef = useRef<Promise<any> | null>(null);

  useEffect(() => {
    return () => {
      stopSession();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startSession = async () => {
    try {
      setStatus("Verbinden met AI...");
      setIsActive(true);

      const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY as string });
      
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextRef.current = audioCtx;
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

      // Build system instruction with context if available
      let systemInstruction = "Je bent een vriendelijke, geduldige privéleraar. Je helpt studenten met hun vragen.";
      if (noteContext) {
        systemInstruction += ` De student heeft net een tekst gelezen met de titel "${noteContext.title}". 
        Samenvatting punten: ${noteContext.summaryPoints.join(". ")}.
        Niveau: ${noteContext.educationLevel}.
        Gebruik deze context om vragen te beantwoorden.`;
      }

      sessionPromiseRef.current = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: systemInstruction,
        },
        callbacks: {
          onopen: () => {
            setStatus("Verbonden! Stel je vraag.");
            
            // Setup Input Stream
            const source = audioCtx.createMediaStreamSource(stream);
            inputSourceRef.current = source;
            
            const processor = audioCtx.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;
            
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromiseRef.current?.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(processor);
            processor.connect(audioCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
             const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
             if (base64Audio) {
               try {
                 const outputData = decode(base64Audio);
                 const buffer = await decodeAudioData(outputData, outputCtx);
                 
                 const source = outputCtx.createBufferSource();
                 source.buffer = buffer;
                 source.connect(outputCtx.destination);
                 
                 const currentTime = outputCtx.currentTime;
                 const startTime = Math.max(currentTime, nextStartTimeRef.current);
                 source.start(startTime);
                 nextStartTimeRef.current = startTime + buffer.duration;
                 
               } catch (e) {
                 console.error("Audio decode error", e);
               }
             }
          },
          onclose: () => {
            setStatus("Verbinding gesloten.");
            setIsActive(false);
          },
          onerror: (e) => {
            console.error(e);
            setStatus("Er is een fout opgetreden.");
            setIsActive(false);
          }
        }
      });

    } catch (e) {
      console.error(e);
      setStatus("Kon geen toegang krijgen tot microfoon.");
      setIsActive(false);
    }
  };

  const stopSession = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (processorRef.current && inputSourceRef.current) {
      inputSourceRef.current.disconnect();
      processorRef.current.disconnect();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setIsActive(false);
    setStatus("Gesprek beëindigd.");
    // Note: session.close() isn't strictly exposed in the simplified interface, relies on cleanup
  };

  // Helper functions
  function createBlob(data: Float32Array) {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    // Simple base64 encoding for the raw PCM
    let binary = '';
    const bytes = new Uint8Array(int16.buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);
    
    return {
      data: base64,
      mimeType: 'audio/pcm;rate=16000',
    };
  }

  function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  async function decodeAudioData(data: Uint8Array, ctx: AudioContext) {
    const int16 = new Int16Array(data.buffer);
    const float32 = new Float32Array(int16.length);
    for(let i=0; i<int16.length; i++) {
        float32[i] = int16[i] / 32768.0;
    }
    const buffer = ctx.createBuffer(1, float32.length, 24000);
    buffer.getChannelData(0).set(float32);
    return buffer;
  }

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center text-white p-6 animate-fade-in">
      <button onClick={onClose} className="absolute top-6 right-6 text-white/70 hover:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="w-full max-w-md flex flex-col items-center gap-8">
        <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500 ${isActive ? 'bg-primary/20 shadow-[0_0_50px_rgba(79,70,229,0.5)] scale-110' : 'bg-gray-800'}`}>
          <div className={`w-24 h-24 rounded-full bg-primary flex items-center justify-center transition-transform ${isActive ? 'animate-pulse' : ''}`}>
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-white">
              <path d="M8.25 4.5a3.75 3.75 0 117.5 0v8.25a3.75 3.75 0 11-7.5 0V4.5z" />
              <path d="M6 10.5a.75.75 0 01.75.75v1.5a5.25 5.25 0 1010.5 0v-1.5a.75.75 0 011.5 0v1.5a6.751 6.751 0 01-6 6.709v2.291h3a.75.75 0 010 1.5h-7.5a.75.75 0 010-1.5h3v-2.291a6.751 6.751 0 01-6-6.709v-1.5A.75.75 0 016 10.5z" />
            </svg>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">AI Privéleraar</h2>
          <p className="text-white/60 mb-6">{status}</p>
          
          {!isActive ? (
            <button 
              onClick={startSession}
              className="px-8 py-3 bg-white text-primary rounded-full font-bold text-lg hover:scale-105 transition-transform"
            >
              Start Gesprek
            </button>
          ) : (
            <button 
              onClick={stopSession}
              className="px-8 py-3 bg-red-500/20 text-red-400 border border-red-500/50 rounded-full font-bold text-lg hover:bg-red-500/30 transition-colors"
            >
              Beëindigen
            </button>
          )}
        </div>
        
        {noteContext && (
           <div className="bg-white/10 p-4 rounded-xl text-sm text-white/80 w-full">
             <strong>Context:</strong> {noteContext.title}
           </div>
        )}
      </div>
    </div>
  );
};
