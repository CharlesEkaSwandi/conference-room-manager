"use client";

import { useState } from "react";
import { Button, Card, Spin, DatePicker } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";

import { useRooms } from "@/hooks/useRooms";
import usePermissions from "@/hooks/usePermissions";
import BookingForm from "@/components/BookingForm";
import { Room } from "@/types";
import RoomForm from "@/components/RoomForm";

const Dashboard = () => {
  const allowModifyRooms = usePermissions("canModifyRooms");
  const allowBookRooms = usePermissions("canBookRooms");

  const [activeBookingForm, setActiveBookingForm] = useState<{ room: Room, open: boolean } | null>(null);
  const [activeRoomForm, setActiveRoomForm] = useState<{ open: boolean, room?: Room } | null>(null);
  
  const [startDateTime, setStartDateTime] = useState<Dayjs>(dayjs());
  const [endDateTime, setEndDateTime] = useState<Dayjs>(dayjs().add(1, 'hour'));

  const { rooms, loading, error } = useRooms(startDateTime, endDateTime);

  if (error) {
    return <div>Error: {error?.message || 'Something went wrong'}</div>;
  }

  return (
    <Spin spinning={loading}>
      <div className="p-4 h-screen w-full">
        <div className="flex justify-between items-center mb-4">
          <h1>Dashboard</h1>
          <DatePicker.RangePicker
            showTime
            value={[startDateTime, endDateTime]}
            onChange={(dates) => {
              if (dates && dates[0] && dates[1]) {
                setStartDateTime(dayjs(dates[0]));
                setEndDateTime(dayjs(dates[1]));
              }
            }}
          />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          {(rooms || []).map(room => (
            <Card key={room.id} title={room.name} style={{ width: 300 }}>
              <p>Capacity: {room.capacity}</p>
              <p>Status: {room.status || 'Available'}</p>
              <p>Features: {room.features.join(', ')}</p>
              <div className="flex justify-end gap-2">
                {room.status !== 'booked' && allowBookRooms && (
                  <Button
                    className="mt-4"
                    type="primary" 
                    onClick={() => setActiveBookingForm({ room, open: true })}>
                    Book
                  </Button>
                )}
                {allowModifyRooms && (
                  <Button
                    className="mt-4"
                    type="default" 
                    onClick={() => {
                      setActiveRoomForm({ open: true, room: room });
                    }}>
                    Edit
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {allowModifyRooms && (
        <Button
          type="primary" 
          shape="circle" 
          size="large"
          htmlType="button"
          icon={<PlusOutlined />} 
          style={{ position: 'fixed', bottom: '20px', right: '20px' }} 
          onClick={() => setActiveRoomForm({ open: true })}
        />
      )}
  
      <BookingForm 
        open={activeBookingForm?.open || false} 
        onClose={() => setActiveBookingForm(null)} 
        room={activeBookingForm?.room} 
        startDateTime={startDateTime}
        endDateTime={endDateTime}
      />

      <RoomForm
        open={activeRoomForm?.open || false}
        onClose={() => setActiveRoomForm(null)}
        room={activeRoomForm?.room}
      />
    </Spin>
  );
};

export default Dashboard;
