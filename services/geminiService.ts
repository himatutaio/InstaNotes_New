import { GoogleGenAI, Type, Schema } from "@google/genai";
import { EducationLevel, NoteData } from "../types";

// Safety check: Use a placeholder if env is missing during build
const apiKey = process.env.API_KEY || "BUILD_PLACEHOLDER";
const ai = new GoogleGenAI({ apiKey });

const RESPONSE_SCHEMA: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Een korte, pakkende titel voor de samenvatting." },
    summaryPoints: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Een lijst van duidelijke bulletpoints die de kern van de tekst samenvatten."
    },
    difficultWords: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          word: { type: Type.STRING },
          definition: { type: Type.STRING, description: "Een eenvoudige uitleg van het woord." }
        },
        required: ["word", "definition"]
      },
      description: "Een lijst van moeilijke woorden uit de tekst met hun betekenis."
    }
  },
  required: ["title", "summaryPoints", "difficultWords"]
};

export const generateNoteFromImage = async (
  imageBase64: string,
  level: EducationLevel
): Promise<Omit<NoteData, 'id' | 'timestamp'>> => {
  
  // MOCK MODE: If no valid API key is present (e.g. static build), return mock data.
  if (apiKey === "BUILD_PLACEHOLDER" || !apiKey) {
    console.warn("Using MOCK data (No API Key found)");
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          title: "Demo Samenvatting (Geen API Key)",
          summaryPoints: [
            "Dit is een voorbeeld omdat er geen API key is geconfigureerd.",
            "In de productie-build zijn de AI-functies uitgeschakeld voor veiligheid.",
            "De foto is succesvol verwerkt door de mock-service."
          ],
          difficultWords: [
            { word: "Mocking", definition: "Het nabootsen van gedrag voor testdoeleinden." },
            { word: "Deploy", definition: "Het online zetten van de applicatie." }
          ],
          educationLevel: level,
          originalImageBase64: imageBase64
        });
      }, 1500);
    });
  }

  // Clean base64 string if it contains metadata
  const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

  const prompt = `
    Je bent een deskundige onderwijsassistent voor InstaNotes.
    Analyseer de bijgevoegde afbeelding van een studietekst.
    
    Jouw taak:
    1. Lees de tekst (OCR).
    2. Maak een samenvatting van hoge kwaliteit, aangepast aan het niveau: ${level}.
    
    BELANGRIJK - Definitie van de samenvatting:
    Een samenvatting is een verkorte versie van de tekst waarin alleen de belangrijkste informatie wordt weergegeven. 
    Je laat details, voorbeelden en uitgebreide uitleg weg, maar behoudt de kernpunten, zodat de lezer snel begrijpt waar de oorspronkelijke tekst over gaat.
    
    Niveau instructies:
       - Voor lagere niveaus (VMBO/MBO 1-2): Gebruik zeer eenvoudige taal, korte zinnen, en focus op de absolute kern.
       - Voor middelbare niveaus (MBO 3-4, HAVO): Gebruik heldere taal, gestructureerd, volledige context.
       - Voor hogere niveaus (HBO/WO): Gebruik academische precisie, nuance en diepgang, maar blijf helder.
    
    3. Identificeer moeilijke woorden of jargon die relevant zijn voor dit niveau en leg ze uit.
    
    Formatteer het antwoord strikt als JSON volgens het schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } },
          { text: prompt }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        systemInstruction: "Je bent een behulpzame, Nederlandse onderwijs assistent die beknopte en krachtige samenvattingen schrijft.",
        temperature: 0.3,
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return {
        title: data.title,
        summaryPoints: data.summaryPoints,
        difficultWords: data.difficultWords,
        educationLevel: level,
        originalImageBase64: imageBase64
      };
    } else {
      throw new Error("Geen tekst gegenereerd door AI.");
    }
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};

export const getMoreContext = async (query: string): Promise<string> => {
  if (apiKey === "BUILD_PLACEHOLDER" || !apiKey) return "Zoekfunctie uitgeschakeld in demo.";
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find short, interesting facts or extra context about: "${query}". Keep it relevant for students.`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    return response.text || "Geen extra informatie gevonden.";
  } catch (e) {
    console.error("Search error", e);
    return "Kon niet zoeken.";
  }
}