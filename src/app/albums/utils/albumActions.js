import * as api from './api';

export const createAlbum = async (albumData) => {
  try {
    if (!albumData.title || !albumData.releaseDate || !albumData.type || !albumData.artistId) {
      throw new Error('Tous les champs requis doivent être remplis');
    }

    const formattedData = {
      title: albumData.title.trim(),
      genres: Array.isArray(albumData.genres) ? albumData.genres : albumData.genres.split(',').map(g => g.trim()).filter(Boolean),
      releaseDate: new Date(albumData.releaseDate).toISOString(),
      type: albumData.type,
      artistId: albumData.artistId,
      coverImage: null
    };

    const response = await api.fetchWithAuth('/api/albums', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formattedData)
    });

    if (!response.success) {
      throw new Error(response.message || 'Erreur lors de la création de l\'album');
    }

    if (albumData.trackIds?.length > 0) {
      await api.fetchWithAuth(`/api/albums/${response.data._id}/tracks`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackIds: albumData.trackIds })
      });
    }

    return response;
  } catch (error) {
    console.error('Erreur lors de la création de l\'album:', error);
    throw error;
  }
};

export const updateAlbum = async (albumId, albumData) => {
  try {
    if (!albumData.title || !albumData.releaseDate || !albumData.type || !albumData.artistId) {
      throw new Error('Tous les champs requis doivent être remplis');
    }

    const formattedData = {
      title: albumData.title.trim(),
      genres: Array.isArray(albumData.genres) ? albumData.genres : albumData.genres.split(',').map(g => g.trim()).filter(Boolean),
      releaseDate: new Date(albumData.releaseDate).toISOString(),
      type: albumData.type,
      artistId: albumData.artistId,
      coverImage: null
    };

    const response = await api.fetchWithAuth(`/api/albums/${albumId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formattedData)
    });

    if (!response.success) {
      throw new Error(response.message || 'Erreur lors de la mise à jour de l\'album');
    }

    if (albumData.trackIds) {
      await api.fetchWithAuth(`/api/albums/${albumId}/tracks`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackIds: albumData.trackIds })
      });
    }

    return response;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'album:', error);
    throw error;
  }
}; 