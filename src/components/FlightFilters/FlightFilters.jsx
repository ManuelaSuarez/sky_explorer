"use client"

import { useState } from "react"
import { FaChevronUp, FaChevronDown } from "react-icons/fa"
import "./FlightFilters.css"

const FlightFilters = () => {
  const [airlinesOpen, setAirlinesOpen] = useState(true)

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

     
    </div>
  )
}

export default FlightFilters
