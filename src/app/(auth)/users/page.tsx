"use client";

import { Button, Spin } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const UsersPage = () => {
  return (
    <Spin>
      <div className="p-4 h-screen w-full">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
          <h1>Users</h1>
        </div>
      </div>

      <Button
        type="primary" 
        shape="circle" 
        size="large"
        htmlType="button"
        icon={<PlusOutlined />} 
        style={{ position: 'fixed', bottom: '20px', right: '20px' }} 
        onClick={() => {}}
      />
    </Spin>
  );
};

export default UsersPage;
