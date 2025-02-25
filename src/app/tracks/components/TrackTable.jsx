import { Table, Th, Td, Tr, ActionButton, AudioPreview } from '../styles/TrackStyles';

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

const formatDuration = (duration) => {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const generateTrackKey = (track, index) => {
  if (track.id) return `track-${track.id}`;
  if (track.title) return `track-title-${track.title}-${index}`;
  return `track-${index}`;
};

export default function TrackTable({ tracks, onEdit, onDelete }) {
  return (
    <div className="table-responsive">
      <Table>
        <thead>
          <tr>
            <Th>Titre</Th>
            <Th className="hide-mobile">Album</Th>
            <Th className="hide-mobile">Artiste</Th>
            <Th className="hide-mobile">Genres</Th>
            <Th>Durée</Th>
            <Th className="hide-mobile">Audio</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {tracks.map((track, index) => (
            <Tr key={generateTrackKey(track, index)}>
              <Td>
                <div className="track-info">
                  <div className="track-title">{track.title}</div>
                  <div className="track-details show-mobile">
                    {track.artist} • {track.album}
                  </div>
                  <div className="track-details show-mobile">
                    {track.genres?.join(', ') || 'Aucun genre'}
                  </div>
                </div>
              </Td>
              <Td className="hide-mobile">{track.album}</Td>
              <Td className="hide-mobile">{track.artist}</Td>
              <Td className="hide-mobile">{track.genres?.join(', ') || 'Aucun genre'}</Td>
              <Td className="duration">{formatDuration(track.duration)}</Td>
              <Td className="hide-mobile">
                {track.audioUrl && (
                  <AudioPreview>
                    <audio controls>
                      <source src={track.audioUrl} type="audio/mpeg" />
                      Votre navigateur ne supporte pas l'élément audio.
                    </audio>
                  </AudioPreview>
                )}
              </Td>
              <Td>
                <div className="action-buttons">
                  <ActionButton onClick={() => onEdit(track)} title="Modifier">
                    <EditIcon />
                  </ActionButton>
                  <ActionButton onClick={() => onDelete(track.id)} title="Supprimer">
                    <DeleteIcon />
                  </ActionButton>
                </div>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
} 