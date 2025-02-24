import style from 'styled-components';

export const Container = style.div`
	padding: 20px;
`;

export const Header = style.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20px;
`;

export const NewArtistButton = style.button`
	padding: 10px 15px;
	background-color: #1db954;
	color: white;
	border: none;
	border-radius: 5px;
	cursor: pointer;
	font-size: 16px;
	&:hover {
		background-color: #17a744;
	}
`;

export const ArtistsGrid = style.div`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
	gap: 20px;
`;

export const ArtistCard = style.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	cursor: pointer;
	padding: 10px;
	border-radius: 10px;
	background: #222;
	transition: transform 0.2s;
	&:hover {
		transform: scale(1.05);
	}
`;

export const ArtistImage = style.img`
	width: 120px;
	height: 120px;
	object-fit: cover;
	border-radius: 50%;
`;

export const ArtistName = style.p`
	margin-top: 10px;
	font-size: 16px;
	color: white;
	font-weight: bold;
`;
