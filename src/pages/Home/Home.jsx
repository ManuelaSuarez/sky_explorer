// src/pages/Home/Home.jsx
import SearchBar from "../../components/SearchBar/SearchBar";
import OfferBox from "../../components/OfferBox/OfferBox";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-container">
      <SearchBar buttonText="Buscar" />
      <OfferBox />
    </div>
  );
}