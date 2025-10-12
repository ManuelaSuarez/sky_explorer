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

  const handleClick = (vuelo) => {
    console.log("Vuelo seleccionado:", vuelo);

    // Si no tiene fecha, usamos mañana como fecha por defecto
    const fechaHoy = new Date();
    fechaHoy.setDate(fechaHoy.getDate() + 1);
    const fechaSalida = vuelo.date || vuelo.departureDate || fechaHoy.toISOString().split("T")[0];

    // Calcular fecha de regreso: una semana después
    const fechaRegreso = new Date(fechaHoy);
    fechaRegreso.setDate(fechaRegreso.getDate() + 7);
    const fechaRegresoStr = fechaRegreso.toISOString().split("T")[0];

    const params = new URLSearchParams({
      origin: vuelo.origin,
      destination: vuelo.destination,
      departureDate: fechaSalida,
      returnDate: fechaRegresoStr,
      passengers: 1,
    });

    navigate(`/flights?${params.toString()}`);
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