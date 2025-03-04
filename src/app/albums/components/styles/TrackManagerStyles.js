import styled from 'styled-components';

export const TrackManagerStyles = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    height: 100%;
    overflow: hidden;
  `,

  TrackList: styled.div`
    flex: 1;
    overflow-y: auto;
    background: #2A2A2A;
    border-radius: 4px;
    padding: 0.5rem;

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
  `,

  TrackListHeader: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  `,

  TrackCount: styled.span`
    color: #b3b3b3;
    font-size: 0.875rem;
  `,

  Track: styled.div`
    display: flex;
    align-items: center;
    padding: 0.75rem;
    background: ${props => props.selected ? '#404040' : '#2A2A2A'};
    border-radius: 4px;
    margin-bottom: 0.5rem;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background: #404040;
    }
  `,

  TrackInfo: styled.div`
    flex: 1;
    margin-right: 1rem;
  `,

  TrackTitle: styled.div`
    color: white;
    font-size: 0.875rem;
    margin-bottom: 0.25rem;
  `,

  TrackMeta: styled.div`
    color: #b3b3b3;
    font-size: 0.75rem;
  `,

  AudioPreview: styled.audio`
    width: 200px;
    height: 32px;

    &::-webkit-media-controls-panel {
      background: #404040;
    }

    &::-webkit-media-controls-current-time-display,
    &::-webkit-media-controls-time-remaining-display {
      color: white;
    }
  `,

  ActionButton: styled.button`
    background: ${props => props['data-isdelete'] ? 'none' : '#1DB954'};
    border: none;
    color: ${props => props['data-isdelete'] ? '#ff4444' : 'white'};
    cursor: pointer;
    padding: ${props => props['data-isdelete'] ? '0.25rem' : '0.5rem 1rem'};
    border-radius: 4px;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-left: 1rem;
    transition: all 0.2s;

    &:hover {
      background: ${props => props['data-isdelete'] ? 'none' : '#1ed760'};
      opacity: ${props => props['data-isdelete'] ? '1' : '0.9'};
    }

    svg {
      width: 16px;
      height: 16px;
    }
  `,

  Section: styled.div`
    margin-bottom: 1rem;

    h3 {
      color: white;
      font-size: 1rem;
      margin-bottom: 0.5rem;
    }
  `
}; 