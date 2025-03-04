"use client";

import { useState, useEffect } from "react";
import { useAuth } from '../utils/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { Container, Header, Title, Button, ErrorMessage } from './styles/PlaylistStyles';
import PlaylistTable from './components/PlaylistTable';
import EditPlaylistModal from './components/EditPlaylistModal';
import Pagination from '../components/Pagination';

export default function PlaylistsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [playlists, setPlaylists] = useState([]);
    const [error, setError] = useState('');
    const [totalPages, setTotalPages] = useState(1);
    const [totalPlaylists, setTotalPlaylists] = useState(0);
    const [selectedPlaylist, setSelectedPlaylist] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const itemsPerPage = 10;

    const getAuthToken = () => {
        const cookie = document.cookie.split(';').find(c => c.trim().startsWith('token='));
        if (!cookie) return null;
        return cookie.split('=')[1];
    };

    const currentPage = parseInt(searchParams.get('page') || '1');

    const updatePageInUrl = (newPage) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', newPage.toString());
        router.push(`/playlists?${params.toString()}`);
    };

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
            return;
        }
        if (user) fetchPlaylists();
    }, [user, loading, currentPage]);

    const fetchPlaylists = async () => {
        try {
            const response = await fetch(`/api/playlists/public?page=${currentPage}&limit=${itemsPerPage}`);
            
            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des playlists');
            }

            const data = await response.json();
            
            const formattedPlaylists = data.data.map(playlist => ({
                id: playlist._id,
                name: playlist.name,
                creator: playlist.userId?.username || 'Utilisateur inconnu',
                totalTracks: playlist.totalTracks || 0,
                tracks: playlist.tracks || []
            }));
            
            setPlaylists(formattedPlaylists);
            setTotalPages(Math.ceil(data.pagination?.totalItems / itemsPerPage) || 1);
            setTotalPlaylists(data.pagination?.totalItems || 0);
            setError('');
        } catch (error) {
            console.error('Erreur dans fetchPlaylists:', error);
            setError(error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette playlist ?')) return;

        try {
            const response = await fetch(`/api/playlists/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`
                }
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la suppression de la playlist');
            }

            await fetchPlaylists();
            setError('');
        } catch (error) {
            setError(error.message || "Erreur lors de la suppression de la playlist");
        }
    };

    const handlePlaylistUpdate = async (formData) => {
        try {
            const token = getAuthToken();
            if (!token) {
                throw new Error('Non authentifié');
            }

            console.log('Updating playlist:', selectedPlaylist);
            console.log('Form data:', formData);

            // Vérification que l'ID est bien présent et formaté
            if (!selectedPlaylist || !selectedPlaylist.id) {
                throw new Error('ID de playlist invalide');
            }

            const response = await fetch(`/api/playlists/${selectedPlaylist.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    _id: selectedPlaylist.id,
                    name: formData.name,
                    tracks: formData.trackIds.map(id => ({ _id: id }))
                })
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Session expirée, veuillez vous reconnecter');
                }
                if (response.status === 404) {
                    throw new Error('Playlist non trouvée');
                }
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Erreur lors de la mise à jour de la playlist');
            }

            await fetchPlaylists();
            handleModalClose();
        } catch (error) {
            console.error('Erreur de mise à jour:', error);
            setError(error.message);
        }
    };

    const handleEdit = async (playlist) => {
        try {
            const token = getAuthToken();
            if (!token) {
                throw new Error('Non authentifié');
            }

            const response = await fetch(`/api/playlists/${playlist.id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la récupération des détails de la playlist');
            }

            const data = await response.json();
            const fullPlaylist = {
                id: data.data._id,
                name: data.data.name,
                creator: data.data.userId?.username || 'Utilisateur inconnu',
                totalTracks: data.data.totalTracks || 0,
                tracks: data.data.tracks || []
            };

            setSelectedPlaylist(fullPlaylist);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Erreur lors de la récupération des détails:', error);
            setError(error.message);
        }
    };

    const handleModalClose = () => {
        setSelectedPlaylist(null);
        setIsModalOpen(false);
    };

    if (loading) return <Container>Chargement...</Container>;
    if (!user) return null;

    return (
        <Container>
            <Header>
                <Title>Playlists ({totalPlaylists})</Title>
            </Header>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <PlaylistTable 
                playlists={playlists}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <Pagination 
                page={currentPage}
                totalPages={totalPages}
                onPageChange={updatePageInUrl}
            />

            <EditPlaylistModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onSubmit={handlePlaylistUpdate}
                playlist={selectedPlaylist}
            />
        </Container>
    );
} 