import {useEffect, useState} from 'react';
import {artistApi} from '../app/api/artistApi';
import authService from '../services/authService';

export const ArtistManagement = () => {
	const [artists, setArtists] = useState([]);

	//console.log(artists);
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

			genres: ['Drill', 'Kawaï'],
			image: null, // insertion de 3 taille d'images ,
			popularity: 0,
			updatedAt: Date.now(),
		};

		const createdArtist = await artistApi.createArtist(
			JSON.stringify(newArtist)
		);
		setArtists([...artists, createdArtist]);
	};

	const handleUpdateArtist = async (id) => {
		const updatedArtist = {
			name: 'Edoudou',
			genres: ['Kawaï2', 'J-POP'],
			popularity: 5,
		};

		await artistApi.updateArtist(id, JSON.stringify(updatedArtist));
		setArtists(
			artists.map((artist) =>
				artist.id === id ? {...artist, ...updatedArtist} : artist
			)
		);
	};

	const handleDeleteArtist = async (id) => {
		console.log(id);
		await artistApi.deleteArtist(id);
		setArtists(artists.filter((artist) => artist.id !== id));
	};

	return (
		<div>
			<h2>Gestion des Artiste</h2>
			<button
				onClick={() => {
					handleUpdateArtist('67b88136f811643bf2c54bb4');
				}}
			>
				Créer un artiste
			</button>
			<ul>
				{artists.map((artist) => (
					<li id={artist.id} key={artist.id}>
						{artist.name} - {artist.genres[0]}
						<br></br>
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
