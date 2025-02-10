import { useEffect } from "react";
import { Button, Form, Input, Drawer, message } from "antd";

import { useCreateRoom, FormValues } from "@/hooks/useCreateRoom";
import usePermissions from "@/hooks/usePermissions";
import { Room } from "@/types";

interface RoomFormProps {
  open: boolean;
  onClose: () => void;
  room?: Room;
}

const RoomForm = ({ open, onClose, room }: RoomFormProps) => {
  const allowModifyRooms = usePermissions("canModifyRooms");
  const [form] = Form.useForm<FormValues>();
  const [messageApi, contextHolder] = message.useMessage();

  const { createRoom, updateRoom, loading } = useCreateRoom();

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      if (room) {
        await updateRoom(room.id, values);
        messageApi.success('Room updated successfully');
      } else {
        await createRoom(values);
        messageApi.success('Room created successfully');
      }
      handleClose();
    } catch (error) {
      messageApi.error('Failed to update or create room');
      console.error(error);
    }
  };

  useEffect(() => {
    if (room) {
      form.setFieldsValue(room);
    }
  }, [room, form]);

  return (
    <>
      {contextHolder}
      <Drawer
        title="Create New Room"
        placement="right"
        closable={true}
        onClose={handleClose}
        open={open && allowModifyRooms}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            label="Room Name"
            name="name"
            rules={[{ required: true, message: "Please enter a room name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Capacity"
            name="capacity"
            rules={[{ required: true, message: "Please enter room capacity" }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.List name="features">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Form.Item key={key} label={`Feature ${key + 1}`} required={false}>
                    <Form.Item
                      {...restField}
                      name={[name]}
                      rules={[{ required: true, message: "Missing feature" }]}
                      noStyle
                    >
                      <Input placeholder="Feature" style={{ width: '60%' }} />
                    </Form.Item>
                    <Button type="link" onClick={() => remove(name)}>
                      Remove
                    </Button>
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block>
                    Add Feature
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Button type="primary" htmlType="submit" loading={loading}>
            {room ? 'Update Room' : 'Create Room'}
          </Button>
        </Form>
      </Drawer>
    </>
  );
};

export default RoomForm;
