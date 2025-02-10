import { useEffect, useState } from 'react';
import { Dayjs } from 'dayjs';
import { 
  collection, 
  query, 
  onSnapshot,
  where,
  Timestamp,
  QueryDocumentSnapshot,
  QuerySnapshot
} from 'firebase/firestore';
import type { Room } from "@/types";

import { db } from '@/../firebase.config';

export const useRooms = (startDateTime: Dayjs, endDateTime: Dayjs) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const roomsQuery = query(collection(db, 'rooms'));
      
      // Query 1: Booking that overlaps at the beginning
      const bookingsQuery1 = query(
        collection(db, 'bookings'),
        where('startTime', '>=', Timestamp.fromDate(startDateTime.toDate())),
        where('startTime', '<=', Timestamp.fromDate(endDateTime.toDate()))
      );

      // Query 2: Booking that overlaps at the end
      const bookingsQuery2 = query(
        collection(db, 'bookings'),
        where('endTime', '>=', Timestamp.fromDate(startDateTime.toDate())),
        where('endTime', '<=', Timestamp.fromDate(endDateTime.toDate()))
      );

      // Query 3: Booking that covers the entire time range
      const bookingsQuery3 = query(
        collection(db, 'bookings'),
        where('startTime', '<=', Timestamp.fromDate(startDateTime.toDate())),
        where('endTime', '>=', Timestamp.fromDate(endDateTime.toDate()))
      );

      const updateRoomsWithBookings = async (
        roomDocs: QueryDocumentSnapshot[], 
        activeBookings: Set<string>
      ) => {
        const updatedRooms = roomDocs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          status: activeBookings.has(doc.id) ? 'booked' : 'available'
        } as Room));
        setRooms(updatedRooms);
        setLoading(false);
      };

      let roomDocs: QueryDocumentSnapshot[] = [];
      let activeBookings = new Set<string>();

      const unsubscribeRooms = onSnapshot(roomsQuery, (roomSnapshot) => {
        roomDocs = roomSnapshot.docs;
        updateRoomsWithBookings(roomDocs, activeBookings);
      });

      const handleBookingSnapshots = (...snapshots: QuerySnapshot[]) => {
        activeBookings = new Set(
          snapshots.flatMap(snapshot => 
            snapshot.docs.map(doc => doc.data().roomId)
          )
        );
        updateRoomsWithBookings(roomDocs, activeBookings);
      };

      const unsubscribeBookings1 = onSnapshot(bookingsQuery1, (snap1) => {
        const unsubscribeBookings2 = onSnapshot(bookingsQuery2, (snap2) => {
          const unsubscribeBookings3 = onSnapshot(bookingsQuery3, (snap3) => {
            handleBookingSnapshots(snap1, snap2, snap3);
          });
          return unsubscribeBookings3;
        });
        return unsubscribeBookings2;
      });

      return () => {
        unsubscribeRooms();
        unsubscribeBookings1();
      };
    } catch (err) {
      setError(err as Error);
      setLoading(false);
    }
  }, [startDateTime, endDateTime]);

  return { rooms, loading, error };
};