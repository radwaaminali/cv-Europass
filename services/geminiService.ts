
import { GoogleGenAI, Type } from "@google/genai";
import { CVData } from "../types";

const cvSchema = {
  type: Type.OBJECT,
  properties: {
    personalInfo: {
      type: Type.OBJECT,
      properties: {
        firstName: { type: Type.STRING },
        lastName: { type: Type.STRING },
        email: { type: Type.STRING },
        phone: { type: Type.STRING },
        address: { type: Type.STRING },
        city: { type: Type.STRING },
        country: { type: Type.STRING },
        postalCode: { type: Type.STRING },
        website: { type: Type.STRING },
        linkedin: { type: Type.STRING },
        gender: { type: Type.STRING },
        dateOfBirth: { type: Type.STRING },
        nationality: { type: Type.STRING }
      },
      required: ["firstName", "lastName", "email"]
    },
    professionalSummary: { type: Type.STRING },
    workExperiences: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          jobTitle: { type: Type.STRING },
          employer: { type: Type.STRING },
          city: { type: Type.STRING },
          country: { type: Type.STRING },
          startDate: { type: Type.STRING },
          endDate: { type: Type.STRING },
          current: { type: Type.BOOLEAN },
          description: { type: Type.STRING }
        }
      }
    },
    educations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          degree: { type: Type.STRING },
          institution: { type: Type.STRING },
          city: { type: Type.STRING },
          country: { type: Type.STRING },
          startDate: { type: Type.STRING },
          endDate: { type: Type.STRING },
          current: { type: Type.BOOLEAN },
          description: { type: Type.STRING }
        }
      }
    },
    skills: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          level: { type: Type.STRING }
        }
      }
    },
    languages: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          motherTongue: { type: Type.BOOLEAN },
          listening: { type: Type.STRING },
          reading: { type: Type.STRING },
          writing: { type: Type.STRING },
          spokenProduction: { type: Type.STRING },
          spokenInteraction: { type: Type.STRING }
        }
      }
    },
    certifications: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          title: { type: Type.STRING },
          organization: { type: Type.STRING },
          date: { type: Type.STRING },
          link: { type: Type.STRING }
        }
      }
    },
    achievements: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    }
  }
};

export const extractCVData = async (content: string, mimeType?: string): Promise<CVData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  let promptParts: any[] = [];
  
  if (mimeType) {
    promptParts = [
      {
        inlineData: {
          mimeType: mimeType,
          data: content // base64 string
        }
      },
      { text: "Extract all professional and personal details from this document into the structured Europass CV format. Ensure job descriptions are extracted as clear bullet points if they exist in the text. Categorize certifications and achievements separately." }
    ];
  } else {
    promptParts = [{ text: `Extract the following resume text into a structured JSON Europass format:\n\n${content}` }];
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: mimeType ? { parts: promptParts } : promptParts[0].text,
    config: {
      responseMimeType: "application/json",
      responseSchema: cvSchema,
      temperature: 0.1
    }
  });

  return JSON.parse(response.text || '{}') as CVData;
};
