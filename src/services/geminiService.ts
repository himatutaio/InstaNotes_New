import { supabase } from './supabaseService';
import { EducationLevel, NoteData } from "../types";

// Production URL for the Supabase Edge Function
const GENAI_URL = import.meta.env.VITE_GENAI_URL || "https://zvmtctpajbbxdhesolkn.supabase.co/functions/v1/genai";

export const generateNoteFromImage = async (
  imageBase64: string,
  level: EducationLevel
): Promise<Omit<NoteData, 'id' | 'timestamp'>> => {
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw { error: true, message: "Je moet ingelogd zijn om deze functie te gebruiken." };
  }

  // Clean base64 string if it contains metadata
  const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

  try {
    const response = await fetch(GENAI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify({
        image: cleanBase64,
        educationLevel: level
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("AI Service Error:", errorData);
      throw new Error(errorData.error || "Server niet bereikbaar");
    }

    const data = await response.json();
    
    // The Edge Function is expected to return the structured note data directly
    return {
      title: data.title,
      summaryPoints: data.summaryPoints,
      difficultWords: data.difficultWords,
      educationLevel: level,
      originalImageBase64: imageBase64
    };

  } catch (error: any) {
    console.error("Gemini Service Error:", error);
    throw { error: true, message: "Kon samenvatting niet genereren. Probeer het later opnieuw." };
  }
};

export const getMoreContext = async (query: string): Promise<string> => {
  // Simple fallback since search requires complex tool integration on the backend
  return "Zoekfunctie is momenteel beperkt in deze versie.";
}