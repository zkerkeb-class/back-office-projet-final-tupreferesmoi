import styled from 'styled-components';

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
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
  background: #1DB954;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 500px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: #1ed760;
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
    font-size: 0.875rem;
    
    thead th {
      padding: 0.75rem;
    }
    
    td {
      padding: 0.75rem;
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
  white-space: nowrap;
`;

export const Td = styled.td`
  padding: 1rem;
  color: white;
  border-bottom: 1px solid #404040;
  font-size: 0.875rem;
  vertical-align: middle;

  @media (max-width: 768px) {
    &:not(:first-child):not(:last-child) {
      padding: 0.5rem 0.75rem;
    }
  }

  .album-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .album-title {
    font-weight: 500;
  }

  .album-details {
    color: #b3b3b3;
    font-size: 0.75rem;
  }

  .action-buttons {
    display: flex;
    gap: 0.5rem;
  }
`;

export const Tr = styled.tr`
  &:hover {
    background: #323232;
  }
`;

export const ActionButton = styled.button`
  background: none;
  border: none;
  padding: 0.5rem;
  color: #b3b3b3;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;

  &:hover {
    color: white;
    background: #404040;
  }

  @media (max-width: 768px) {
    padding: 0.4rem;
  }

  svg {
    width: 20px;
    height: 20px;
    
    @media (max-width: 768px) {
      width: 18px;
      height: 18px;
    }
  }
`;

export const ErrorMessage = styled.div`
  color: #ff4444;
  padding: 1rem;
  background: rgba(255, 68, 68, 0.1);
  border-radius: 4px;
  margin-bottom: 1rem;
`;

export const ImagePreview = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  background: #3E3E3E;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`; 