export const fetchWithAuth = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Non authentifié');
    }
    throw new Error('Une erreur est survenue');
  }

  const data = await response.json();
  return data;
};

export const formatPlaylistData = (playlist) => ({
  id: playlist._id,
  name: playlist.name,
  creator: playlist.userId?.username || 'Utilisateur inconnu',
  totalTracks: playlist.totalTracks || 0,
}); 