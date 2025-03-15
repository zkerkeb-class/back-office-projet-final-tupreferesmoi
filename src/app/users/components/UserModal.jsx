import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button } from '../styles/UserStyles';

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

const RoleSelect = styled.select`
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

const UserModal = ({ isOpen, onClose, onSubmit, user }) => {
  const [formData, setFormData] = useState({
        username: '',
        email: '',
        accountType : '',
        role: '', 
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email,
        accountType : user.accountType,
        role: user.role
      });
    } else {
      setFormData({
        username: '',
        email: '',
        accountType : '',
        role: '', 
      });
    }
  }, [user]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username.trim()) {
      setError("Le nom de l'utilisateur est requis");
      return;
    }

    await onSubmit({
      username: formData.username,
      email: formData.email,
      accountType: formData.accountType,
      role : formData.role      
    });

    setFormData({ username: '', email: '', accountType :'' , role : '' });
    setError('');
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Nom d'utilisateur</Label>
            <Input
              type="text"
              value={formData.username}
              onChange={e => setFormData(prev => ({ ...prev, username: e.target.value }))}
              placeholder="Nom de l'utilisateur"
            />
            {error && <ErrorMessage>{error}</ErrorMessage>}
          </FormGroup>

          <FormGroup>
            <Label>Email</Label>
            <Input
              type="text"
              value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="edouard.leplusbeau@gmail.com"
            />
          </FormGroup>

          <FormGroup>
            <Label>Type de compte</Label>
            <Input
              type="text"
              value={formData.accountType}
              onChange={e => setFormData(prev => ({ ...prev, accountType: e.target.value }))}
              placeholder="free / premium"
            />
          </FormGroup>

          <FormGroup>
            
            <Label>rôle</Label>
            <RoleSelect onChange={e => setFormData(prev => ({ ...prev, role: e.target.value }))}
             name="role"
              id="role-select"
              value={formData.role}>
              <option value="">--Choissisez une option--</option>
              <option value="admin">Administrateur</option>
              <option value="content-admin">Administrateur de contenu</option>
              <option value="moderator">Modérateur</option>
              <option value="catalog-manager">Gestionnaire Catalogue</option>
              <option value="user">Utilisateur(Client)</option>
            </RoleSelect>
            
          </FormGroup>

          <Button type="submit" style={{ marginTop: '1.5rem' }}>
            {user ? 'Modifier' : 'Créer'}
          </Button>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default UserModal;