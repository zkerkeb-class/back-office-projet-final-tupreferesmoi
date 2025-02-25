import { useState } from 'react';
import styled from 'styled-components';
import { Button } from '../styles/AlbumStyles';

const Modal = styled.div`
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
  width: 100%;
  max-width: 500px;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
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

  &:focus {
    outline: none;
    border-color: #1DB954;
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

  &:focus {
    outline: none;
    border-color: #1DB954;
  }
`;

const ImagePreview = styled.div`
  margin-top: 1rem;
  width: 100%;
  max-width: 200px;
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
  gap: 1rem;
  align-items: flex-start;

  ${Input}[type="url"] {
    flex: 1;
  }
`;

export default function AlbumModal({ isOpen, onClose, formData, onChange, onSubmit, onImageUpload }) {
  const [previewUrl, setPreviewUrl] = useState(null);

  if (!isOpen) return null;

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
    onChange({...formData, coverImage: url});
    setPreviewUrl(url);
  };

  return (
    <Modal onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <form onSubmit={onSubmit}>
          <FormGroup>
            <Label>Titre</Label>
            <Input
              type="text"
              value={formData.title}
              onChange={e => onChange({...formData, title: e.target.value})}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Genres (séparés par des virgules)</Label>
            <Input
              type="text"
              value={formData.genres}
              onChange={e => onChange({...formData, genres: e.target.value})}
            />
          </FormGroup>
          <FormGroup>
            <Label>Date de sortie</Label>
            <Input
              type="date"
              value={formData.releaseDate ? new Date(formData.releaseDate).toISOString().split('T')[0] : ''}
              onChange={e => onChange({...formData, releaseDate: e.target.value})}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Type</Label>
            <Select
              value={formData.type}
              onChange={e => onChange({...formData, type: e.target.value})}
              required
            >
              <option value="">Sélectionner un type</option>
              <option value="album">Album</option>
              <option value="single">Single</option>
              <option value="ep">EP</option>
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
          <Button type="submit">
            Enregistrer
          </Button>
        </form>
      </ModalContent>
    </Modal>
  );
} 