// src/pages/Flights/Flights.jsx
"use client";

import { useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import SearchBar from "../../components/SearchBar/SearchBar.jsx";
import FlightResults from "../../components/FlightResults/FlightResults.jsx";
import FlightFilters from "../../components/FlightFilters/FlightFilters.jsx";
import ReviewForm from "../../components/ReviewForm/ReviewForm.jsx";
import ReviewList from "../../components/ReviewList/ReviewList.jsx";
import AirlineRating from "../../components/AirlineRating/AirlineRating.jsx";
import "./Flights.css";

const Flights = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams(); // ✅ leemos la URL

  // Vuelos del backend
  const [allFlights, setAllFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [user, setUser] = useState(null);

  // Datos de la búsqueda del usuario
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState("");

  // Filtros adicionales
  const [chosenAirlines, setChosenAirlines] = useState([]);
  const [priceOrder, setPriceOrder] = useState("low-to-high");

  // Cargar usuario autenticado
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:3000/api/users/profile/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((userData) => setUser(userData))
        .catch((err) => console.error("Error fetching user:", err));
    }
  }, []);

  // ✅ Cargar filtros desde la URL (query-string) o desde location.state
  useEffect(() => {
    const fromUrl = {
      origin: searchParams.get("origin") || "",
      destination: searchParams.get("destination") || "",
      departureDate: searchParams.get("departureDate") || "",
      returnDate: searchParams.get("returnDate") || "",
      passengers: searchParams.get("passengers") || "1",
    };

    const fromState = location.state || {};

    const final = {
      origin: fromState.origin || fromUrl.origin,
      destination: fromState.destination || fromUrl.destination,
      departureDate: fromState.departureDate || fromUrl.departureDate,
      returnDate: fromState.returnDate || fromUrl.returnDate,
      passengers: fromState.passengers || fromUrl.passengers,
    };

    setSearchFrom(final.origin);
    setSearchTo(final.destination);
    setDepartureDate(final.departureDate);
    setReturnDate(final.returnDate);
    setPassengers(String(final.passengers));
  }, [searchParams, location.state]);

  // ✅ Ejecutar búsqueda cuando cambian los filtros
  useEffect(() => {
    if (searchFrom || searchTo || departureDate) {
      getMatchingFlights();
    }
  }, [searchFrom, searchTo, departureDate, returnDate, passengers]);

  // Función que trae vuelos del servidor
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

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/api/reviews");
      if (response.ok) {
        const reviewsData = await response.json();
        setReviews(reviewsData);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleReviewSubmit = async (reviewData) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Debes iniciar sesión para escribir una reseña");
    }

    try {
      const url = editingReview
        ? `http://localhost:3000/api/reviews/${editingReview.id}`
        : "http://localhost:3000/api/reviews";

      const method = editingReview ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...reviewData,
          flightId: 1, // Default flight ID since we don't have specific flight selection
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al enviar la reseña");
      }

      await fetchReviews();
      setEditingReview(null);
    } catch (error) {
      throw error;
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    document.querySelector(".review-form-container")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const handleDeleteReview = async (reviewId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:3000/api/reviews/${reviewId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        await fetchReviews();
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  // Actualiza los datos en una nueva búsqueda
  const handleSearch = (searchData) => {
    setSearchFrom(searchData.origin || "");
    setSearchTo(searchData.destination || "");
    setDepartureDate(searchData.departureDate || "");
    setReturnDate(searchData.returnDate || "");
    setPassengers(searchData.passengers || "");
    setChosenAirlines([]); // Limpiar filtros
  };

  // Muestra los vuelos que coinciden con la búsqueda
  const getMatchingFlights = () => {
    let flights = [...allFlights];

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
          const searchDate = new Date(departureDate).toISOString().split("T")[0];
          const flightDateFormatted = new Date(flightDate).toISOString().split("T")[0];
          return flightDateFormatted === searchDate;
        }
        return false;
      });
    }

    // Filtrar por fecha de regreso (si aplica)
    if (returnDate) {
      flights = flights.filter((flight) => {
        const flightReturnDate = flight.returnDate;
        if (flightReturnDate) {
          const searchReturn = new Date(returnDate).toISOString().split("T")[0];
          const flightReturnFormatted = new Date(flightReturnDate).toISOString().split("T")[0];
          return flightReturnFormatted === searchReturn;
        }
        return true;
      });
    }

    // Filtra por aerolíneas específicas
    if (chosenAirlines.length > 0) {
      flights = flights.filter((flight) => chosenAirlines.includes(flight.airline));
    }

    // Ordena por precio
    if (priceOrder === "low-to-high") {
      flights.sort((a, b) => a.basePrice - b.basePrice);
    } else {
      flights.sort((a, b) => b.basePrice - a.basePrice);
    }

    return flights;
  };

  // Prepara vuelo para mostrar en pantalla
  const prepareFlightData = (flight) => {
    const passengersCount = Number.parseInt(passengers) || 1;
    const totalPrice = flight.basePrice * passengersCount;

    return {
      id: flight.id,
      airline: flight.airline,
      departureTime: flight.departureTime || "00:00",
      arrivalTime: flight.arrivalTime || "00:00",
      departureAirport: flight.origin,
      arrivalAirport: flight.destination,
      duration: flight.duration || "—",
      returnDepartureTime: flight.departureTime || "00:00",
      returnArrivalTime: flight.arrivalTime || "00:00",
      returnDepartureAirport: flight.destination,
      returnArrivalAirport: flight.origin,
      returnDuration: flight.returnDuration || flight.duration || "—",
      price: totalPrice.toLocaleString(),
      originalPrice: flight.basePrice,
    };
  };

  // Título dinámico de resultados
  const getTitle = () => {
    if (searchFrom && searchTo) {
      return `Vuelos de ${searchFrom} a ${searchTo}`;
    }
    return "Todos los vuelos";
  };

  // Resumen dinámico de los resultados
  const getSearchInfo = () => {
    const info = [];
    if (departureDate) info.push(`Salida: ${departureDate}`);
    if (returnDate) info.push(`Regreso: ${returnDate}`);
    if (passengers) info.push(`Pasajeros: ${passengers}`);
    return info.join(" | ");
  };

  // Obtener aerolíneas disponibles para el filtrado
  const getAirlines = () => {
    const airlines = allFlights.map((flight) => flight.airline);
    const uniqueAirlines = [...new Set(airlines)];
    return uniqueAirlines.sort();
  };

  const isSearching = () => {
    return searchFrom || searchTo || departureDate || returnDate || chosenAirlines.length > 0;
  };

  // Cargar vuelos cuando se abre la página
  useEffect(() => {
    getFlights();
    fetchReviews();
  }, []);

  if (loading) return <div className="loading">Cargando vuelos...</div>;
  if (error) return <div className="error">{error}</div>;

  // Muestra los vuelos que coinciden
  const flightsToShow = getMatchingFlights();

  // Muestra si no hay resultados
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
            {getSearchInfo() && <div className="search-info">{getSearchInfo()}</div>}

            {/* Ordenar por precio */}
            <div className="flights-sort">
              <span className="sort-label">Ordenar por precio:</span>
              <select value={priceOrder} onChange={(e) => setPriceOrder(e.target.value)} className="sort-select">
                <option value="low-to-high">Menor a mayor</option>
                <option value="high-to-low">Mayor a menor</option>
              </select>
            </div>
          </div>

          <div className="flights-content">
            {/* Filtros de aerolíneas */}
            <FlightFilters onAirlineFilterChange={setChosenAirlines} availableAirlines={getAirlines()} />

            {/* Lista de vuelos */}
            <div className="flights-list">
              {flightsToShow.map((flight) => (
                <div key={flight.id} className="flight-with-rating">
                  <AirlineRating airline={flight.airline} />
                  <FlightResults flight={prepareFlightData(flight)} passengers={Number.parseInt(passengers) || 1} />
                </div>
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

          <div className="reviews-section">
            <h2>Reseñas de Aerolíneas</h2>

            {/* Review Form */}
            <ReviewForm onReviewSubmit={handleReviewSubmit} existingReview={editingReview} airlines={getAirlines()} />

            {/* Reviews List */}
            {reviewsLoading ? (
              <div className="loading">Cargando reseñas...</div>
            ) : (
              <ReviewList
                reviews={reviews}
                currentUser={user}
                onEditReview={handleEditReview}
                onDeleteReview={handleDeleteReview}
                showAirlineInfo={true}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Flights;