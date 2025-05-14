import SearchBar from "../../components/SearchBar/SearchBar.jsx";
import FlightResults from "../../components/FlightResults/FlightResults.jsx";
// import FlightFilters from "../../components/FlightFilters/FlightFilters.jsx";
import "./Flights.css";

const Flights = () => {
  const flights = [
    {
      id: 1,
      airline: "Aerolineas Arg.",
      departureTime: "8:20",
      arrivalTime: "16:55",
      departureAirport: "ROS Fisherton",
      arrivalAirport: "BSB Presidente",
      duration: "8h 35m",
      returnDepartureTime: "6:20",
      returnArrivalTime: "17:20",
      returnDepartureAirport: "BSB Presidente",
      returnArrivalAirport: "Ros Fisherton",
      returnDuration: "11h 20m",
      price: "1.344.559",
    },
    {
      id: 2,
      airline: "Emirates",
      departureTime: "8:20",
      arrivalTime: "16:55",
      departureAirport: "ROS Fisherton",
      arrivalAirport: "BSB Presidente",
      duration: "8h 35m",
      returnDepartureTime: "6:20",
      returnArrivalTime: "17:20",
      returnDepartureAirport: "BSB Presidente",
      returnArrivalAirport: "Ros Fisherton",
      returnDuration: "11h 20m",
      price: "1.044.559",
    },
  ];

  return (
    <div className="flights-container">
      <main className="main-content">
        <SearchBar buttonText="Actualizar" />

        <div className="flights-results-container">
          <div className="flights-header">
            <h2 className="flights-title">Vuelos</h2>
            <div className="flights-sort">
              <span className="sort-label">Ordenar por</span>
              <div className="sort-dropdown">
                <span>Mayor precio</span>
                <span className="dropdown-arrow">▼</span>
              </div>
            </div>
          </div>

          <div className="flights-content">
            <FlightFilters />
            <div className="flights-list">
              {flights.map((flight) => (
                <FlightResults key={flight.id} flight={flight} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Flights;
