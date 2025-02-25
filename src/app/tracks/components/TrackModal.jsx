import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button } from '../styles/TrackStyles';
import * as api from '../utils/api';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: #282828;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  color: white;
  max-height: 90vh;
  overflow-y: auto;
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
  font-size: 0.875rem;
  color: #b3b3b3;
`;

const Input = styled.input`
  padding: 0.75rem;
  background: #3e3e3e;
  border: 1px solid #3e3e3e;
  border-radius: 4px;
  color: white;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #1db954;
  }

  &[type="file"] {
    padding: 0.5rem;
    &::-webkit-file-upload-button {
      visibility: hidden;
      width: 0;
    }
    &::before {
      content: 'Choisir un fichier';
      display: inline-block;
      background: #1DB954;
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 3px;
      cursor: pointer;
      margin-right: 1rem;
    }
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  background: #3e3e3e;
  border: 1px solid #3e3e3e;
  border-radius: 4px;
  color: white;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #1db954;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
`;

const AudioPreview = styled.div`
  margin-top: 0.5rem;
  
  audio {
    width: 100%;
  }
`;

const FileInfo = styled.div`
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #b3b3b3;
`;

export default function TrackModal({ isOpen, onClose, onSubmit, track, albums, artists }) {
  const [formData, setFormData] = useState({
    title: '',
    albumId: '',
    artistId: '',
    audioFile: null,
    audioUrl: '',
    genres: [],
    explicit: false,
    featuring: []
  });

  const [fileInfo, setFileInfo] = useState(null);
  const [newAlbumTitle, setNewAlbumTitle] = useState('');
  const [newArtistName, setNewArtistName] = useState('');
  const [showNewAlbumInput, setShowNewAlbumInput] = useState(false);
  const [showNewArtistInput, setShowNewArtistInput] = useState(false);

  useEffect(() => {
    if (track) {
      setFormData({
        ...track,
        audioFile: null
      });
    }
  }, [track]);

  const handleChange = (e) => {
    const { name, value, type, files, checked } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      if (file) {
        setFileInfo({
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
          type: file.type
        });
        
        setFormData(prev => ({
          ...prev,
          audioFile: file,
          title: prev.title || file.name.replace(/\.[^/.]+$/, '')
        }));
      }
    } else if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name === 'genres') {
      setFormData(prev => ({
        ...prev,
        genres: value.split(',').map(g => g.trim()).filter(Boolean)
      }));
    } else if (name === 'featuring') {
      const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
      setFormData(prev => ({
        ...prev,
        featuring: selectedOptions
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      newArtist: showNewArtistInput ? { name: newArtistName } : null,
      newAlbum: showNewAlbumInput ? { title: newAlbumTitle } : null
    };
    onSubmit(submitData);
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <h2>{track ? 'Modifier la piste' : 'Ajouter une piste'}</h2>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="audioFile">Fichier audio</Label>
            <Input
              type="file"
              id="audioFile"
              name="audioFile"
              accept="audio/*"
              onChange={handleChange}
              required={!track}
            />
            {fileInfo && (
              <FileInfo>
                <div>Nom: {fileInfo.name}</div>
                <div>Taille: {fileInfo.size}</div>
                <div>Type: {fileInfo.type}</div>
              </FileInfo>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="title">Titre</Label>
            <Input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="artistId">Artiste principal</Label>
            {!showNewArtistInput ? (
              <>
                <Select
                  id="artistId"
                  name="artistId"
                  value={formData.artistId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionner un artiste</option>
                  {artists?.map(artist => (
                    <option key={artist._id} value={artist._id}>
                      {artist.name}
                    </option>
                  ))}
                </Select>
                <Button type="button" onClick={() => setShowNewArtistInput(true)}>
                  Créer un nouvel artiste
                </Button>
              </>
            ) : (
              <>
                <Input
                  type="text"
                  value={newArtistName}
                  onChange={(e) => setNewArtistName(e.target.value)}
                  placeholder="Nom du nouvel artiste"
                  required
                />
                <Button type="button" onClick={() => setShowNewArtistInput(false)}>
                  Sélectionner un artiste existant
                </Button>
              </>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="albumId">Album</Label>
            {!showNewAlbumInput ? (
              <>
                <Select
                  id="albumId"
                  name="albumId"
                  value={formData.albumId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Sélectionner un album</option>
                  {albums?.map(album => (
                    <option key={album._id} value={album._id}>
                      {album.title}
                    </option>
                  ))}
                </Select>
                <Button type="button" onClick={() => setShowNewAlbumInput(true)}>
                  Créer un nouvel album
                </Button>
              </>
            ) : (
              <>
                <Input
                  type="text"
                  value={newAlbumTitle}
                  onChange={(e) => setNewAlbumTitle(e.target.value)}
                  placeholder="Titre du nouvel album"
                  required
                />
                <Button type="button" onClick={() => setShowNewAlbumInput(false)}>
                  Sélectionner un album existant
                </Button>
              </>
            )}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="genres">Genres (séparés par des virgules)</Label>
            <Input
              type="text"
              id="genres"
              name="genres"
              value={formData.genres.join(', ')}
              onChange={handleChange}
              placeholder="Pop, Rock, Jazz..."
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="featuring">Featuring</Label>
            <Select
              id="featuring"
              name="featuring"
              multiple
              value={formData.featuring}
              onChange={handleChange}
              style={{ height: '100px' }}
            >
              {artists?.map(artist => (
                <option key={artist._id} value={artist._id}>
                  {artist.name}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <Label>
              <Input
                type="checkbox"
                name="explicit"
                checked={formData.explicit}
                onChange={handleChange}
              />
              Contenu explicite
            </Label>
          </FormGroup>

          {formData.audioUrl && (
            <FormGroup>
              <Label>Aperçu</Label>
              <AudioPreview>
                <audio controls>
                  <source src={formData.audioUrl} type="audio/mpeg" />
                  Votre navigateur ne supporte pas l'élément audio.
                </audio>
              </AudioPreview>
            </FormGroup>
          )}

          <ButtonGroup>
            <Button type="button" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" $primary>
              {track ? 'Mettre à jour' : 'Créer'}
            </Button>
          </ButtonGroup>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
} 