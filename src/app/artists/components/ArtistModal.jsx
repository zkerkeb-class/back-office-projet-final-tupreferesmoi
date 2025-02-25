import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button } from '../styles/ArtistStyles';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #282828;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 450px;
  max-height: 90vh;
  overflow-y: auto;
  margin: 20px;

  @media (max-width: 768px) {
    padding: 1.5rem;
    width: 95%;
  }

  /* Style de la scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #1a1a1a;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #404040;
    border-radius: 4px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
  max-width: 400px;

  @media (max-width: 768px) {
    margin-bottom: 1rem;
    max-width: 100%;
  }
`;

const Label = styled.label`
  display: block;
  color: white;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  background: #3E3E3E;
  border: 1px solid #404040;
  border-radius: 4px;
  color: white;
  font-size: 0.875rem;
  max-width: 400px;

  &:focus {
    outline: none;
    border-color: #1DB954;
  }

  @media (max-width: 768px) {
    padding: 0.625rem;
    max-width: 100%;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const ArtistModal = ({ isOpen, onClose, onSubmit, artist }) => {
  const [formData, setFormData] = useState({
    name: '',
    genres: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (artist) {
      setFormData({
        name: artist.name || '',
        genres: Array.isArray(artist.genres) ? artist.genres.join(', ') : ''
      });
    } else {
      setFormData({
        name: '',
        genres: ''
      });
    }
  }, [artist]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError("Le nom de l'artiste est requis");
      return;
    }

    const genres = formData.genres
      .split(',')
      .map(g => g.trim())
      .filter(Boolean);

    await onSubmit({
      name: formData.name,
      genres
    });

    setFormData({ name: '', genres: '' });
    setError('');
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Nom *</Label>
            <Input
              type="text"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nom de l'artiste"
            />
            {error && <ErrorMessage>{error}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label>Genres (séparés par des virgules)</Label>
            <Input
              type="text"
              value={formData.genres}
              onChange={e => setFormData(prev => ({ ...prev, genres: e.target.value }))}
              placeholder="Rock, Pop, Jazz..."
            />
          </FormGroup>

          <Button type="submit" style={{ marginTop: '1.5rem' }}>
            {artist ? 'Modifier' : 'Créer'}
          </Button>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ArtistModal;