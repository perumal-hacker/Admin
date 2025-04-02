// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./Navbar/components/Header";
import Home from "./Home page/components/Home";
import AdminMeeting from "./admin meet/components/AdminMeeting";
import AdminPanel from "./admin panel/components/AdminPanel";
import Admincontact from "./admin contact/components/Admincontact";
import AdminOrders from "./admin orders/components/AdminOrders";
import GoogleMeet from "./google meet/components/GoogleMeet";

function App() {
  return (
    <div className="app-wrapper">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin-meeting" element={<AdminMeeting />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="/admin-contact" element={<Admincontact />} />
          <Route path="/admin-orders" element={<AdminOrders />} />
          <Route path="/google-meet" element={<GoogleMeet />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;