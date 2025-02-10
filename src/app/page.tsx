"use client";

import { useState } from "react";
import { Button, Input, Form, message } from "antd";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const router = useRouter();
  const { login } = useAuth();

  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      message.success("Login successful!");
      router.push("/dashboard");
    } catch (error) {
      message.error("Invalid email or password");
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Form onFinish={onFinish} layout="vertical">
        <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please enter your email" }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Password" name="password" rules={[{ required: true, message: "Please enter your password" }]}>
          <Input.Password />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading}>
          Login
        </Button>
      </Form>
    </div>
  );
};

export default Login;