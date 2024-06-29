import { useCallback, useEffect, useRef, useState } from 'react';

import logoImg from './assets/logo.png';
import AvailablePlaces from './components/AvailablePlaces.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import Error from './components/Error.jsx';
import Modal from './components/Modal.jsx';
import Places from './components/Places.jsx';
import { fetchUserPlaces, updateUserPlaces } from './http.js';

function App() {
	const selectedPlace = useRef();

	const [isFetching, setIsFetching] = useState(false);
	const [error, setError] = useState();

	const [userPlaces, setUserPlaces] = useState([]);
	const [errorUpdatingPlaces, setErrorUpdatingPlaces] = useState();

	const [modalIsOpen, setModalIsOpen] = useState(false);

	useEffect(() => {
		const fetchPlaces = async () => {
			setIsFetching(true);
			try {
				const places = await fetchUserPlaces();
				setUserPlaces(places);
			} catch (e) {
				setError({ message: error.message || 'Failed to fetch user places.' });
			}
			setIsFetching(false);
		};
		fetchPlaces();
	}, []);

	function handleStartRemovePlace(place) {
		setModalIsOpen(true);
		selectedPlace.current = place;
	}

	function handleStopRemovePlace() {
		setModalIsOpen(false);
	}

	async function handleSelectPlace(selectedPlace) {
		setUserPlaces((prevPickedPlaces) => {
			if (!prevPickedPlaces) {
				prevPickedPlaces = [];
			}
			if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
				return prevPickedPlaces;
			}
			return [selectedPlace, ...prevPickedPlaces];
		});
		try {
			await updateUserPlaces([selectedPlace, ...userPlaces]);
		} catch (error) {
			setUserPlaces(userPlaces);
			setErrorUpdatingPlaces({
				message: error.message || 'Failed to update place',
			});
		}
	}

	const handleRemovePlace = useCallback(
		async function handleRemovePlace() {
			setUserPlaces((prevPickedPlaces) =>
				prevPickedPlaces.filter(
					(place) => place.id !== selectedPlace.current.id
				)
			);

			try {
				await updateUserPlaces(
					userPlaces.filter((place) => place.id !== selectedPlace.current.id)
				);
			} catch (error) {
				setUserPlaces(userPlaces);
				setErrorUpdatingPlaces({
					message: error.message || 'Failed to delete place',
				});
			}

			setModalIsOpen(false);
		},
		[userPlaces]
	);

	const handleError = () => {
		setErrorUpdatingPlaces(null);
	};
	return (
		<>
			<Modal open={errorUpdatingPlaces} onClose={handleError}>
				{errorUpdatingPlaces && (
					<Error
						title='An error occurred!!'
						message={errorUpdatingPlaces.message}
						onConfirm={handleError}
					/>
				)}
			</Modal>
			<Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
				<DeleteConfirmation
					onCancel={handleStopRemovePlace}
					onConfirm={handleRemovePlace}
				/>
			</Modal>

			<header>
				<img src={logoImg} alt='Stylized globe' />
				<h1>PlacePicker</h1>
				<p>
					Create your personal collection of places you would like to visit or
					you have visited.
				</p>
			</header>
			<main>
				{error && (
					<Error title='An error occurred!!!' message={error.message} />
				)}
				{!error && (
					<Places
						title="I'd like to visit ..."
						fallbackText='Select the places you would like to visit below.'
						places={userPlaces}
						onSelectPlace={handleStartRemovePlace}
						isLoading={isFetching}
						loading='Fetching your places...'
					/>
				)}

				<AvailablePlaces onSelectPlace={handleSelectPlace} />
			</main>
		</>
	);
}

export default App;
