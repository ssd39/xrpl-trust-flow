import React, { useState, useEffect } from "react";
import { Button } from "antd";
import ConditionCard from "./ConditionCard";
import { useNavigate } from "react-router-dom";

const EscrowPage = () => {
  const [visible, setVisible] = useState(false);
  const [escrowList, setEscrowList] = useState([]);
  const navigate = useNavigate();
  const showModal = () => {
    navigate("/create_condition");
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleCreate = (values) => {
    console.log("Received values of form: ", values);
    setVisible(false);
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_ENDPOINT}/escrow/escmod/${window.wallet_address}`).then((data) => data.json()).then((data)=>  setEscrowList(data))
  }, []);

  return (
    <div className="m-7">
      <div className="flex items-center justify-start">
        <Button type="primary" className="mr-2" onClick={showModal}>
          New Condition
        </Button>
      </div>
      <div className="my-4">
        <h3 className="text-lg font-extrabold text-gray-800 mb-2">
          Condition Flows
        </h3>
        <hr />
        <div className="flex flex-wrap">
          {escrowList.map((item) => (
            <ConditionCard
              key={item._id}
              name={item.name || item._id}
              gData={item.model}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EscrowPage;
