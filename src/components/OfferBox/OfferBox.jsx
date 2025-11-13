import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "./OfferBox.css";

const OfferBox = () => {
  const navigate = useNavigate();
  const [destacados, setDestacados] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/flights/featured")
      .then((res) => res.json())
      .then((data) => setDestacados(data))
      .catch((err) => console.error("Error cargando destacados:", err));
  }, []);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleClick = (vuelo) => {
    console.log("Vuelo seleccionado:", vuelo);

    // Si no tiene fecha, usar mañana como base
    const hoy = new Date();
    hoy.setDate(hoy.getDate() + 1);

    // Fecha de salida
    const fechaSalida = vuelo.date
      ? new Date(vuelo.date + "T00:00:00")
      : hoy;

    // Sugerimos una fecha de regreso, pero no la forzamos
    const fechaRegreso = new Date(fechaSalida);
    fechaRegreso.setDate(fechaRegreso.getDate() + 7);

    const params = new URLSearchParams({
      origin: vuelo.origin,
      destination: vuelo.destination,
      departureDate: formatDate(fechaSalida),
      returnDate: formatDate(fechaRegreso),
      passengers: 1,
    });

    // Pasamos también los datos por state
    navigate(`/flights?${params.toString()}`, {
      state: {
        origin: vuelo.origin,
        destination: vuelo.destination,
        departureDate: formatDate(fechaSalida),
        returnDate: formatDate(fechaRegreso),
        passengers: 1,
      },
    });
  };

  if (!destacados.length) return <p>Cargando destacados...</p>;

  return (
    <section className="offer-carousel">
      <h2>Destinos destacados</h2>

      <Swiper
        modules={[Navigation, Mousewheel]}
        spaceBetween={20}
        slidesPerView={1}
        navigation
        mousewheel
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {destacados.map((v) => (
          <SwiperSlide key={v.id}>
            <div className="offer-box" onClick={() => handleClick(v)}>
              <div className="offer-image-container">
                <img
                  src={`http://localhost:3000${v.imageUrl}`}
                  alt={v.destination}
                  className="offer-image"
                />
              </div>
              <div className="offer-content">
                <h3 className="offer-destination">{v.destination}</h3>
                <p className="offer-origin">Desde {v.origin}</p>
                <p className="offer-price">${v.basePrice.toLocaleString()}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default OfferBox;
