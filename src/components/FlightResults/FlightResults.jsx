import { FaHeart, FaPlane } from "react-icons/fa";
import "./FlightResults.css";

const FlightResults = ({ flight }) => {
  return (
    <div className="flight-card">
      <div className="flight-header">
        <span className="airline-name">{flight.airline}</span>
        <button className="save-button">
          <FaHeart />
          <span>Guardar</span>
        </button>
      </div>

      <div className="flight-details">
        <div className="flight-info">
          <div className="flight-leg">
            <div className="plane-icon-container">
              <FaPlane className="plane-icon" />
            </div>
            <div className="flight-route">
              <div className="flight-time-info">
                <span className="flight-time">
                  {flight.departureTime} - {flight.arrivalTime}
                </span>
                <span className="flight-airports">
                  {flight.departureAirport} - {flight.arrivalAirport}
                </span>
              </div>
              <div className="flight-duration">{flight.duration}</div>
            </div>
          </div>

          <div className="flight-leg">
            <div className="plane-icon-container return">
              <FaPlane className="plane-icon" />
            </div>
            <div className="flight-route">
              <div className="flight-time-info">
                <span className="flight-time">
                  {flight.returnDepartureTime} - {flight.returnArrivalTime}
                </span>
                <span className="flight-airports">
                  {flight.returnDepartureAirport} -{" "}
                  {flight.returnArrivalAirport}
                </span>
              </div>
              <div className="flight-duration">{flight.returnDuration}</div>
            </div>
          </div>
        </div>

        <div className="vertical-divider"></div>

        <div className="flight-price-container">
          <div className="flight-price">
            <span className="price-symbol">$</span>
            <span className="price-value">{flight.price}</span>
          </div>
          <div className="unit-price">
            <small>
              Precio por persona: ${flight.originalPrice.toLocaleString()}
            </small>
          </div>
          <button className="buy-button">Comprar</button>
        </div>
      </div>
    </div>
  );
};

export default FlightResults;
