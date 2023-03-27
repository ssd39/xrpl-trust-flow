import React, { useState } from "react";
import Modal from "react-modal";
import { FiSave, FiCheck } from "react-icons/fi";
import { GrClose } from "react-icons/gr";
import { LGraph } from "litegraph.js";
import { useNavigate } from "react-router-dom";

/**
 *
 * @param {Object} data
 * @param {LGraph} data.lgGraph
 */
function Header({ lgGraph }) {
  const [title, setTitle] = useState("Untitled Condition");
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const back_url = process.env.REACT_APP_API_ENDPOINT;
  const navigate = useNavigate();

  const handleTitleDoubleClick = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setNewTitle("");
  };

  const handleTitleSave = () => {
    if (newTitle) {
      setTitle(newTitle);
      handleModalClose();
    }
  };

  const handleOnSave = async () => {

    let data = {
      creator: window.wallet_address,
      name: title,
      model: lgGraph.serialize(),
    };
    const response = await fetch(`${back_url}/escrow/newnode`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    navigate('/dashboard')
    // Serialize the graph to a JSON string
    /*  const json = JSON.stringify(lgGraph.serialize());

          // Create a Blob object from the JSON string
          const blob = new Blob([json], { type: "application/json" });

           // Create a URL for the Blob object
          const url = URL.createObjectURL(blob);

          // Create a link element to download the file
          const link = document.createElement("a");
          link.href = url;
          link.download = "graph.json";

          // Click the link to download the file
          document.body.appendChild(link);
          link.click();

          // Cleanup
          document.body.removeChild(link);
          URL.revokeObjectURL(url); */
  };

  return (
    <div className="fixed w-full flex items-center justify-between h-16 bg-gray-800 text-white px-6">
      <h2
        className="text-xl font-semibold cursor-pointer"
        onDoubleClick={handleTitleDoubleClick}
        title="Double-click to change title"
      >
        
        {title}
      </h2>
      <div className="flex items-center space-x-4">
        <button
          onClick={handleOnSave}
          className="px-4 py-2 rounded-md bg-green-500 hover:bg-green-600 text-white font-medium"
        >
          <FiCheck className="inline-block mr-2" />
          Publish
        </button>
      </div>
      <Modal
        isOpen={showModal}
        onRequestClose={handleModalClose}
        className="modal"
        overlayClassName="overlay"
        contentLabel="Enter new title"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          content: {
            position: "absolute",
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "30%",
            backgroundColor: "white",
            borderRadius: "4px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
          },
        }}
      >
        <div className="flex justify-between items-center border-b-2 border-gray-200 py-2 px-4">
          <h3 className="text-lg font-semibold"> Enter new title: </h3>
          <GrClose
            className="text-gray-400 hover:text-gray-500 cursor-pointer"
            onClick={handleModalClose}
          />
        </div>
        <div className="p-4">
          <input
            type="text"
            className="border border-gray-300 px-2 py-1 rounded-md w-full mb-4"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <div className="flex justify-end">
            <button
              className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-medium mr-2"
              onClick={handleTitleSave}
            >
              Save
            </button>
            <button
              className="px-4 py-2 rounded-md bg-gray-500 hover:bg-gray-600 text-white font-medium"
              onClick={handleModalClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Header;
