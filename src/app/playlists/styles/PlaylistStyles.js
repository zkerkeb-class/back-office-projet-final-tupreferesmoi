import styled from 'styled-components';

export const Container = styled.div`
  padding: 2rem;
  
  .pagination-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 2rem;
    gap: 1rem;
  }

  .pagination-info {
    color: #666;
  }

  .pagination-buttons {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .pagination-button {
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    background: white;
    cursor: pointer;
    border-radius: 4px;

    &:hover:not(:disabled) {
      background: #f5f5f5;
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  }

  .current-page {
    background: #1db954;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 4px;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: white;
`;

export const Button = styled.button`
  background-color: #1db954;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background-color: #1ed760;
  }
`;

export const ErrorMessage = styled.div`
  color: #ff0033;
  background-color: #ffe6e6;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;
  background: #212121;
  border-radius: 8px;
  overflow: hidden;
`;

export const Th = styled.th`
  text-align: left;
  padding: 1rem;
  background: #282828;
  color: #fff;
  font-weight: 600;
  border-bottom: 1px solid #333;
`;

export const Td = styled.td`
  padding: 1rem;
  color: #fff;
  border-bottom: 1px solid #333;
`;

export const Tr = styled.tr`
  &:hover {
    background: #282828;
  }
`;

export const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  margin: 0 0.25rem;
  border-radius: 4px;
  color: #fff;
  transition: all 0.2s ease;

  &:hover {
    background: #333;
  }

  svg {
    width: 20px;
    height: 20px;
    stroke: currentColor;
  }
`; 