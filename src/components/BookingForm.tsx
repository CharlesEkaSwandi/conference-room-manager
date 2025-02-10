import { Button, Form, Input, Drawer, message } from "antd";
import { Dayjs } from "dayjs";
import { Room } from "@/types";
import { useCreateBooking } from "@/hooks/useCreateBooking";
import usePermissions from "@/hooks/usePermissions";

interface BookingFormProps {
  open: boolean;
  onClose: () => void;
  room?: Room;
  startDateTime: Dayjs;
  endDateTime: Dayjs;
}

interface BookingFormValues {
  meetingName: string;
}

const BookingForm = ({ open, onClose, room, startDateTime, endDateTime }: BookingFormProps) => {
  const [form] = Form.useForm<BookingFormValues>();
  const allowBookRooms = usePermissions("canBookRooms");
  const [messageApi, contextHolder] = message.useMessage();
  const { createBooking, loading } = useCreateBooking();

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  const handleSubmit = async (values: BookingFormValues) => {
    if (!room) return;

    const startTime = startDateTime.toDate();
    const endTime = endDateTime.toDate();

    const { success: bookingSuccess, error: bookingError } = await createBooking({
      meetingName: values.meetingName,
      startTime,
      endTime,
      room
    });

    if (bookingSuccess) {
      messageApi.success('Room booked successfully');
      handleClose();
    } else {
      messageApi.error(bookingError || 'Failed to book room');
    }
  };

  return (
    <>
      {contextHolder}
      <Drawer
        title={`Booking for ${room?.name || ''}`}
        placement="right"
        closable={true}
        onClose={handleClose}
        open={open && allowBookRooms}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            label="Meeting Name"
            name="meetingName"
            rules={[{ required: true, message: "Please enter a meeting name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Start Time">
            <Input value={startDateTime.format('YYYY-MM-DD HH:mm')} readOnly disabled />
          </Form.Item>

          <Form.Item label="End Time">
            <Input value={endDateTime.format('YYYY-MM-DD HH:mm')} readOnly disabled />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading}>
            Book Room
          </Button>
        </Form>
      </Drawer>
    </>
  );
};

export default BookingForm;