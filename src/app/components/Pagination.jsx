import { Button } from '../tracks/styles/TrackStyles';

export default function Pagination({ page, totalPages, onPageChange }) {
  const isFirstPage = page === 1;
  const isLastPage = page === totalPages;

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      marginTop: '1rem',
      padding: '1rem',
      background: '#282828',
      borderRadius: '8px'
    }}>
      <span style={{ color: '#b3b3b3' }}>
        Page {page} sur {totalPages}
      </span>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {!isFirstPage && (
          <Button
            onClick={() => onPageChange(page - 1)}
          >
            Précédent
          </Button>
        )}
        {!isLastPage && (
          <Button
            onClick={() => onPageChange(page + 1)}
          >
            Suivant
          </Button>
        )}
      </div>
    </div>
  );
} 