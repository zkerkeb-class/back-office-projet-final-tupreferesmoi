'use client';
import {useEffect, useState} from 'react';
import {useRouter} from 'next/router';
import {useDispatch, useSelector} from 'react-redux';
import {
	getArtist,
	createArtist,
	updateArtist,
	deleteArtist,
} from '../../storeRedux/artistsSlice';

import {Container, Form, Label, Input, Button, DeleteButton} from './style';

const ManageArtistPage = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	const {id} = router.query;

	const isEditing = Boolean(id);
	const artist = useSelector((state) =>
		state.artists.artists.find((a) => a.id === id)
	);

	const [formData, setFormData] = useState({
		name: '',
		image: '',
	});

	useEffect(() => {
		if (isEditing && !artist && id) {
			dispatch(getArtist(id));
		} else if (artist) {
			setFormData({name: artist.name, image: artist.image});
		}
	}, [artist, id, isEditing, dispatch]);

	const handleChange = (e) => {
		setFormData({...formData, [e.target.name]: e.target.value});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (isEditing) {
			await dispatch(updateArtist({id, ...formData}));
		} else {
			await dispatch(createArtist(formData));
		}
		router.push('/artists');
	};

	const handleDelete = async () => {
		if (confirm('Are you sure you want to delete this artist?')) {
			await dispatch(deleteArtist(id));
			router.push('/artists');
		}
	};

	if (!artist) {
		return <p>Loading...</p>;
	}

	return (
		<Container>
			<h1>{isEditing ? 'Edit Artist' : 'New Artist'}</h1>
			<Form onSubmit={handleSubmit}>
				<Label>Name</Label>
				<Input
					type="text"
					name="name"
					value={formData.name}
					onChange={handleChange}
					required
				/>

				<Label>Image URL</Label>
				<Input
					type="text"
					name="image"
					value={formData.image}
					onChange={handleChange}
				/>

				<Button type="submit">
					{isEditing ? 'Save Changes' : 'Create Artist'}
				</Button>
				{isEditing && (
					<DeleteButton type="button" onClick={handleDelete}>
						Delete Artist
					</DeleteButton>
				)}
			</Form>
		</Container>
	);
};

export default ManageArtistPage;
