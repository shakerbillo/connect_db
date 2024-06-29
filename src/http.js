export const fetchAvailablePlaces = async () => {
	const res = await fetch('http://localhost:3000/places');
	const data = await res.json();

	if (!res.ok) {
		throw new Error('Failed to fetch places');
	}

	return data.places;
};


export const fetchUserPlaces = async () => {
	const res = await fetch('http://localhost:3000/user-places');
	const data = await res.json();

	if (!res.ok) {
		throw new Error('Failed to fetch user places');
	}

	return data.places;
};
export const updateUserPlaces = async (places) => {
	const res = await fetch('http://localhost:3000/user-places', {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ places }),
	});

	const data = await res.json();
	if (!res.ok) {
		throw new Error('Failed to update user data');
	}

	return data.message;
};
