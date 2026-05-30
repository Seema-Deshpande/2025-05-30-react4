import { Pagination as BootstrapPagination } from "react-bootstrap";

export default function PaginationComponent({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  return (
    <nav aria-label="Pagination navigation">
      <BootstrapPagination className="justify-content-center mt-4" role="list">
        <BootstrapPagination.First onClick={() => onPageChange(1)} disabled={currentPage === 1} aria-label="Go to first page" />
        <BootstrapPagination.Prev onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} aria-label="Go to previous page" />
        
        {startPage > 1 && (
          <>
            <BootstrapPagination.Item onClick={() => onPageChange(1)} role="listitem">1</BootstrapPagination.Item>
            {startPage > 2 && <BootstrapPagination.Ellipsis disabled aria-label="More pages" />}
          </>
        )}

        {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
          <BootstrapPagination.Item
            key={page}
            active={page === currentPage}
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? "page" : undefined}
            aria-label={`Go to page ${page}`}
            role="listitem"
          >
            {page}
          </BootstrapPagination.Item>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <BootstrapPagination.Ellipsis disabled aria-label="More pages" />}
            <BootstrapPagination.Item onClick={() => onPageChange(totalPages)} role="listitem">{totalPages}</BootstrapPagination.Item>
          </>
        )}

        <BootstrapPagination.Next onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} aria-label="Go to next page" />
        <BootstrapPagination.Last onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} aria-label="Go to last page" />
      </BootstrapPagination>
    </nav>
  );
}
