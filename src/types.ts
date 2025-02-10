export interface Room {
  id: string;
  name: string;
  capacity: number;
  features: string[];
  status: 'available' | 'booked';
}

export interface Booking {
  id: string;
  roomId: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  attachment?: {
    type: 'audio' | 'image';
    url: string;
  };
}