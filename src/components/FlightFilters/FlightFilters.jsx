"use client"

import { useState } from "react"
import { FaChevronUp, FaChevronDown } from "react-icons/fa"
import "./FlightFilters.css"

const FlightFilters = () => {
  const [airlinesOpen, setAirlinesOpen] = useState(true)
  const [classOpen, setClassOpen] = useState(true)
  const [aircraftOpen, setAircraftOpen] = useState(false)

  return (
    <div className="flight-filters">
      <div className="filter-section">
        <div className="filter-header" onClick={() => setAirlinesOpen(!airlinesOpen)}>
          <h3>Aerolineas</h3>
          {airlinesOpen ? <FaChevronUp /> : <FaChevronDown />}
        </div>

        {airlinesOpen && (
          <div className="filter-options">
            <label className="filter-option">
              <input type="checkbox" name="airline" value="aerolineas" />
              <span>Aerolineas Arg.</span>
            </label>
            <label className="filter-option">
              <input type="checkbox" name="airline" value="avianca" />
              <span>Avianca</span>
            </label>
            <label className="filter-option">
              <input type="checkbox" name="airline" value="emirates" />
              <span>Emirates</span>
            </label>
          </div>
        )}
      </div>

      <div className="filter-section">
        <div className="filter-header" onClick={() => setClassOpen(!classOpen)}>
          <h3>Clase</h3>
          {classOpen ? <FaChevronUp /> : <FaChevronDown />}
        </div>

        {classOpen && (
          <div className="filter-options">
            <label className="filter-option">
              <input type="checkbox" name="class" value="economica" />
              <span>Economica</span>
            </label>
            <label className="filter-option">
              <input type="checkbox" name="class" value="mixta" />
              <span>Mixta</span>
            </label>
            <label className="filter-option">
              <input type="checkbox" name="class" value="business" />
              <span>Business</span>
            </label>
          </div>
        )}
      </div>

      <div className="filter-section">
        <div className="filter-header" onClick={() => setAircraftOpen(!aircraftOpen)}>
          <h3>Avion</h3>
          {aircraftOpen ? <FaChevronUp /> : <FaChevronDown />}
        </div>

        {aircraftOpen && <div className="filter-options">{/* Aircraft options would go here */}</div>}
      </div>
    </div>
  )
}

export default FlightFilters