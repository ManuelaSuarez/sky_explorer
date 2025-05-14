import SearchBar from "../../components/SearchBar/SearchBar";
import OfferBox from "../../components/OfferBox/OfferBox";
import "./Home.css";

// Import images or use URLs
const bariloche =
  "https://images.unsplash.com/photo-1551523713-5e4d2d73c5ca?q=80&w=2070&auto=format&fit=crop";
const mendoza =
  "https://images.unsplash.com/photo-1581056771107-24695e0d96f3?q=80&w=2070&auto=format&fit=crop";

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
