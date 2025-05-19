import SearchBar from "../../components/SearchBar/SearchBar";
import OfferBox from "../../components/OfferBox/OfferBox";
import "./Home.css";
import bariloche from "../../utils/images/bariloche.jpg";
import mendoza from "../../utils/images/mendoza.jpg";
import rosario from "../../utils/images/rosario.webp";

const Home = () => {
  const offers = [
    {
      id: 1,
      image: bariloche,
      destination: "Bariloche",
      origin: "Buenos Aires",
      price: "1450000",
    },
    {
      id: 2,
      image: mendoza,
      destination: "Mendoza",
      origin: "Buenos Aires",
      price: "650000",
    },
        {
      id: 3,
      image: rosario,
      destination: "Rosario",
      origin: "Buenos Aires",
      price: "35000",
    },
  ];

  return (
    <div className="home-container">
      <SearchBar buttonText="Buscar" />

      <div className="offers-container">
        {offers.map((offer) => (
          <OfferBox
            key={offer.id}
            image={offer.image}
            destination={offer.destination}
            origin={offer.origin}
            price={offer.price}
          />
        ))}
      </div>
      <div className="all-destinations-link">
        <a href="">
          <img
            className="all-destinations-image"
            src="../../../public/all_destinations_img.jpg"
            alt=""
          />
        </a>
      </div>
    </div>
  );
};

export default Home;
