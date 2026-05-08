export type MasteryStatus = 'mastered' | 'blocked' | 'focus' | 'locked';

export interface ConceptNode {
  id: string;
  title: string;
  description: string;
  prerequisites: string[]; // IDs of prerequisite concepts
  masteryScore: number; // 0 to 1
  status: MasteryStatus;
  lastReviewed?: string;
}

export interface StudyAttempt {
  id: string;
  conceptId: string;
  problem: string;
  solution: string;
  isSuccess: boolean;
  feedback: string;
  timestamp: string;
}

export interface SocraticResponse {
  currentConceptId: string;
  rootCauseConceptId?: string;
  confidence: number;
  nextQuestion: string;
  explanation: string;
  updatedStatus?: MasteryStatus;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface UserProfile {
  uid: string;
  username: string;
  bio?: string;
  avatar?: string;
  expertise?: string;
  level: number;
  createdAt: any;
}
