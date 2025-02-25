import styled from 'styled-components';

export const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

export const Title = styled.h1`
  font-size: 2rem;
  color: white;
  margin: 0;
`;

export const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${({ $primary }) => $primary ? '#1DB954' : 'transparent'};
  border: ${({ $primary }) => $primary ? 'none' : '1px solid #404040'};
  border-radius: 500px;
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ $primary }) => $primary ? '#1ed760' : 'rgba(255, 255, 255, 0.1)'};
    transform: scale(1.02);
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #282828;
  border-radius: 8px;
  overflow: hidden;

  @media (max-width: 768px) {
    .hide-mobile {
      display: none;
    }
  }

  @media (min-width: 769px) {
    .show-mobile {
      display: none;
    }
  }
`;

export const Th = styled.th`
  text-align: left;
  padding: 1rem;
  color: #b3b3b3;
  font-weight: 500;
  font-size: 0.875rem;
  border-bottom: 1px solid #404040;
`;

export const Td = styled.td`
  padding: 1rem;
  color: white;
  font-size: 0.875rem;
  border-bottom: 1px solid #404040;

  .track-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .track-title {
    font-weight: 500;
  }

  .track-details {
    color: #b3b3b3;
    font-size: 0.75rem;
  }

  .action-buttons {
    display: flex;
    gap: 0.5rem;
  }

  .duration {
    font-family: monospace;
  }
`;

export const Tr = styled.tr`
  &:hover {
    background: #333333;
  }
`;

export const ActionButton = styled.button`
  padding: 0.5rem;
  background: transparent;
  border: none;
  color: #b3b3b3;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-right: 0.5rem;

  &:hover {
    color: white;
    transform: scale(1.1);
  }
`;

export const ErrorMessage = styled.div`
  color: #ff4444;
  padding: 1rem;
  background: rgba(255, 68, 68, 0.1);
  border-radius: 4px;
  margin-bottom: 1rem;
`;

export const AudioPreview = styled.div`
  width: 200px;
  
  audio {
    width: 100%;
    height: 32px;
  }
`; 