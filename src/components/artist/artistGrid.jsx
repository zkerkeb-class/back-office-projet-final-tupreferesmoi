import {styled} from 'styled-components';
import React, {useState, useEffect} from 'react';
//import styles from "./ArtistGrid.module.css";
import ArtistForm from './artistForm';
import ArtistListElem from './artistListElem';
import CreateButton from '../button/createButton';
import {artistApi} from '../../app/api/artistApi';

const ArtistGridContainer = styled.div`
	border: red solid 2px;
	padding: 5px;
`;

const AGrid = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 15px;
`;

const ArtistGrid = () => {
	const [artists, setArtists] = useState([]);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [selectedArtist, setSelectedArtist] = useState(null);

	useEffect(() => {
		const fetchArtists = async () => {
			const response = await artistApi.getAllArtists();
			setArtists(response.data);
		};
		fetchArtists();
	}, []);

	//console.log(artists);
	const handleCreate = () => {
		setSelectedArtist(null);
		setIsFormOpen(true);
	};

	const handleSave = (artist) => {
		if (selectedArtist) {
			setArtists(artists.map((a) => (a.id === artist.id ? artist : a)));
		} else {
			setArtists([...artists, {...artist, id: Date.now()}]);
		}
		setIsFormOpen(false);
	};

	const handleDelete = (id) => {
		alert('confirmer la suppression');
		console.log('confirmed');
		setArtists(artists.filter((a) => a.id !== id));
	};

	return (
		<ArtistGridContainer>
			<h2>Liste des artistes</h2>
			<CreateButton onClick={handleCreate}>
				Créer un nouvel artiste
			</CreateButton>

			{isFormOpen && (
				<ArtistForm
					onSave={handleSave}
					artist={selectedArtist}
					onClose={() => setIsFormOpen(false)}
				/>
			)}

			<AGrid>
				{artists.map((artist) => (
					<ArtistListElem
						key={artist.id}
						artist={artist}
						onDelete={handleDelete}
						onEdit={() => {
							setSelectedArtist(artist);
							setIsFormOpen(true);
						}}
					/>
				))}
			</AGrid>
		</ArtistGridContainer>
	);
};

export default ArtistGrid;
