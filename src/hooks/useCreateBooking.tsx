import { useState } from 'react';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc,
  Timestamp 
} from 'firebase/firestore';

import { Room } from '@/types';
import { db } from '@/../firebase.config';
import { useAuth } from './useAuth';

interface CreateBookingData {
  meetingName: string;
  startTime: Date;
  endTime: Date;
  room: Room;
}

export const useCreateBooking = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkConflictingBookings = async (startTime: Date, endTime: Date, roomId: string) => {
    const bookingsRef = collection(db, 'bookings');
    
    // Query 1: Booking that overlaps at the beginning
    const q1 = query(
      bookingsRef,
      where('roomId', '==', roomId),
      where('startTime', '>=', startTime),
      where('startTime', '<=', endTime)
    );

    // Query 2: Booking that overlaps at the end
    const q2 = query(
      bookingsRef,
      where('roomId', '==', roomId),
      where('endTime', '>=', startTime),
      where('endTime', '<=', endTime)
    );

    // Query 3: Booking that covers the entire time range
    const q3 = query(
      bookingsRef,
      where('roomId', '==', roomId),
      where('startTime', '<=', startTime),
      where('endTime', '>=', endTime)
    );

    const [snap1, snap2, snap3] = await Promise.all([
      getDocs(q1),
      getDocs(q2),
      getDocs(q3)
    ]);

    return !snap1.empty || !snap2.empty || !snap3.empty;
  };

  const createBooking = async ({ meetingName, startTime, endTime, room }: CreateBookingData) => {
    try {

      if (!room?.id) {
        setError('Room data is required');
        return { success: false, error: 'Room data is required' };
      }
      
      setLoading(true);
      setError(null);

      // Check for conflicting bookings
      const hasConflict = await checkConflictingBookings(startTime, endTime, room.id);
      
      if (hasConflict) {
        setError('This room is already booked for the selected time slot');
        return { success: false };
      }

      // Create new booking
      const bookingData = {
        meetingName,
        startTime: Timestamp.fromDate(startTime),
        endTime: Timestamp.fromDate(endTime),
        roomId: room.id,
        userId: user?.uid
      };

      await addDoc(collection(db, 'bookings'), bookingData);

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to book room';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { createBooking, loading, error };
};