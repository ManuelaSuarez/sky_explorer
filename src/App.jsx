import "./App.css";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Home from "./pages/Home/Home.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Flights from "./pages/Flights/Flights"

function App() {

  return (
    <div className="app">
 <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/flights" element={<Flights />} />
        </Routes>
        <Footer />
      </Router>
    </div>
    
  );
}

export default App;
