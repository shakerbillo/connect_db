import { useEffect, useState } from 'react';
import Places from './Places.jsx';

export default function AvailablePlaces({ onSelectPlace }) {
	const [availablePlaces, setAvailablePlaces] = useState([]);

	useEffect(() => {
		const fetchPlaces = async () => {
			const res = await fetch('http://localhost:3000/places');
			const data = await res.json();
			setAvailablePlaces(data.places);
		};
    fetchPlaces();
	}, []);
	return (
		<Places
			title='Available Places'
			places={availablePlaces}
			fallbackText='No places available.'
			onSelectPlace={onSelectPlace}
		/>
	);
}
