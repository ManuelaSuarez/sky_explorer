import { FaHeart, FaRegHeart, FaPlane } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import useFavorite from "../../hooks/useFavorite"; // 👈 hook
import "./FlightResults.css";

const FlightResults = ({ flight, passengers }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isFav, toggleFav] = useFavorite(flight.id); // 👈 estado y toggle

  const handleBuyClick = () => {
    const params = new URLSearchParams(location.search);
    navigate("/checkout", {
      state: {
        flight,
        passengers,
        departureDate: params.get("departureDate"),
        returnDate: params.get("returnDate"),
      },
    });
  };

  return (
    <div className="flight-card">
      <div className="flight-header">
        <span className="airline-name">{flight.airline}</span>

        {/* 👇 tu botón original, ahora inteligente */}
        <button className="save-button" onClick={toggleFav} title={isFav ? "Quitar de favoritos" : "Guardar"}>
          {isFav ? <FaHeart color="crimson" /> : <FaRegHeart />}
          <span>{isFav ? "Guardado" : "Guardar"}</span>
        </button>
      </div>

      {/* resto idéntico a tu código */}
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
                  {flight.returnDepartureAirport} - {flight.returnArrivalAirport}
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
            <small>Precio por persona: ${flight.originalPrice.toLocaleString()}</small>
          </div>
          <button className="buy-button" onClick={handleBuyClick}>
            Comprar
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightResults;