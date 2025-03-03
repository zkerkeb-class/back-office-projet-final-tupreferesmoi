import { Table, Th, Td, Tr, ActionButton, ImagePreview } from '../styles/AlbumStyles';
import styled from 'styled-components';

const ResponsiveTable = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin-bottom: 1rem;
  width: 100%;
  
  @media (max-width: 768px) {
    border-radius: 8px;
    background: #282828;
  }
`;

const MobileInfo = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: #b3b3b3;
  }
`;

const DesktopCell = styled(Td)`
  @media (max-width: 768px) {
    display: none;
  }
`;

const MainCell = styled(Td)`
  @media (max-width: 768px) {
    &.title-cell {
      max-width: 200px;
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  
  @media (max-width: 768px) {
    flex-direction: row;
  }
`;

export const EditIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const DeleteIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function AlbumTable({ albums, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'Non définie';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Non définie';
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Non définie';
    }
  };

  const formatGenres = (genres) => {
    if (!genres || !Array.isArray(genres) || genres.length === 0) return 'Aucun genre';
    return genres.join(', ');
  };

  return (
    <ResponsiveTable>
      <Table>
        <thead>
          <tr>
            <Th style={{ width: '50px' }}></Th>
            <Th>Titre</Th>
            <MainCell as="th">Artiste</MainCell>
            <DesktopCell as="th">Genre</DesktopCell>
            <DesktopCell as="th">Date de sortie</DesktopCell>
            <DesktopCell as="th">Type</DesktopCell>
            <MainCell as="th" style={{ width: '100px' }}>Actions</MainCell>
          </tr>
        </thead>
        <tbody>
          {albums.map((album) => (
            <Tr key={album.id}>
              <Td>
                <ImagePreview>
                  {album.coverImage?.thumbnail && (
                    <img
                      src={album.coverImage.thumbnail}
                      alt={album.title}
                      width={40}
                      height={40}
                    />
                  )}
                </ImagePreview>
              </Td>
              <MainCell className="title-cell">
                <div>
                  {album.title}
                  <MobileInfo>
                    {album.artist} • {album.type} • {formatGenres(album.genres)}
                  </MobileInfo>
                </div>
              </MainCell>
              <MainCell>{album.artist}</MainCell>
              <DesktopCell>{formatGenres(album.genres)}</DesktopCell>
              <DesktopCell>{formatDate(album.releaseDate)}</DesktopCell>
              <DesktopCell>{album.type}</DesktopCell>
              <MainCell>
                <ActionButtons>
                  <ActionButton onClick={() => onEdit(album)} title="Modifier">
                    <EditIcon />
                  </ActionButton>
                  <ActionButton onClick={() => onDelete(album.id)} title="Supprimer">
                    <DeleteIcon />
                  </ActionButton>
                </ActionButtons>
              </MainCell>
            </Tr>
          ))}
        </tbody>
      </Table>
    </ResponsiveTable>
  );
} 