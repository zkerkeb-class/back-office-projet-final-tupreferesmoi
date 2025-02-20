import {useEffect, useState} from 'react';
import {artistApi} from '../app/api/artistApi';

export const ArtistManagement = () => {
	const [artists, setArtists] = useState([{id: 0}]);

	console.log(artists);
	useEffect(() => {
		const fetchArtists = async () => {
			const response = await artistApi.getAllArtists();
			setArtists(response.data);
		};
		fetchArtists();
	}, []);

	const handleCreateArtist = async () => {
		const newArtist = {
			name: 'Edouard le plus beau',
			createdAt: Date.now(),

			genres: ['Drill', 'Kawai'],
			image: null, // insertion de 3 taille d'images ,
			popularity: 0,
			updatedAt: Date.now(),
		};
		const createdArtist = await artistApi.createArtist(newArtist);
		setArtists([...artists, createdArtist]);
	};

	const handleUpdateArtist = async (id) => {
		const updatedArtist = {name: 'Updated Name'};
		await updateArtist(id, updatedArtist);
		setArtists(
			artists.map((artist) =>
				artist.id === id ? {...artist, ...updatedArtist} : artist
			)
		);
	};

	const handleDeleteArtist = async (id) => {
		await deleteArtist(id);
		setArtists(artists.filter((artist) => artist.id !== id));
	};

	return (
		<div>
			<h2>Gestion des Artiste</h2>
			<button onClick={handleCreateArtist}>Créer un artiste</button>
			<ul>
				{artists.map((artist) => (
					<li key={artist.id}>
						{artist.name} - {artist.email}
						<button onClick={() => handleUpdateArtist(artist.id)}>
							Modifier
						</button>
						<button onClick={() => handleDeleteArtist(artist.id)}>
							Supprimer
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

//export default ArtistManagement;
