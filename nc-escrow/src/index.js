import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css';
import App from './App';
import ConditionCanvas from './Pages/ConditionCanvas';
import ConditionView from './Pages/ConditionView';
import Dashboard from './Pages/Dashboard';
import reportWebVitals from './reportWebVitals';
import Modal from 'react-modal';
import 'antd/dist/reset.css';
Modal.setAppElement('#root'); // specify the app element

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     <BrowserRouter>
      <Routes>
        <Route path="/create_condition" element={<ConditionCanvas />} />
        <Route path="/view_condition" element={<ConditionView />} />
        <Route path="/view_condition/:id" element={<ConditionView />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();