import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SearchBar from "../../components/SearchBar/SearchBar.jsx";
import FlightResults from "../../components/FlightResults/FlightResults.jsx";
import FlightFilters from "../../components/FlightFilters/FlightFilters.jsx";
import "./Flights.css";

const Flights = () => {
  const location = useLocation();

  // PASO 1: Variables que guardamos
  const [allFlights, setAllFlights] = useState([]); // Todos los vuelos
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // PASO 2: Lo que busca el usuario
  const [searchFrom, setSearchFrom] = useState(""); // Desde dónde
  const [searchTo, setSearchTo] = useState(""); // Hacia dónde
  const [departureDate, setDepartureDate] = useState(""); // Fecha ida
  const [returnDate, setReturnDate] = useState(""); // Fecha vuelta
  const [passengers, setPassengers] = useState(""); // Pasajeros

  // PASO 3: Filtros adicionales
  const [chosenAirlines, setChosenAirlines] = useState([]); // Aerolíneas elegidas
  const [priceOrder, setPriceOrder] = useState("low-to-high"); // Orden precios

  // Leer filtros desde URL si existen (al entrar)
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const initialSearch = {
      origin: params.get("origin") || "",
      destination: params.get("destination") || "",
      departureDate: params.get("departureDate") || "",
      returnDate: params.get("returnDate") || "",
      passengers: params.get("passengers") || "",
    };

    setSearchFrom(initialSearch.origin);
    setSearchTo(initialSearch.destination);
    setDepartureDate(initialSearch.departureDate);
    setReturnDate(initialSearch.returnDate);
    setPassengers(initialSearch.passengers);
  }, [location.search]);

  // PASO 4: Traer vuelos del servidor
  const getFlights = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/flights");
      const flights = await response.json();
      setAllFlights(flights);
      setError("");
    } catch (err) {
      setError("No se pudieron cargar los vuelos");
    }
    setLoading(false);
  };

  // PASO 5: Cuando el usuario busca algo nuevo
  const handleSearch = (searchData) => {
    setSearchFrom(searchData.origin || "");
    setSearchTo(searchData.destination || "");
    setDepartureDate(searchData.departureDate || "");
    setReturnDate(searchData.returnDate || "");
    setPassengers(searchData.passengers || "");
    setChosenAirlines([]); // Limpiar filtros
  };

  // PASO 6: Mostrar solo vuelos que coinciden con la búsqueda - CORREGIDO
  const getMatchingFlights = () => {
    let flights = [...allFlights];

    // ¿Busca desde algún lugar específico?
    if (searchFrom) {
      flights = flights.filter((flight) =>
        flight.origin.toLowerCase().includes(searchFrom.toLowerCase())
      );
    }

    if (searchTo) {
      flights = flights.filter((flight) =>
        flight.destination.toLowerCase().includes(searchTo.toLowerCase())
      );
    }

    // Filtrar por fecha de salida
    if (departureDate) {
      flights = flights.filter((flight) => {
        const flightDate = flight.date || flight.departureDate;
        if (flightDate) {
          // Convertir ambas fechas a formato comparable (YYYY-MM-DD)
          const searchDate = new Date(departureDate)
            .toISOString()
            .split("T")[0];
          const flightDateFormatted = new Date(flightDate)
            .toISOString()
            .split("T")[0];
          return flightDateFormatted === searchDate;
        }
        return false;
      });
    }

    // Filtrar por fecha de regreso (si aplica)
    if (returnDate) {
      flights = flights.filter((flight) => {
        // Si tienes un campo específico para fecha de regreso
        const flightReturnDate = flight.returnDate;
        if (flightReturnDate) {
          const searchReturn = new Date(returnDate).toISOString().split("T")[0];
          const flightReturnFormatted = new Date(flightReturnDate)
            .toISOString()
            .split("T")[0];
          return flightReturnFormatted === searchReturn;
        }
        // Si no tienes fecha de regreso específica, no filtrar por esta condición
        return true;
      });
    }

    // Filtra por aerolíneas específicas
    if (chosenAirlines.length > 0) {
      flights = flights.filter((flight) =>
        chosenAirlines.includes(flight.airline)
      );
    }

    // Siempre ordena por precio
    if (priceOrder === "low-to-high") {
      flights.sort((a, b) => a.basePrice - b.basePrice); // Baratos primero
    } else {
      flights.sort((a, b) => b.basePrice - a.basePrice); // Caros primero
    }

    return flights;
  };

  // PASO 7: Preparar vuelo para mostrar en pantalla
  const prepareFlightData = (flight) => {
    const passengersCount = parseInt(passengers) || 1;
    const totalPrice = flight.basePrice * passengersCount;

    return {
      id: flight.id,
      airline: flight.airline,
      departureTime: flight.departureTime || "00:00",
      arrivalTime: flight.arrivalTime || "00:00",
      departureAirport: flight.origin,
      arrivalAirport: flight.destination,
      duration: "8h 35m",
      returnDepartureTime: flight.departureTime || "00:00",
      returnArrivalTime: flight.arrivalTime || "00:00",
      returnDepartureAirport: flight.destination,
      returnArrivalAirport: flight.origin,
      returnDuration: "8h 35m",
      price: totalPrice.toLocaleString(),
      originalPrice: flight.basePrice,
    };
  };

  // PASO 8: Crear título de la página
  const getTitle = () => {
    if (searchFrom && searchTo) {
      return `Vuelos de ${searchFrom} a ${searchTo}`;
    }
    return "Todos los vuelos";
  };

  // PASO 9: Crear información de la búsqueda
  const getSearchInfo = () => {
    const info = [];
    if (departureDate) info.push(`Salida: ${departureDate}`);
    if (returnDate) info.push(`Regreso: ${returnDate}`);
    if (passengers) info.push(`Pasajeros: ${passengers}`);
    return info.join(" | ");
  };

  // PASO 10: Obtener aerolíneas disponibles
  const getAirlines = () => {
    const airlines = allFlights.map((flight) => flight.airline);
    const uniqueAirlines = [...new Set(airlines)]; // Eliminar duplicados
    return uniqueAirlines.sort(); // Ordenar alfabéticamente
  };

  // PASO 11: Si hay búsqueda activa
  const isSearching = () => {
    return (
      searchFrom ||
      searchTo ||
      departureDate ||
      returnDate ||
      chosenAirlines.length > 0
    );
  };

  // PASO 12: Cargar vuelos cuando se abre la página
  useEffect(() => {
    getFlights();
  }, []);

  if (loading) return <div className="loading">Cargando vuelos...</div>;
  if (error) return <div className="error">{error}</div>;

  // PASO 13: Decidir qué vuelos mostrar
  const flightsToShow = getMatchingFlights();
  const noResults = flightsToShow.length === 0 && isSearching();

  // Mostrar la página
  return (
    <div className="flights-container">
      <main className="main-content">
        {/* Barra de búsqueda */}
        <SearchBar
          buttonText="Buscar vuelos"
          onSearch={handleSearch}
          initialSearchParams={{
            origin: searchFrom,
            destination: searchTo,
            departureDate,
            returnDate,
            passengers,
          }}
        />

        <div className="flights-results-container">
          {/* Título y información */}
          <div className="flights-header">
            <h2 className="flights-title">{getTitle()}</h2>
            {getSearchInfo() && (
              <div className="search-info">{getSearchInfo()}</div>
            )}

            {/* Ordenar por precio */}
            <div className="flights-sort">
              <span className="sort-label">Ordenar por precio:</span>
              <select
                value={priceOrder}
                onChange={(e) => setPriceOrder(e.target.value)}
                className="sort-select"
              >
                <option value="low-to-high">Menor a mayor</option>
                <option value="high-to-low">Mayor a menor</option>
              </select>
            </div>
          </div>

          <div className="flights-content">
            {/* Filtros de aerolíneas */}
            <FlightFilters
              onAirlineFilterChange={setChosenAirlines}
              availableAirlines={getAirlines()}
            />

            {/* Lista de vuelos */}
            <div className="flights-list">
              {flightsToShow.map((flight) => (
                <FlightResults
                  key={flight.id}
                  flight={prepareFlightData(flight)}
                />
              ))}

              {/* Si no hay resultados */}
              {noResults && (
                <div className="no-flights">
                  <p>No encontramos vuelos con esos criterios.</p>
                  <p>Intenta cambiar tu búsqueda.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Flights;
