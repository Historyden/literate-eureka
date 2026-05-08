import { GoogleGenAI, Type } from "@google/genai";
import { ConceptNode, SocraticResponse, Message } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeStudyProblem(
  userQuery: string,
  concept: ConceptNode,
  allConcepts: ConceptNode[],
  chatHistory: Message[]
): Promise<SocraticResponse> {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    You are the Socratic Neural Mentor for Socratic-DAG.
    A student has provided a doubt or an answer. Your goal is to guide them towards deep understanding without giving direct answers.
    
    KNOWLEDGE CONTEXT:
    - Focus Area: "${concept.title}"
    - Description: "${concept.description}"
    - Available Graph Nodes: ${allConcepts.map(c => c.title).join(', ')}
    
    STRATEGY:
    1. Analyze the student's message (doubt or explanation).
    2. Identify the fundamental principle they are missing or struggling with.
    3. Generate a Socratic question that prompts them to think about that principle.
    4. If the doubt is about a prerequisite, suggest we focus on that concept first.
    5. Maintain a technical, encouraging, and slightly futuristic tone.
    6. Output valid JSON.
  `;

  const historyText = chatHistory.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');

  const response = await ai.models.generateContent({
    model,
    contents: `HISTORY:\n${historyText}\n\nSTUDENT_QUERY: ${userQuery}`,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          currentConceptId: { type: Type.STRING },
          rootCauseConceptId: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          nextQuestion: { type: Type.STRING },
          explanation: { type: Type.STRING },
          updatedStatus: { type: Type.STRING, enum: ["mastered", "blocked", "focus", "locked"] }
        },
        required: ["currentConceptId", "confidence", "nextQuestion", "explanation"]
      }
    }
  });

  return JSON.parse(response.text) as SocraticResponse;
}

export async function getInitialConceptAnalysis(problem: string): Promise<{ conceptId: string }> {
  // This helps map a raw problem to a node in the graph if not specified
  return { conceptId: 'intro-to-logic' }; // Simplified for now
}
