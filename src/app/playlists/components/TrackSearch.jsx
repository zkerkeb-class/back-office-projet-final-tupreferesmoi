import { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import styled from 'styled-components';

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 1rem;
  overflow: hidden;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  background: #3E3E3E;
  border: 1px solid #404040;
  border-radius: 500px;
  color: white;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #1DB954;
  }

  &::placeholder {
    color: #909090;
  }
`;

const TrackList = styled.div`
  flex: 1;
  overflow-y: auto;
  background: #181818;
  border-radius: 8px;
  padding: 0.5rem;
  min-height: 200px;
`;

const TrackItem = styled.div`
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: 4px;
  background: ${props => props.$isSelected ? '#333' : 'transparent'};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #333;
  }

  &:not(:last-child) {
    margin-bottom: 0.25rem;
  }
`;

const TrackInfo = styled.div`
  flex: 1;
  margin-left: 0.5rem;
  color: white;
`;

const TrackTitle = styled.div`
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: ${props => props.$isSelected ? '#1DB954' : 'white'};
`;

const TrackArtist = styled.div`
  font-size: 0.875rem;
  color: #b3b3b3;
`;

const Section = styled.div`
  margin-bottom: 1rem;

  h3 {
    color: white;
    margin-bottom: 0.75rem;
    font-size: 0.875rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    span {
      color: #b3b3b3;
      font-weight: normal;
    }
  }
`;

const LoadingText = styled.div`
  color: #b3b3b3;
  text-align: center;
  padding: 1rem;
`;

const NoResults = styled.div`
  color: #b3b3b3;
  text-align: center;
  padding: 1rem;
`;

export default function TrackSearch({ playlistId, initialTracks = [], onTracksChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedTracks, setSelectedTracks] = useState(initialTracks);
  const [isLoading, setIsLoading] = useState(false);
  const [artists, setArtists] = useState({});

  const fetchArtist = async (artistId) => {
    if (!artistId || typeof artistId !== 'string') {
      console.log('Invalid artistId:', artistId);
      return null;
    }

    try {
      const response = await fetch(`/api/artists/${artistId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      if (!response.ok) return null;
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'artiste:', error);
      return null;
    }
  };

  const loadArtists = async (tracks) => {
    const artistIds = [...new Set(tracks.map(track => 
      typeof track.artistId === 'object' ? track.artistId._id : track.artistId
    ))].filter(id => !artists[id] && id);

    if (artistIds.length === 0) return;

    const newArtists = { ...artists };
    for (const artistId of artistIds) {
      const artist = await fetchArtist(artistId);
      if (artist) {
        newArtists[artistId] = artist;
      }
    }
    
    setArtists(prev => ({ ...prev, ...newArtists }));
  };

  useEffect(() => {
    const searchTracks = async () => {
      if (debouncedSearchTerm.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedSearchTerm)}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        });
        if (!response.ok) throw new Error('Erreur lors de la recherche');
        const data = await response.json();
        console.log('Search results:', data.data?.tracks);
        setSearchResults(data.data?.tracks || []);
      } catch (error) {
        console.error('Erreur de recherche:', error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    searchTracks();
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (initialTracks && initialTracks.length > 0) {
      setSelectedTracks(initialTracks);
      loadArtists(initialTracks);
    }
  }, [initialTracks]);

  const handleTrackToggle = (track) => {
    setSelectedTracks(prev => {
      const isSelected = prev.some(t => t._id === track._id);
      const newTracks = isSelected
        ? prev.filter(t => t._id !== track._id)
        : [...prev, track];
      onTracksChange(newTracks.map(t => t._id));
      return newTracks;
    });
  };

  const isTrackSelected = (trackId) => {
    return selectedTracks.some(track => track._id === trackId);
  };

  const getArtistName = (artistId) => {
    if (typeof artistId === 'object') {
      return artistId.name;
    }
    return artists[artistId]?.name || 'Artiste inconnu';
  };

  useEffect(() => {
    if (searchResults.length > 0) {
      const newTracks = searchResults.filter(track => 
        track.artistId && !artists[typeof track.artistId === 'object' ? track.artistId._id : track.artistId]
      );
      if (newTracks.length > 0) {
        loadArtists(newTracks);
      }
    }
  }, [searchResults, artists]);

  return (
    <SearchContainer>
      <SearchInput
        type="text"
        placeholder="Rechercher des titres..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <TrackList>
        <Section>
          <h3>Titres dans la playlist <span>({selectedTracks.length})</span></h3>
          {selectedTracks.map(track => (
            <TrackItem
              key={track._id}
              $isSelected={true}
              onClick={() => handleTrackToggle(track)}
            >
              <TrackInfo>
                <TrackTitle $isSelected={true}>{track.title}</TrackTitle>
                <TrackArtist>{getArtistName(track.artistId)}</TrackArtist>
              </TrackInfo>
            </TrackItem>
          ))}
        </Section>

        {searchTerm.length >= 2 && (
          <Section>
            <h3>Résultats de la recherche</h3>
            {isLoading ? (
              <LoadingText>Recherche en cours...</LoadingText>
            ) : searchResults.length > 0 ? (
              searchResults.map(track => (
                <TrackItem
                  key={track._id}
                  $isSelected={isTrackSelected(track._id)}
                  onClick={() => handleTrackToggle(track)}
                >
                  <TrackInfo>
                    <TrackTitle $isSelected={isTrackSelected(track._id)}>{track.title}</TrackTitle>
                    <TrackArtist>{getArtistName(track.artistId)}</TrackArtist>
                  </TrackInfo>
                </TrackItem>
              ))
            ) : (
              <NoResults>Aucun résultat trouvé</NoResults>
            )}
          </Section>
        )}
      </TrackList>
    </SearchContainer>
  );
} 