'use client';
import {useEffect} from 'react';
import {useRouter} from 'next/router';
import {useDispatch, useSelector} from 'react-redux';
import {fetchArtists, selectArtists} from '../storeRedux/artistsSlice';

import {
	Container,
	Header,
	NewArtistButton,
	ArtistsGrid,
	ArtistCard,
	ArtistImage,
	ArtistName,
} from './style';

const ArtistsPage = () => {
	const dispatch = useDispatch();
	const artists = useSelector(selectArtists);
	const router = useRouter();

	useEffect(() => {
		dispatch(fetchArtists());
	}, [dispatch]);

	return (
		<Container>
			<Header>
				<h1>Artists</h1>
				<NewArtistButton onClick={() => router.push('/artists/manage')}>
					New Artist
				</NewArtistButton>
			</Header>
			<ArtistsGrid>
				{artists.map((artist) => (
					<ArtistCard
						key={artist.id}
						onClick={() => router.push(`/artists/manage/${artist.id}`)}
					>
						<ArtistImage
							src={artist.image || '/placeholder.jpg'}
							alt={artist.name}
						/>
						<ArtistName>{artist.name}</ArtistName>
					</ArtistCard>
				))}
			</ArtistsGrid>
		</Container>
	);
};

export default ArtistsPage;
