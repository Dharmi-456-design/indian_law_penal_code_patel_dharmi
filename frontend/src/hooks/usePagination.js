import { useState, useCallback } from 'react';

export default function usePagination(initialPage = 1, initialLimit = 20) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const handlePageChange = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const handleLimitChange = useCallback((event) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(1);
  }, []);

  return {
    page,
    limit,
    setPage,
    setLimit,
    handlePageChange,
    handleLimitChange,
  };
}
