import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { FiSave, FiCheck } from "react-icons/fi";
import { GrClose } from "react-icons/gr";
import { LGraph } from "litegraph.js";
import { XummPkce } from "xumm-oauth2-pkce";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
/**
 *
 * @param {Object} data
 * @param {LGraph} data.lgGraph
 */
function Header({ title }) {
  const url = "https://testnet.xrpl-labs.com/";

  let [buttonvisible, setbuttonvisible] = useState(false);
  let [solution, setsolution] = useState("");
  let [sequence, setSequence] = useState("");
  let [condition, setCondition] = useState("");
  let [owner, setowner] = useState("");
  let [progress, setprogress] = useState(false);
  let [textmodal, settextmodal] = useState("");
  const back_url = process.env.REACT_APP_API_ENDPOINT;

  const signedInHandler = async (authorized) => {
    window.sdk = authorized.sdk;
    settextmodal("Sign using xumm");
    await go_payload();

    // do transaction for claim
  };
  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
      }}
      spin
    />
  );

  async function go_payload() {
    if (!window.sdk) {
      console.log("wait for this");
    }
    var payload = {
      txjson: {
        TransactionType: "EscrowFinish",
        Owner: owner,
        Fulfillment: solution,
        Condition: condition,
        OfferSequence: sequence,
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
          settextmodal("Signed Successfully");
          let responseData = await response.json();
          const datas = {
            creator: responseData.result.Account,
            receiver: responseData.result.Destination,
            condition: responseData.result.Condition,
            amount: responseData.result.Amount,
            txid: payloadOutcome.txid,
          };
          settextmodal("");
          console.log(responseData.result);
          setprogress(false);

          await escrowPast();
          setbuttonvisible(false);
          alert("Claimed Successfully");
        });
      })
      .catch(function (payloadError) {
        alert("Paylaod error", payloadError);
      });
  }

  const onConnect = async () => {
    var auth = new XummPkce("4dd5496e-2d69-4741-b242-f8607d415e72", {
      implicit: true,
    });

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
          window.wallet_address = state.me.account;
          signedInHandler(state);
        }
      });
    });

    await auth.authorize();
  };

  const escrowPast = async () => {
    let res = await fetch(`${back_url}/escrow/claimed/${title}`);
  };

  const handleOnClaim = async () => {
    setbuttonvisible(false);
    setprogress(true);
    onConnect();
  };
  useEffect(() => {
    let res;
    (async () => {
      res = await fetch(`${back_url}/escrow/escrow/${title}`);
      res = await res.json();
      if (res.status == true && res.past == false) {
        setbuttonvisible(true);
        setsolution(res.conditionSolution);
        setCondition(res.condition);
        setSequence(res.sequence);
        setowner(res.creator);
      }
    })();
  }, []);

  return (
    <div className="fixed w-full flex items-center justify-between h-16 bg-gray-800 text-white px-6">
      <h2
        className="text-xl font-semibold cursor-pointer"
        title="Double-click to change title"
      >
        <a
          href={`https://test.bithomp.com/explorer/${title}`}
          className="text-teal-400"
        >
          {" "}
          {title}{" "}
        </a>{" "}
      </h2>{" "}
      <div className="flex items-center space-x-4">
        {" "}
        {buttonvisible && (
          <div className="flex items-center space-x-4">
            <button
              onClick={handleOnClaim}
              className="px-4 py-2 rounded-md bg-green-500 hover:bg-green-600 text-white font-medium cursor-pointer"
            >
              Claim{" "}
            </button>{" "}
          </div>
        )}{" "}
        {progress && <Spin indicator={antIcon} />} <p> {textmodal} </p>
      </div>{" "}
    </div>
  );
}

export default Header;
