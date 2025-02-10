import { useEffect, useState } from 'react';
import { 
  collection, 
  query, 
  onSnapshot, 
  where,
  doc,
  getDoc 
} from 'firebase/firestore';
import { db } from '@/../firebase.config';
import { Booking } from '@/types';

interface BookingWithRoom extends Booking {
  room: {
    id: string;
    name: string;
  } | null;
}

export const useBookings = (userId?: string) => {
    const [bookings, setBookings] = useState<BookingWithRoom[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
  
    useEffect(() => {
      try {
        const q = userId 
          ? query(collection(db, 'bookings'), where('userId', '==', userId))
          : query(collection(db, 'bookings'));
  
        const unsubscribe = onSnapshot(q, async (snapshot) => {
          const bookingsWithRooms = await Promise.all(
            snapshot.docs.map(async (item) => {
              const bookingData = item.data();
              const roomDoc = await getDoc(doc(db, 'rooms', bookingData.roomId));
              
              return {
                id: item.id,
                ...bookingData,
                room: roomDoc.exists() ? { id: roomDoc.id, ...roomDoc.data() } : null
              } as BookingWithRoom;
            })
          );
          
          setBookings(bookingsWithRooms);
          setLoading(false);
        });
  
        return () => unsubscribe();
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    }, [userId]);
  
    return { bookings, loading, error };
  };  
  
