import React from 'react';
import styled from 'styled-components';
import EditButton from '../button/editButton.jsx';
import DeleteButton from '../button/deleteButton.jsx';

const ArtistListElemContainer = styled.div`
	border: 1px solid #ddd;
	padding: 15px;
	border-radius: 8px;
	background: white;
`;

const ArtistListElem = ({artist, onDelete, onEdit}) => {
	//console.log(artist.name);
	return (
		<ArtistListElemContainer id={artist.id}>
			<img src={artist.imageUrl} alt="" />
			<h4>{artist.name}</h4>
			<p>Genres: {artist.genres}</p>
			<p>Popularité: {artist.popularity}</p>
			<p>Créé le: {new Date(artist.createdAt).toLocaleDateString()}</p>
			<p>Modifié le: {new Date(artist.updatedAt).toLocaleDateString()}</p>
			<EditButton onClick={onEdit}>Modifier</EditButton>
			<DeleteButton onClick={() => onDelete(artist.id)}>Supprimer</DeleteButton>
		</ArtistListElemContainer>
	);
};

export default ArtistListElem;
