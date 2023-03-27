import React, { useState } from "react";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import { Select } from "antd";
import { XummPkce } from "xumm-oauth2-pkce";
var Buffer = require("buffer/").Buffer;
const cc = require("five-bells-condition");

// Define the page component
function MyPage() {
  const url = "https://testnet.xrpl-labs.com/";
  const back_url = process.env.REACT_APP_API_ENDPOINT;

  var auth = new XummPkce("0f44845d-216a-4239-bf3e-5c97611bac30", {
    implicit: true,
  });

  async function signedInHandler(authorized) {
    // Assign to global,
    // please don't do this but for the sake of the demo it's easy
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

  async function go_payload(e) {
    e.preventDefault();
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
    var payload = {
      txjson: {
        TransactionType: "EscrowCreate",
        Amount: "1000",
        Destination: "rn957ufJRsuErNt4BS8RJTrk9VhJnrBnKc",
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
        alert(
          created.pushed
            ? "Now check Xumm, there should be a push notification + sign request in your event list waiting for you ;)"
            : "Now check Xumm, there should be a sign request in your event list waiting for you ;) (This would have been pushed, but it seems you did not grant Xumm the push permission)"
        );

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

          let responseData = await response.json();
          const datas = {
            creator: responseData.result.Account,
            receiver: responseData.result.Destination,
            condition: responseData.result.Condition,
            solution: fulfillment_hex,
            amount: responseData.result.Amount,
            nodeid: nodeId,
            txid: payloadOutcome.txid,
          };
          await createNewEscrow(datas);
          console.log(responseData.result);
        });
      })
      .catch(function (payloadError) {
        alert("Paylaod error", payloadError);
      });
  }
  // Define state variables for the form input values
  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");
  const [nodeId, setNodeId] = useState("");

  // Define a function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Receiver:", receiver);
    console.log("Amount:", amount);
    console.log("Node ID:", nodeId);
    // Add your logic for handling the form data here
  };

  // Render the form with input fields and a submit button
  return (
    <div style={{ backgroundColor: "#f0f0f0", minHeight: "100vh" }}>
      <Container className="d-flex justify-content-center align-items-center py-5">
        <div style={{ maxWidth: 500 }}>
          <h1 className="text-center mb-5"> Send Payment </h1>{" "}
          <Form onSubmit={go_payload}>
            <Form.Group controlId="formReceiver">
              <Form.Label> Receiver </Form.Label>{" "}
              <Form.Control
                type="text"
                placeholder="Enter receiver"
                value={receiver}
                onChange={(event) => setReceiver(event.target.value)}
                required
              />
            </Form.Group>{" "}
            <Form.Group controlId="formAmount">
              <Form.Label> Amount </Form.Label>{" "}
              <Form.Control
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                required
              />
            </Form.Group>{" "}
            <Form.Group controlId="formNodeId">
              <Form.Label> Node ID </Form.Label>{" "}
              <Select
                placeholder="Select a node ID"
                value={nodeId}
                onChange={(value) => setNodeId(value)}
                required
              >
                <Select.Option value="node1"> Node 1 </Select.Option>{" "}
                <Select.Option value="node2"> Node 2 </Select.Option>{" "}
                <Select.Option value="node3"> Node 3 </Select.Option>{" "}
              </Select>{" "}
            </Form.Group>{" "}
            <div className="text-center mt-4">
              <Button variant="primary" type="submit">
                Submit{" "}
              </Button>{" "}
            </div>{" "}
          </Form>{" "}
        </div>{" "}
      </Container>{" "}
    </div>
  );
}

export default MyPage;
