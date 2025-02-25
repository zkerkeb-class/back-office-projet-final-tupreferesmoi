import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button } from '../styles/AlbumStyles';
import * as api from '../utils/api';

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

  @media (max-width: 768px) {
    margin-bottom: 1rem;
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
  max-width: 100%;

  &:focus {
    outline: none;
    border-color: #1DB954;
  }

  @media (max-width: 768px) {
    padding: 0.625rem;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  background: #3E3E3E;
  border: 1px solid #404040;
  border-radius: 4px;
  color: white;
  font-size: 0.875rem;
  max-width: 100%;

  &:focus {
    outline: none;
    border-color: #1DB954;
  }

  @media (max-width: 768px) {
    padding: 0.625rem;
  }
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const ImagePreview = styled.div`
  margin-top: 0.75rem;
  width: 100%;
  max-width: 150px;
  aspect-ratio: 1;
  border-radius: 4px;
  overflow: hidden;
  background: #3E3E3E;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const InputGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
  flex-wrap: wrap;

  ${Input}[type="url"], ${Input}[type="file"] {
    flex: 1;
    min-width: 200px;
  }

  @media (max-width: 768px) {
    gap: 0.5rem;
    
    ${Input}[type="file"] {
      width: 100%;
    }
  }
`;

const SelectWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const ArtistList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #3E3E3E;
  border: 1px solid #404040;
  border-radius: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
`;

const ArtistItem = styled.li`
  padding: 0.75rem;
  cursor: pointer;
  color: white;

  &:hover {
    background: #4E4E4E;
  }

  &.new-artist {
    border-top: 1px solid #404040;
    color: #1DB954;
  }
`;

const AlbumModal = ({ isOpen, onClose, onSubmit, album }) => {
  const [formData, setFormData] = useState({
    title: '',
    genres: '',
    releaseDate: '',
    type: '',
    artistId: '',
    artistName: ''
  });
  const [error, setError] = useState('');
  const [artistSearch, setArtistSearch] = useState('');
  const [artists, setArtists] = useState([]);
  const [showArtistList, setShowArtistList] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (album) {
      setFormData({
        title: album.title || '',
        genres: Array.isArray(album.genres) ? album.genres.join(', ') : '',
        releaseDate: album.releaseDate ? new Date(album.releaseDate).toISOString().split('T')[0] : '',
        type: album.type || '',
        artistId: album.artistId || '',
        artistName: album.artist || ''
      });
      setSelectedArtist({
        id: album.artistId,
        name: album.artist
      });
      setArtistSearch(album.artist || '');
    } else {
      setFormData({
        title: '',
        genres: '',
        releaseDate: '',
        type: '',
        artistId: '',
        artistName: ''
      });
      setSelectedArtist(null);
      setArtistSearch('');
    }
  }, [album]);

  const searchArtists = async (query) => {
    if (!query.trim()) {
      setArtists([]);
      return;
    }

    try {
      const response = await api.fetchWithAuth(`/api/artists?name=${encodeURIComponent(query)}`);
      if (response.success) {
        setArtists(response.data);
      }
    } catch (error) {
      console.error('Erreur lors de la recherche des artistes:', error);
    }
  };

  const handleArtistSearch = (e) => {
    const value = e.target.value;
    setArtistSearch(value);
    setShowArtistList(true);
    searchArtists(value);
  };

  const selectArtist = (artist) => {
    setSelectedArtist(artist);
    setArtistSearch(artist.name);
    setFormData(prev => ({
      ...prev,
      artistId: artist.id,
      artistName: artist.name
    }));
    setShowArtistList(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError("Le titre de l'album est requis");
      return;
    }

    if (!selectedArtist && !artistSearch.trim()) {
      setError("L'artiste est requis");
      return;
    }

    if (!formData.releaseDate) {
      setError("La date de sortie est requise");
      return;
    }

    if (!formData.type) {
      setError("Le type d'album est requis");
      return;
    }

    try {
      let artistId = selectedArtist?.id;

      // Si pas d'artiste sélectionné mais un nom saisi, créer un nouvel artiste
      if (!artistId && artistSearch.trim()) {
        const newArtistResponse = await api.fetchWithAuth('/api/artists', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: artistSearch.trim() })
        });

        if (newArtistResponse.success) {
          artistId = newArtistResponse.data._id || newArtistResponse.data.id;
        } else {
          throw new Error("Erreur lors de la création de l'artiste");
        }
      }

      const albumData = {
        title: formData.title.trim(),
        genres: formData.genres
          ? formData.genres.split(',').map(g => g.trim()).filter(Boolean)
          : [],
        releaseDate: formData.releaseDate,
        type: formData.type,
        artistId: artistId
      };

      if (formData.coverImage) {
        albumData.coverImage = {
          thumbnail: formData.coverImage,
          medium: formData.coverImage,
          large: formData.coverImage
        };
      }

      console.log('Données envoyées au serveur:', albumData);
      await onSubmit(albumData);
      setError('');
    } catch (error) {
      console.error('Erreur complète:', error);
      setError(error.message);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Créer une URL de prévisualisation
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Appeler la fonction d'upload
    if (onImageUpload) {
      try {
        await onImageUpload(file);
      } catch (error) {
        console.error('Erreur lors de l\'upload:', error);
      }
    }
  };

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setFormData(prev => ({ ...prev, coverImage: url }));
    setPreviewUrl(url);
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Titre *</Label>
            <Input
              type="text"
              value={formData.title}
              onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Titre de l'album"
            />
          </FormGroup>

          <FormGroup>
            <Label>Artiste *</Label>
            <SelectWrapper>
              <Input
                type="text"
                value={artistSearch}
                onChange={handleArtistSearch}
                onFocus={() => setShowArtistList(true)}
                placeholder="Rechercher un artiste..."
              />
              {showArtistList && (artistSearch || artists.length > 0) && (
                <ArtistList>
                  {artists.map(artist => (
                    <ArtistItem
                      key={artist.id}
                      onClick={() => selectArtist(artist)}
                    >
                      {artist.name}
                    </ArtistItem>
                  ))}
                  {artistSearch && !artists.find(a => a.name.toLowerCase() === artistSearch.toLowerCase()) && (
                    <ArtistItem
                      className="new-artist"
                      onClick={() => {
                        setSelectedArtist(null);
                        setShowArtistList(false);
                      }}
                    >
                      + Créer "{artistSearch}"
                    </ArtistItem>
                  )}
                </ArtistList>
              )}
            </SelectWrapper>
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

          <FormGroup>
            <Label>Date de sortie *</Label>
            <Input
              type="date"
              value={formData.releaseDate}
              onChange={e => setFormData(prev => ({ ...prev, releaseDate: e.target.value }))}
            />
          </FormGroup>

          <FormGroup>
            <Label>Type *</Label>
            <Select
              value={formData.type}
              onChange={e => setFormData(prev => ({ ...prev, type: e.target.value }))}
            >
              <option value="">Sélectionner un type</option>
              <option value="album">Album</option>
              <option value="single">Single</option>
              <option value="ep">EP</option>
              <option value="compilation">Compilation</option>
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>Image de couverture</Label>
            <InputGroup>
              <Input
                type="url"
                value={formData.coverImage}
                onChange={handleUrlChange}
                placeholder="URL de l'image"
              />
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </InputGroup>
            {(previewUrl || formData.coverImage) && (
              <ImagePreview>
                <img
                  src={previewUrl || formData.coverImage}
                  alt="Prévisualisation"
                />
              </ImagePreview>
            )}
          </FormGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <Button type="submit" style={{ marginTop: '1.5rem' }}>
            {album ? 'Modifier' : 'Créer'}
          </Button>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default AlbumModal; 