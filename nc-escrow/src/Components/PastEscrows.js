import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Input, Select, DatePicker, Progress } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import EscrowCard from "./EscrowCard";

const { Option } = Select;
const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24,
    }}
    spin
  />
);

const NewEscrowModal = ({ visible, onCancel, onCreate, form }) => {
  const [progress, setProgress] = useState(false);

  const handleCreate = () => {
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      onCreate(values);
    });
  };

  return (
    <Modal
      visible={visible}
      title="New Escrow"
      onCancel={onCancel}
      onOk={handleCreate}
      footer={null}
    >
      <Form layout="vertical">
        <Form.Item label="Receiver">
          <Input />
        </Form.Item>
        <Form.Item label="Amount">
          <Input />
        </Form.Item>
        <Form.Item label="Condition Flow">
          <Select>
            <Option value="option1">Option 1</Option>
            <Option value="option2">Option 2</Option>
            <Option value="option3">Option 3</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Expiration Time">
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        </Form.Item>
        <Form.Item className="flex justify-center">
          {!progress && (
            <Button
              type="primary"
              onClick={() => {
                setProgress(true);
              }}
            >
              Create Escrow
            </Button>
          )}
          {progress && <Spin indicator={antIcon} />}
        </Form.Item>
      </Form>
    </Modal>
  );
};

const EscrowPage = () => {
  const [visible, setVisible] = useState(false);
  const [escrowList, setEscrowList] = useState([]);

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleCreate = (values) => {
    console.log("Received values of form: ", values);
    setVisible(false);
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_ENDPOINT}/escrow/escrows?creator=${window.wallet_address}&status=true`).then((data) => data.json()).then((data)=>   setEscrowList(data))
  }, []);

  return (
    <div className="m-7">
      <div className="my-4">
        <hr />
        <div className="flex flex-wrap">
          {escrowList.map((item) => (
            <EscrowCard
              key={item._id}
              escrowId={item.txid}
              receiver={item.receiver}
              amount={item.amount}
              conditionFlow={item.nodeid}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EscrowPage;
