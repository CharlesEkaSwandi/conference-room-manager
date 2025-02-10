import { useState } from 'react';
import { 
  doc,
  updateDoc
} from 'firebase/firestore';
import { db } from '@/../firebase.config';

export const useAttachImageBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateBookingAttachment = async (bookingId: string, attachmentUrl: string) => {
    try {
      setLoading(true);
      setError(null);

      // Update booking document with attachment URL
      const bookingRef = doc(db, 'bookings', bookingId);
      await updateDoc(bookingRef, {
        attachment: attachmentUrl
      });

      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update attachment';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { updateBookingAttachment, loading, error };
};