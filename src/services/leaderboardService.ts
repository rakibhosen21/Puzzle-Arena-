import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  getDocs, 
  addDoc,
  onSnapshot 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

export interface ScoreEntry {
  walletAddress: string;
  score: number;
  difficulty: string;
  timestamp: string;
}

export async function submitScore(wallet: string, score: number, difficulty: string) {
  const path = 'leaderboard';
  try {
    await addDoc(collection(db, path), {
      walletAddress: wallet,
      score,
      difficulty,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export function subscribeToTopScores(callback: (scores: ScoreEntry[]) => void, limitCount: number = 10) {
  const path = 'leaderboard';
  const colRef = collection(db, path);
  const q = query(
    colRef, 
    orderBy('score', 'desc'), 
    limit(limitCount)
  );

  return onSnapshot(q, (snapshot) => {
    const scores = snapshot.docs.map(doc => doc.data() as ScoreEntry);
    callback(scores);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
}

export async function getTopScores(limitCount: number = 10) {
  const path = 'leaderboard';
  try {
    const colRef = collection(db, path);
    const q = query(
      colRef, 
      orderBy('score', 'desc'), 
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data() as ScoreEntry);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}
