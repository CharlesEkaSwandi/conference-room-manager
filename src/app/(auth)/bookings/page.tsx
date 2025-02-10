"use client";

import { useState } from "react";
import { Button, Table } from "antd";
import dayjs from 'dayjs';

import { useBookings } from "@/hooks/useBookings";
import { useAuth } from "@/hooks/useAuth";
import BookingQuickNoteDialog from "@/components/BookingQuickNoteDialog";
import { Booking } from "@/types";

const BookingsPage = () => {
  const { user } = useAuth();
  const { bookings, loading, error } = useBookings(user?.uid);

  const [dialog, setDialog] = useState<{
    open: boolean;
    bookingId: string;
  }>({
    open: false,
    bookingId: '',
  });

  if (error) {
    return <div>Error loading bookings: {error.message}</div>;
  }

  const columns = [
    {
      title: 'Meeting Name',
      dataIndex: 'meetingName',
      key: 'meetingName',
    },
    {
      title: 'Room',
      dataIndex: 'room',
      key: 'room',
      render: (room: { id: string; name: string }) => {
        return <span>{room.name}</span>;
      }
    },
    {
      title: 'Start Time',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (startTime: { seconds: number; nanoseconds: number }) => {
        const date = new Date(startTime.seconds * 1000 + startTime.nanoseconds / 1000000);
        return <span>{dayjs(date).format('DD MMM YYYY - HH:mm')}</span>;
      }
    },
    {
      title: 'End Time',
      dataIndex: 'endTime',
      key: 'endTime',
      render: (endTime: { seconds: number; nanoseconds: number }) => {
        const date = new Date(endTime.seconds * 1000 + endTime.nanoseconds / 1000000);
        return <span>{dayjs(date).format('DD MMM YYYY - HH:mm')}</span>;
      }
    },
    {
      title: 'Quick Note',
      dataIndex: 'attachment',
      key: 'attachment',
      render: (attachment: string, record: Booking) => {
        if (attachment) {
          return <Button onClick={() => {}}>Show</Button>;
        }
        return <Button onClick={() => setDialog({ open: true, bookingId: record.id })}>Add</Button>;
      }
    }
  ];

  return (
    <>
      <div className="p-4 h-screen w-full">
        <h1>My Bookings</h1>
        <Table 
          loading={loading}
          dataSource={bookings || []} 
          columns={columns} 
          rowKey="id" 
          pagination={false} 
        />
      </div>

      {dialog.open && (
        <BookingQuickNoteDialog 
          open={dialog.open}
          onClose={() => setDialog({ open: false, bookingId: '' })}
          bookingId={dialog.bookingId}
        />
      )}
    </>
  );
};

export default BookingsPage;
