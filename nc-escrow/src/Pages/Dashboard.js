// Main.js

import React, { useEffect, useState } from "react";
import { Layout } from "antd";
import CustomMenu from "../Components/Menu";
import Home from "../Components/Home";
import AutoEscrows from "../Components/AutoEscrows";
import PastEscrows from "../Components/PastEscrows";
import Conditions from "../Components/Conditions";
import withAuth from "../Helpers/WithAuth";
const { Header, Content, Sider } = Layout;

const Main = () => {
  const [activeMenu, setActiveMenu] = useState("home");
  const [name, setMenuName] = useState("Home");
  const handleMenuClick = (e) => {
    switch(e.key){
        case '1':
            setMenuName('Home')
            setActiveMenu('home')
            break;
        case '2':
            setMenuName('Past Escrows')
            setActiveMenu('past_escrows')
            break;
        case '3':
            setMenuName('Conditions')
            setActiveMenu('conditions')
            break;
        case '4':
            setMenuName('Auto Escrow')
            setActiveMenu('auto_escrow')
            break
        default:
            setMenuName('Home')
            setActiveMenu('home')
            break   
    }
  };

  useEffect(()=>{
    console.log(window.sdk)
  },[])

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider style={{ backgroundColor: "#f5f5f5" }}>
        <CustomMenu  handleMenuClick={handleMenuClick} />
      </Sider>
      <Layout>
        <Header
          style={{
            backgroundColor: "#f5f5f5",
            fontWeight: "bold",
            fontSize: 32,
            display:'flex',
            justifyContent:'space-between'
            
          }}
  
        >
          <div>
          {name}
          </div>
          <div>
          Hi, {window.wallet_address}
          </div>
        </Header>
        <Content>
            {activeMenu == "home" && (<Home />)}
            {activeMenu == "past_escrows" && (<PastEscrows />)}
            {activeMenu == "conditions" && (<Conditions />)}
            {activeMenu == "auto_escrow" && (<AutoEscrows />)}
        </Content>
      </Layout>
    </Layout>
  );
};

export default withAuth(Main);
