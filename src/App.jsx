import React, { use, useState } from "react";
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
import ModalLogin from "./components/ModalLogin/ModalLogin.jsx";
import ModalRegister from "./components/ModalRegister/ModalRegister.jsx";

function App() {
  const [modalVisible, setModalVisible] = useState(""); // "login" | "register" | null


  const closeModal = () => setModalVisible("");

  return (
    <div className="app">
      <Router>
        <Header modalVisible={setModalVisible}/>
        {console.log(modalVisible)}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/flights" element={<Flights />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/myFlights" element={<MyFlights />} />
          <Route path="/admin/flights" element={<FlightManagement />} />
        </Routes>
        <Footer />

        {/* ModalWrapper con flip */}
        {modalVisible === "login" && (
          <ModalLogin 
            closeModal={closeModal} 
            openRegister={setModalVisible} 
          />
        )}

        {modalVisible === "register" && (
          <ModalRegister 
            closeModal={closeModal} 
            openLogin={setModalVisible} 
          />
        )}
      
      </Router>
    </div>
  );
}

export default App;
