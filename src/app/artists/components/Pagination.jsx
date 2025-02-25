import styled from 'styled-components';

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
  color: #b3b3b3;
`;

const PaginationButton = styled.button`
  background: none;
  border: none;
  color: #b3b3b3;
  cursor: pointer;
  padding: 0.5rem;
  
  &:hover:not(:disabled) {
    color: white;
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export default function Pagination({ page, totalPages, onPageChange }) {
  return (
    <PaginationContainer>
      <span>Page {page} sur {totalPages}</span>
      <PaginationButton 
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
      >
        Précédent
      </PaginationButton>
      <PaginationButton 
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
      >
        Suivant
      </PaginationButton>
    </PaginationContainer>
  );
} 