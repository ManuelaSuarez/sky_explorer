import { useState, useEffect } from "react";
import { toast } from "react-toastify";

const API = "http://localhost:3000/api/favorites";
const token = () => localStorage.getItem("token");

export default function useFavorite(flightId) {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    if (!token()) return;
    fetch(API, { headers: { Authorization: `Bearer ${token()}` } })
      .then((r) => (r.ok ? r.json() : []))
      .then((list) => setIsFav(list.some((f) => f.id === flightId)))
      .catch(() => setIsFav(false));
  }, [flightId]);

  const toggle = async () => {
    if (!token()) return toast.info("Inicia sesión para guardar vuelos");
    try {
      if (isFav) {
        await fetch(`${API}/${flightId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token()}` },
        });
        setIsFav(false);
      } else {
        await fetch(API, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token()}`,
          },
          body: JSON.stringify({ flightId }),
        });
        setIsFav(true);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return [isFav, toggle];
}