import React from 'react';
import useMediaCapture from '@/hooks/useMediaCapture';
import { useAuth } from '@/hooks/useAuth';
import { Button, message, Modal } from 'antd';
import { useAttachImageBooking } from '@/hooks/useAttachImageBooking';
import Image from 'next/image';

interface BookingQuickNoteDialogProps {
  open: boolean;
  onClose: () => void;
  bookingId: string;
}

const BookingQuickNoteDialog: React.FC<BookingQuickNoteDialogProps> = ({ open, onClose, bookingId }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const { user } = useAuth();
  const userId = user?.uid;

  const { media, error, isUploading, videoRef, captureImage, stopCamera } = useMediaCapture();
  const { updateBookingAttachment, loading: loadingAttachment } = useAttachImageBooking();

  const handleCapture = async () => {
    if (userId) {
      const result = await captureImage(userId);
      if (result) {
        await updateBookingAttachment(bookingId, result);
      }
    } else {
      messageApi.error('User ID not found');
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Capture Quick Note"
        open={open}
        onCancel={handleClose}
        footer={null}
      >
        <div>
          <video ref={videoRef} style={{ width: '100%' }} />
          <Button onClick={handleCapture} disabled={isUploading} loading={loadingAttachment}>
            {isUploading ? 'Mengupload...' : 'Ambil Foto'}
          </Button>
        
          {media && (
            <div style={{ position: 'relative', width: '100%', height: '200px' }}>
              <Image 
                src={media} 
                alt="Captured" 
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
          )}
        
          {error && <p>Error: {error.message}</p>}
        </div>
      </Modal>
    </>
  );
};

export default BookingQuickNoteDialog;