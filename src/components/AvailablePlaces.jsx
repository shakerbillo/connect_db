import { useEffect, useState } from "react";
import Places from "./Places.jsx";
import Error from "./Error.jsx";

export default function AvailablePlaces({ onSelectPlace }) {
  const [isFetching, setIsFetching] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    setIsFetching(true);
    const fetchPlaces = async () => {
      try {
        const res = await fetch("http://localhost:3000/places");
        const data = await res.json();

        if (!res.ok) {
          throw new Error("Failed to fetch places");
        }
        setAvailablePlaces(data.places);
      } catch (error) {
        setError({message: error.message || 'Could not fetch places. Try again later.'});
      }

      setIsFetching(false);
    };
    fetchPlaces();
  }, []);

  if (error) {
    return <Error title="An error occured!!!"  message={error.message}/>;
  }
  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={isFetching}
      loadingText="Fetching place data..."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}
