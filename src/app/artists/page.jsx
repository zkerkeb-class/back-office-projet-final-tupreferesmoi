'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../utils/AuthContext';

const Container = styled.div`
  padding: 2rem;
  color: white;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin: 0;
`;

const ArtistList = styled.div`
  background: #282828;
  border-radius: 8px;
  overflow: hidden;
`;

const ArtistItem = styled.div`
  display: grid;
  grid-template-columns: 60px 2fr 1fr 100px auto;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #404040;
  gap: 1rem;

  &:hover {
    background: #333333;
  }
`;

const ArtistImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
`;

const ArtistName = styled.div`
  font-size: 1rem;
  color: white;
`;

const Genre = styled.div`
  color: #b3b3b3;
  font-size: 0.9rem;
`;

const Popularity = styled.div`
  color: #b3b3b3;
  font-size: 0.9rem;
  text-align: center;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: #b3b3b3;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;

  &:hover {
    color: ${props => props.danger ? '#ff1744' : '#1ed760'};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #282828;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #b3b3b3;
  font-size: 0.9rem;
`;

const Input = styled.input`
  background: #3E3E3E;
  border: 1px solid #404040;
  padding: 0.75rem;
  border-radius: 4px;
  color: white;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #1DB954;
  }
`;

const ErrorMessage = styled.p`
  color: #e91429;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
`;

const PageButton = styled.button`
  background: ${props => props.active ? '#1DB954' : '#282828'};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #1ed760;
  }

  &:disabled {
    background: #404040;
    cursor: not-allowed;
  }
`;

export default function ArtistsPage() {
  const [artists, setArtists] = useState([]);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuth();

  const getToken = () => {
    const cookie = document.cookie.split(';').find(c => c.trim().startsWith('token='));
    return cookie ? cookie.split('=')[1] : null;
  };

  useEffect(() => {
    fetchArtists(currentPage);
  }, [currentPage]);

  const fetchArtists = async (page) => {
    try {
      const token = getToken();
      if (!token) {
        setError('Token not found');
        return;
      }

      const response = await fetch(`/api/artists?page=${page}&limit=20`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error fetching artists');
      }

      const data = await response.json();
      if (data.success) {
        setArtists(data.data);
        setTotalPages(data.pagination?.totalPages || 1);
        setError('');
      } else {
        throw new Error(data.message || 'Error fetching artists');
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    }
  };

  const handleEdit = (artist) => {
    setSelectedArtist(artist);
    setIsModalOpen(true);
    setError('');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this artist?')) {
      try {
        const token = getToken();
        const response = await fetch(`/api/artists/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Error deleting artist');
        }

        await fetchArtists(currentPage);
        setError('');
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getToken();
      const response = await fetch(`/api/artists/${selectedArtist.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: selectedArtist.name,
          genres: selectedArtist.genres,
          bio: selectedArtist.bio
        })
      });
      
      if (!response.ok) {
        throw new Error('Error updating artist');
      }

      await fetchArtists(currentPage);
      setIsModalOpen(false);
      setError('');
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Artists</Title>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <ArtistList>
        {artists.map((artist) => (
          <ArtistItem key={artist.id}>
            <ArtistImage 
              src={artist.imageUrl} 
              alt={artist.name}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/40x40?text=No+Image';
              }}
            />
            <ArtistName>{artist.name}</ArtistName>
            <Genre>{artist.genres?.[0] || 'No genre'}</Genre>
            <Popularity>{artist.popularity || 0}</Popularity>
            <ActionButtons>
              <IconButton onClick={() => handleEdit(artist)} title="Edit">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
              </IconButton>
              <IconButton onClick={() => handleDelete(artist.id)} danger title="Delete">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
              </IconButton>
            </ActionButtons>
          </ArtistItem>
        ))}
      </ArtistList>

      <Pagination>
        <PageButton 
          onClick={() => setCurrentPage(p => p - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </PageButton>
        {[...Array(totalPages)].map((_, i) => (
          <PageButton
            key={i + 1}
            active={currentPage === i + 1}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </PageButton>
        ))}
        <PageButton
          onClick={() => setCurrentPage(p => p + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </PageButton>
      </Pagination>

      {isModalOpen && selectedArtist && (
        <Modal onClick={() => setIsModalOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Name</Label>
                <Input
                  type="text"
                  value={selectedArtist.name || ''}
                  onChange={e => setSelectedArtist({...selectedArtist, name: e.target.value})}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Genres (comma separated)</Label>
                <Input
                  type="text"
                  value={selectedArtist.genres?.join(', ') || ''}
                  onChange={e => setSelectedArtist({
                    ...selectedArtist,
                    genres: e.target.value.split(',').map(g => g.trim()).filter(g => g)
                  })}
                />
              </FormGroup>
              <FormGroup>
                <Label>Image URL</Label>
                <Input
                  type="text"
                  value={selectedArtist.imageUrl || ''}
                  onChange={e => setSelectedArtist({...selectedArtist, imageUrl: e.target.value})}
                />
              </FormGroup>
              <ActionButtons>
                <IconButton type="submit">Save</IconButton>
                <IconButton type="button" danger onClick={() => setIsModalOpen(false)}>
                  Cancel
                </IconButton>
              </ActionButtons>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
} 