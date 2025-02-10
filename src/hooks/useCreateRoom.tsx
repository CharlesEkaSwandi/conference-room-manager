import { useState } from 'react';
import { 
  collection, 
  addDoc, 
  doc, 
  updateDoc 
} from 'firebase/firestore';
import { db } from '@/../firebase.config';
import { Room } from '@/types';

export type FormValues = Omit<Room, 'status' | 'id'>;

export const useCreateRoom = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createRoom = async (roomData: FormValues) => {
    try {
      setLoading(true);
      setError(null);

      await addDoc(collection(db, 'rooms'), roomData);

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create room';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updateRoom = async (id: string, roomData: FormValues) => {
    try {
      setLoading(true);
      setError(null);

      const roomRef = doc(db, 'rooms', id);
      await updateDoc(roomRef, roomData);

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update room';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { createRoom, updateRoom, loading, error };
};
