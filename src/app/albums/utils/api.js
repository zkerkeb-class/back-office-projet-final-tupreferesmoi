export const extractBaseUrl = (signedUrl) => {
  if (!signedUrl) return null;
  try {
    const url = new URL(signedUrl);
    const baseUrl = url.origin + url.pathname;
    return decodeURIComponent(decodeURIComponent(baseUrl));
  } catch (e) {
    return signedUrl;
  }
};

export const getAuthToken = () => {
  const cookie = document.cookie.split(';').find(c => c.trim().startsWith('token='));
  if (!cookie) return null;
  return cookie.split('=')[1];
};

export const fetchWithAuth = async (url, options = {}) => {
  const token = getAuthToken();
  if (!token) throw new Error('Non authentifié');

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Une erreur est survenue');
  return data;
};

export const uploadAlbumCover = async (file, albumTitle) => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('prefix', `album-${albumTitle}`);

  const response = await fetchWithAuth('/api/upload/image', {
    method: 'POST',
    body: formData,
    headers: {
      ...Object.fromEntries(
        Object.entries(fetchWithAuth.headers || {}).filter(([key]) => key.toLowerCase() !== 'content-type')
      )
    }
  });

  return response.urls;
};

export const formatAlbumData = (album) => ({
  id: album.id || album._id,
  title: album.title,
  genres: Array.isArray(album.genres) ? album.genres : [album.genres],
  releaseDate: album.releaseDate,
  type: album.type,
  trackCount: album.trackCount || 0,
  coverImage: album.coverImage || null
}); 