import { storage } from "../../firebase.config";

import { useRef, useState, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

declare class ImageCapture {
  constructor(track: MediaStreamTrack);
  takePhoto(): Promise<Blob>;
}

export const uploadMedia = async (file: File, userId: string) => {
  const storageRef = ref(storage, `media/${userId}/${Date.now()}_${file.name}`);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
};

const useMediaCapture = () => {
  const [media, setMedia] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    let currentStream: MediaStream | null = null;

    const initCamera = async () => {
      if (videoRef.current) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          currentStream = stream;
          setStream(stream);
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        } catch (err) {
          setError(err as Error);
        }
      }
    };

    initCamera();

    return () => {
      if (currentStream) {
        const tracks = currentStream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const stopCamera = () => {
    console.log('Stopping camera, current stream:', stream);
    if (stream) {
      const tracks = stream.getTracks();
      console.log('Tracks to stop:', tracks);
      tracks.forEach(track => {
        console.log('Stopping track:', track.kind, track.label);
        track.enabled = false;
        track.stop();
      });
      setStream(null);
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const captureImage = async (userId: string) => {
    if (!videoRef.current || !videoRef.current.srcObject) return;

    try {
      setIsUploading(true);
      let file: File;

      if ('ImageCapture' in window) {
        console.log('ImageCapture in window');
        const stream = videoRef.current.srcObject as MediaStream;
        const imageCapture = new ImageCapture(stream.getVideoTracks()[0]);
        const blob = await imageCapture.takePhoto();
        file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
      } else {
        console.log('ImageCapture not in window');
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        
        if (context) {
          context.drawImage(videoRef.current, 0, 0);
          const blob = await new Promise<Blob>((resolve) => 
            canvas.toBlob((blob) => resolve(blob!), 'image/jpeg')
          );
          file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
        }
      }

      const imageUrl = await uploadMedia(file!, userId);
      setMedia(imageUrl);
      return imageUrl;
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsUploading(false);
    }
  };

  return { media, error, isUploading, videoRef, captureImage, stopCamera };
};

export default useMediaCapture;