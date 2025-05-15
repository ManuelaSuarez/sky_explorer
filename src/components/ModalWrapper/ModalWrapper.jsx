import React, { useState, useEffect } from "react";
import "./ModalWrapper.css";
import ModalLogin from "../ModalLogin/ModalLogin";
import ModalRegister from "../ModalRegister/ModalRegister";

const ModalWrapper = ({ initialView = "login", onClose }) => {
  const [isFlipped, setIsFlipped] = useState(initialView === "register");

  useEffect(() => {
    setIsFlipped(initialView === "register");
  }, [initialView]);

  const handleFlip = () => setIsFlipped(!isFlipped);
  

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className={`card-wrapper ${isFlipped ? "flipped" : ""}`}>
          <div className="card-side front">
            <ModalLogin onClose={onClose} openRegister={handleFlip} />
          </div>
          <div className="card-side back">
            <ModalRegister onClose={onClose} openLogin={handleFlip} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalWrapper;
