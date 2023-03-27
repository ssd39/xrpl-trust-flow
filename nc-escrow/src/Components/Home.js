import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Input, Select, DatePicker, Progress } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import EscrowCard from "./EscrowCard";
import { XummPkce } from "xumm-oauth2-pkce";
var Buffer = require("buffer/").Buffer;
const cc = require("five-bells-condition");

const { Option } = Select;
const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 24,
    }}
    spin
  />
);

const NewEscrowModal = ({ visible, onCancel, onCreate, models }) => {
  const back_url = process.env.REACT_APP_API_ENDPOINT;

  const [form] = Form.useForm(); // Declare a form instance using the `useForm` hook
  const reciever = Form.useWatch("Receiver", form);
  const amount = Form.useWatch("Amount", form);
  const condition = Form.useWatch("Condition", form);
  const url = "https://testnet.xrpl-labs.com/";

  let [dropdow, setdropdow] = useState("");
  let [textmodal, settextmodal] = useState("");
  var auth = new XummPkce("0f44845d-216a-4239-bf3e-5c97611bac30", {
    implicit: true,
  });

  async function signedInHandler(authorized) {
    window.sdk = authorized.sdk;
  }
  async function go(e) {
    let ans = await auth.authorize();
    await signedInHandler(ans);
  }

  auth.on("error", (error) => {
    console.log("error", error);
  });

  auth.on("success", async () => {
    console.log("success");
    auth.state().then((state) => {
      if (state.me) {
        console.log("success, me", JSON.stringify(state.me));
      }
    });
  });

  auth.on("retrieved", async () => {
    // Redirect, e.g. mobile. Mobile may return to new tab, this
    // must retrieve the state and process it like normally the authorize method
    // would do
    console.log("Results are in, mobile flow, process sign in");

    auth.state().then((state) => {
      console.log(state);
      if (state) {
        console.log("retrieved, me:", JSON.stringify(state.me));
        signedInHandler(state);
      }
    });
  });

  function toBuffer(arrayBuffer) {
    const buffer = Buffer.alloc(arrayBuffer.byteLength);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < buffer.length; ++i) {
      buffer[i] = view[i];
    }
    return buffer;
  }

  async function createNewEscrow(data) {
    console.log(data);

    try {
      const response = await fetch(`${back_url}/escrow/newescrow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.error(error);
    }
  }

  async function go_payload(value) {
    const randomBytes = new Uint8Array(4);
    window.crypto.getRandomValues(randomBytes);

    const buffer = Buffer.from(
      randomBytes.buffer,
      randomBytes.byteOffset,
      randomBytes.byteLength
    );

    const fulfillment = new cc.PreimageSha256();
    fulfillment.setPreimage(toBuffer(buffer));

    const condition = fulfillment
      .getConditionBinary()
      .toString("hex")
      .toUpperCase();
    console.log("Condition:", condition);

    // Keep secret until you want to finish the escrow
    const fulfillment_hex = fulfillment
      .serializeBinary()
      .toString("hex")
      .toUpperCase();
    console.log("Fulfillment:", fulfillment_hex);
    if (!window.sdk) {
      console.log("wait for this");
      await go();
    }
    let amount = value.amount * 10 ** 6;
    var payload = {
      txjson: {
        TransactionType: "EscrowCreate",
        Amount: amount.toString(),
        Destination: value.destination,
        Condition: condition,
        CancelAfter: 3472349872,
      },
    };
    window.sdk.payload
      .createAndSubscribe(payload, async function (payloadEvent) {
        if (typeof payloadEvent.data.signed !== "undefined") {
          // What we return here will be the resolved value of the `resolved` property
          return payloadEvent.data;
        }
      })
      .then(async function ({ created, resolved }) {
        settextmodal("Confirm Xumm Request");

        resolved.then(async function (payloadOutcome) {
          console.log(payloadOutcome);
          let data = {
            method: "tx",
            params: [
              {
                transaction: payloadOutcome.txid,
                binary: false,
              },
            ],
          };
          let response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
          settextmodal("Xumm Request Confirmed");
          let responseData = await response.json();
          const datas = {
            creator: responseData.result.Account,
            receiver: responseData.result.Destination,
            condition: responseData.result.Condition,
            solution: fulfillment_hex,
            amount: responseData.result.Amount,
            nodeid: value.condition,
            txid: payloadOutcome.txid,
            sequence: responseData.result.Sequence,
          };
          await createNewEscrow(datas);
          setProgress(false);
          settextmodal("");
          console.log(responseData.result);
        });
      })
      .catch(function (payloadError) {
        alert("Paylaod error", payloadError);
      });
  }

  const [progress, setProgress] = useState(false);

  const onChange = (values) => {
    setdropdow(values);
    console.log(values);
  };
  const handleCreate = () => {
    form.validateFields((err, values) => {
      console.log("here we gooooo");
      if (err) {
        return;
      }
      console.log(values);
      onCreate(values);
    });
  };

  const handleClick = () => {
    let data = {};
    let ans = form.getFieldValue();
    data.amount = ans.Amount;
    data.destination = ans.Receiver;
    data.condition = dropdow;
    console.log(data);
    go_payload(data);
  };

  return (
    <Modal open={visible} title="New Escrow" onCancel={onCancel} footer={null}>
      <Form layout="vertical" form={form}>
        <Form.Item label="Receiver" name="Receiver">
          <Input />
        </Form.Item>
        <Form.Item label="Amount" name="Amount">
          <Input />
        </Form.Item>
        <Form.Item label="Condition Flow" name="Condition">
          <Select onChange={onChange} options={models} />
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
                handleClick();
              }}
            >
              Create Escrow
            </Button>
          )}
          {progress && <Spin indicator={antIcon} />}
        </Form.Item>
      </Form>
      <p style={{ textAlign: "center" }}> {textmodal} </p>
    </Modal>
  );
};

const EscrowPage = () => {
  const back_url = process.env.REACT_APP_API_ENDPOINT;
  let [models, setmodels] = useState({});

  const [visible, setVisible] = useState(false);
  const [escrowList, setEscrowList] = useState([]);

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    console.log("cancelled");
    setVisible(false);
  };

  const handleCreate = (values) => {
    console.log(values);
    console.log("Received values of form: ", values);
    setVisible(false);
  };

  const handleOk = () => {
    console.log("hello");
  };
  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_API_ENDPOINT}/escrow/escrows?creator=${window.wallet_address}&status=false`
    )
      .then((data) => data.json())
      .then((data) => setEscrowList(data));
    fetch(`${back_url}/escrow/escmod/${window.wallet_address}`)
      .then((data) => data.json())
      .then((data) => setmodels(data.map(convertToListItem)));
  }, []);

  function convertToListItem(obj) {
    return {
      label: obj.name,
      value: obj._id,
    };
  }

  return (
    <div className="m-7">
      <div className="flex items-center justify-start">
        <Button type="primary" className="mr-2" onClick={showModal}>
          New Escrow
        </Button>
        <NewEscrowModal
          visible={visible}
          onCancel={handleCancel}
          models={models}
          onCreate={handleCreate}
          form={Form.useForm()}
        />
      </div>
      <div className="my-4">
        <h3 className="text-lg font-extrabold text-gray-800 mb-2">
          Ongoing Escrows
        </h3>
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
