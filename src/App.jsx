import React, { useState } from "react";
import "./App.css";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Home from "./pages/Home/Home.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Flights from "./pages/Flights/Flights";
import Checkout from "./pages/Checkout/Checkout.jsx";
import MyFlights from "./pages/MyFlights/MyFlights.jsx";
import FlightManagement from "./pages/Admin/FlightManagement.jsx";

// Nuevo componente combinado
import ModalWrapper from "./components/ModalWrapper/ModalWrapper.jsx";

function App() {
  const [modalVisible, setModalVisible] = useState(null); // "login" | "register" | null

  const openLogin = () => setModalVisible("login");
  const openRegister = () => setModalVisible("register");
  const closeModal = () => setModalVisible(null);

  return (
    <div className="app">
      <Router>
        <Header openLogin={openLogin} openRegister={openRegister} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/flights" element={<Flights />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/myFlights" element={<MyFlights />} />
          <Route path="/admin/flights" element={<FlightManagement />} />
        </Routes>
        <Footer />

        {/* ModalWrapper con flip */}
        {modalVisible && (
          <ModalWrapper
            initialView={modalVisible}
            onClose={closeModal}
          />
        )}
      </Router>
    </div>
  );
}

export default App;
