// Import necessary libraries
import React from "react";
import { Button } from "antd";
import { XummPkce } from "xumm-oauth2-pkce";
import "./App.css";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Define the landing page component
function LandingPage() {
  const navigate = useNavigate();

  const signedInHandler = (authorized) => {
    // Assign to global,
    // please don't do this but for the sake of the demo it's easy
    window.sdk = authorized.sdk;
    navigate("/dashboard");
  };

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
          window.wallet_address = state.me.account
          signedInHandler(state);
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
          window.wallet_address = state.me.account
          signedInHandler(state);
        }
      });
    });

    await auth.authorize();
  };

  return (
    <div className="bg-black">
      <div className="fixed flex items-center justify-center w-full h-full">
          <video
            autoPlay
            loop
            muted
           
            height={'90%'}
            className="rounded-3xl Home_BG"
          >
            <source src="/xrpl.mp4" type="video/mp4" />
            {/* Add additional source tags for other video formats */}
          </video>
       
      </div>
      <div className="container mx-auto">
        <div className="flex flex-col justify-center items-center h-screen">
          <motion.h1
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-white text-5xl font-bold mb-4 relative TextSh"
          >
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: [1.2, 1, 1.2], rotate: [0, 10, -10, 0] }}
              transition={{
                repeatType: "loop",
                delay: 1,
                duration: 1,
                times: [0, 0.2, 0.8, 1],
              }}
              className="inline-block relative TextSh"
            >
              D
            </motion.span>
            eFi Wires
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="flex items-center z-50"
          >
            <h1 className="text-amber-200 text-3xl font-bold mb-4 TextSh">
            Automate and Structure Your DeFi Investments
            </h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="flex justify-center items-center"
          >
            <Button
              type="primary"
              size="large"
              className="animate-bounce px-10 py-4 rounded-full font-semibold text-lg"
              onClick={onConnect}
            >
              Connect with Xumm
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
