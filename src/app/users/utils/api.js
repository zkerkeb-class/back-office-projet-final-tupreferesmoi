export const extractBaseUrl = (signedUrl) => {
    if (!signedUrl) return null;
    try {
      const url = new URL(signedUrl);
      // Supprimer tous les paramètres de requête AWS
      const baseUrl = url.origin + url.pathname;
      // Supprimer les éventuels encodages d'URL doubles
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
  
  export const fetchWithAuth = async (endpoint, options = {}) => {
    const token = getAuthToken();
    if (!token) throw new Error('Non authentifié');
  
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    const fullUrl = endpoint.startsWith('/api') ? `${baseUrl}${endpoint.substring(4)}` : `${baseUrl}${endpoint}`;
  
  
    const response = await fetch(fullUrl, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${token}`,
      },
    });
  
    const data = await response.json();
    if (!response.ok) {
      console.error('Response Error:', {
        status: response.status,
        statusText: response.statusText,
        data,
        endpoint,
        fullUrl
      });
      throw new Error(data.message || 'Une erreur est survenue');
    }
    return data;
  };

  