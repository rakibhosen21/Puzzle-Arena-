import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { doc, getDoc, setDoc, updateDoc, increment, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

export interface UserStats {
  walletAddress: string;
  xp: number;
  points: number;
  streak: number;
  level: number;
  puzzlesSolved: number;
  lastLogin: string;
}

export function useUser() {
  const { address, isConnected } = useAccount();
  const [user, setUser] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: () => void = () => {};

    if (isConnected && address) {
      setLoading(true);
      const userRef = doc(db, 'users', address);

      // Set up real-time listener
      unsubscribe = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          setUser(docSnap.data() as UserStats);
          setLoading(false);
        } else {
          // Initialize user if not exists
          initializeUser(address);
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, `users/${address}`);
        setLoading(false);
      });
    } else {
      setUser(null);
      setLoading(false);
    }

    return () => unsubscribe();
  }, [isConnected, address]);

  async function initializeUser(wallet: string) {
    try {
      const userRef = doc(db, 'users', wallet);
      const newUser: UserStats = {
        walletAddress: wallet,
        xp: 0,
        points: 0,
        streak: 1,
        level: 1,
        puzzlesSolved: 0,
        lastLogin: new Date().toISOString(),
      };
      await setDoc(userRef, newUser);
      // onSnapshot will pick up the creation
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `users/${wallet}`);
    }
  }

  async function updateStats(addedXp: number, addedPoints: number) {
    if (!address) return;
    try {
      const userRef = doc(db, 'users', address);
      
      // Calculate level up logic (simple level = floor(sqrt(xp/100)) + 1)
      const currentXp = user?.xp || 0;
      const newXp = currentXp + addedXp;
      const newLevel = Math.floor(Math.sqrt(newXp / 100)) + 1;

      await updateDoc(userRef, {
        xp: increment(addedXp),
        points: increment(addedPoints),
        puzzlesSolved: increment(1),
        level: newLevel,
        lastLogin: new Date().toISOString(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${address}`);
    }
  }

  return { user, loading, updateStats };
}
