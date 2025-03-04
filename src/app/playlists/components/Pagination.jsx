import styled from 'styled-components';

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 2rem;
`;

const PageButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background-color: ${props => props.active ? '#1db954' : 'white'};
  color: ${props => props.active ? 'white' : 'black'};
  cursor: pointer;
  border-radius: 0.25rem;

  &:hover {
    background-color: ${props => props.active ? '#1ed760' : '#f5f5f5'};
  }

  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
    color: #999;
  }
`;

export default function Pagination({ page, totalPages, onPageChange }) {
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  return (
    <PaginationContainer>
      <PageButton
        onClick={() => handlePageChange(page - 1)}
        disabled={page <= 1}
      >
        Précédent
      </PageButton>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
        <PageButton
          key={pageNum}
          active={pageNum === page}
          onClick={() => handlePageChange(pageNum)}
        >
          {pageNum}
        </PageButton>
      ))}

      <PageButton
        onClick={() => handlePageChange(page + 1)}
        disabled={page >= totalPages}
      >
        Suivant
      </PageButton>
    </PaginationContainer>
  );
} 