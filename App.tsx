import { useState, useEffect, useCallback } from 'react';
import { collection, onSnapshot, query, setDoc, doc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, User, signOut } from 'firebase/auth';
import { db, auth, handleFirestoreError, OperationType } from './lib/firebase';
import { ConceptNode, Message, StudyAttempt, UserProfile } from './types';
import { SocraticInterface } from './components/SocraticInterface';
import { ProfileSetup } from './components/ProfileSetup';
import { analyzeStudyProblem } from './services/geminiService';
import { LandingPage } from './components/LandingPage';
import { LevelWindow } from './components/LevelWindow';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const INITIAL_CONCEPTS: ConceptNode[] = [
  {
    id: 'prompt-eng',
    title: 'Prompt Engineering',
    description: 'Mastering the art of zero-shot, few-shot, and CoT prompting.',
    prerequisites: [],
    masteryScore: 0.15,
    status: 'focus',
  },
  {
    id: 'rag-basics',
    title: 'RAG Architecture',
    description: 'Retrieval Augmented Generation and vector databases.',
    prerequisites: ['prompt-eng'],
    masteryScore: 0,
    status: 'locked',
  },
  {
    id: 'agent-logic',
    title: 'Agentic Workflows',
    description: 'Designing autonomous loops and tool-use capabilities.',
    prerequisites: ['prompt-eng'],
    masteryScore: 0,
    status: 'locked',
  },
  {
    id: 'automation-scaling',
    title: 'Scaling Systems',
    description: 'Production-grade deployment and monitoring of AI agents.',
    prerequisites: ['rag-basics', 'agent-logic'],
    masteryScore: 0,
    status: 'locked',
  }
];

export default function App() {
  const [user, setUser] = useState<User | { email: string, uid: string } | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [concepts, setConcepts] = useState<ConceptNode[]>([]);
  const [selectedConceptId, setSelectedConceptId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Level System State
  const [level, setLevel] = useState(3);
  const [xp, setXp] = useState(428);
  const [isLevelWindowOpen, setIsLevelWindowOpen] = useState(false);
  const NEXT_LEVEL_XP = level * 500;

  // Auth Listener
  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u && !isDemoMode) {
        setProfileLoading(true);
        const q = query(collection(db, 'users'));
        const unsubscribe = onSnapshot(doc(db, 'users', u.uid), (docSnap) => {
           if (docSnap.exists()) {
             setProfile(docSnap.data() as UserProfile);
           } else {
             setProfile(null);
           }
           setProfileLoading(false);
        }, (err) => {
           console.error("Profile fetch error:", err);
           setProfileLoading(false);
        });
        return () => unsubscribe();
      } else {
        setProfile(null);
        setProfileLoading(false);
      }
      setAuthLoading(false);
    });
  }, [isDemoMode]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setLoginError(null);
    setIsLoggingIn(true);
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Login failed:", error);
      if (error.code === 'auth/popup-closed-by-user') {
        setLoginError('The login window was closed before completion. Please try again.');
      } else if (error.code === 'auth/cancelled-popup-request') {
        setLoginError('Login request was cancelled. Please try again.');
      } else {
        setLoginError(error.message || 'An unexpected error occurred during login.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleDemoMode = () => {
    setIsDemoMode(true);
    setUser({ email: 'demo-learner@socratic.dev', uid: 'demo' });
  };

  const handleLogout = () => {
    if (isDemoMode) {
      setUser(null);
      setIsDemoMode(false);
    } else {
      signOut(auth);
    }
  };

  // Load concepts from Firestore
  useEffect(() => {
    if (!user) {
      setConcepts([]);
      return;
    }

    const q = query(collection(db, 'concepts'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data() as ConceptNode);
      if (data.length === 0) {
        // Seed initial data if empty
        INITIAL_CONCEPTS.forEach(async (c) => {
          try {
            await setDoc(doc(db, 'concepts', c.id), c);
          } catch (e) {
            handleFirestoreError(e, OperationType.WRITE, 'concepts');
          }
        });
      } else {
        setConcepts(data);
        if (!selectedConceptId && data.length > 0) {
          const focusNode = data.find(c => c.status === 'focus') || data[0];
          setSelectedConceptId(focusNode.id);
        }
      }
    }, (error) => {
      // Only handle if still logged in to avoid flash during logout
      if (auth.currentUser) {
        handleFirestoreError(error, OperationType.GET, 'concepts');
      }
    });

    return () => unsubscribe();
  }, [user, selectedConceptId]);

  const currentConcept = concepts.find(c => c.id === selectedConceptId);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!selectedConceptId || !currentConcept) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const analysis = await analyzeStudyProblem(
        content,
        currentConcept,
        concepts,
        messages
      );

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: analysis.nextQuestion,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Simple Level progression
      setXp(prev => {
        const nextXp = prev + 50;
        if (nextXp >= NEXT_LEVEL_XP) {
          setLevel(l => l + 1);
          return nextXp - NEXT_LEVEL_XP;
        }
        return nextXp;
      });

      if (analysis.updatedStatus) {
        const conceptRef = doc(db, 'concepts', selectedConceptId);
        await updateDoc(conceptRef, {
          status: analysis.updatedStatus,
          lastReviewed: new Date().toISOString()
        });
      }

      // Log attempt
      const attempt: StudyAttempt = {
        id: Date.now().toString(),
        conceptId: selectedConceptId,
        problem: messages.filter(m => m.role === 'assistant').slice(-1)[0]?.content || "Initial query",
        solution: content,
        isSuccess: analysis.confidence > 0.7,
        feedback: analysis.explanation,
        timestamp: new Date().toISOString()
      };
      await setDoc(doc(db, 'attempts', attempt.id), attempt);

    } catch (error) {
      console.error("Analysis error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedConceptId, currentConcept, concepts, messages]);

  // Initial prompt
  useEffect(() => {
    if (user && selectedConceptId && messages.length === 0) {
      setMessages([{
        id: 'initial',
        role: 'assistant',
        content: `I am the Socratic Mentor. I see you're interested in **${currentConcept?.title}**. What's on your mind? Tell me your doubt, or describe what you already understand about this topic.`,
        timestamp: Date.now()
      }]);
    }
  }, [user, selectedConceptId, currentConcept?.title, messages.length]);

  if (authLoading || profileLoading) {
    return (
      <div className="h-screen bg-[#F9FAFB] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#FF6321] animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <LandingPage onLogin={handleLogin} onDemoMode={handleDemoMode} error={loginError} isLoggingIn={isLoggingIn} />;
  }

  if (!profile && !isDemoMode) {
    return <ProfileSetup user={user as any} onComplete={() => {}} />;
  }

  return (
    <div className="flex flex-col h-screen bg-[#F9FAFB] text-gray-900 overflow-hidden font-sans">
      <LevelWindow 
        isOpen={isLevelWindowOpen} 
        onClose={() => setIsLevelWindowOpen(false)} 
        level={level}
        xp={xp}
        nextLevelXp={NEXT_LEVEL_XP}
      />
      
      {/* Primary Chat Environment */}
      <main className="flex-1 flex justify-center bg-[#F9FAFB] relative overflow-hidden">
        <div className="w-full max-w-2xl h-full flex flex-col relative z-10">
          <div className="flex-1 min-h-0 md:py-6">
            <SocraticInterface 
              concept={currentConcept || INITIAL_CONCEPTS[0]}
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
              user={user as any}
              onLogout={handleLogout}
              onOpenLevels={() => setIsLevelWindowOpen(true)}
              level={level}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
