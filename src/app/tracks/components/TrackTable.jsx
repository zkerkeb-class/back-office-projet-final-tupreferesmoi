import { Table, Th, Td, Tr, ActionButton, AudioPreview } from '../styles/TrackStyles';

const EditIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const DeleteIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
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