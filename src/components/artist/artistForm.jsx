import React, {useState} from 'react';
import {styled} from 'styled-components';

const ArtistFormContainer = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;
`;

const ArtistFormx = styled.form`
	background: white;
	padding: 20px;
	border-radius: 8px;
	display: flex;
	flex-direction: column;
`;

const ArtistForm = ({onSave, artist, onClose}) => {
	const [formData, setFormData] = useState(
		artist || {name: '', genres: '', popularity: ''}
	);

	const handleChange = (e) => {
		setFormData({...formData, [e.target.name]: e.target.value});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		onSave({
			...formData,
			updatedAt: new Date().toISOString(),
			createdAt: artist?.createdAt || new Date().toISOString(),
		});
	};

	return (
		<ArtistFormContainer>
			<ArtistFormx onSubmit={handleSubmit}>
				<h3>{artist ? "Modifier l'artiste" : 'Créer un nouvel artiste'}</h3>
				<label>Nom de l'artiste</label>
				<input
					type="text"
					name="name"
					value={formData.name}
					onChange={handleChange}
					required
				/>

				<label>Genres</label>
				<input
					type="text"
					name="genres"
					value={formData.genres}
					onChange={handleChange}
					required
				/>

				<label>Popularité</label>
				<input
					type="number"
					name="popularity"
					value={formData.popularity}
					onChange={handleChange}
					required
				/>

				<button type="submit">Confirmer</button>
				<button onClick={onClose} type="button">
					Annuler
				</button>
			</ArtistFormx>
		</ArtistFormContainer>
	);
};

export default ArtistForm;
