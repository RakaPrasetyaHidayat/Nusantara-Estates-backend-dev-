import { useState, useEffect, useCallback } from 'react';
import apiService from '../services/api';

// Custom hook untuk mengelola data properties
export const useProperties = (initialFilters = {}) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  // Fetch properties dengan filter
  const fetchProperties = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getProperties({
        ...initialFilters,
        ...filters
      });
      
      if (response.success) {
        setProperties(response.data);
        setPagination(response.pagination);
      } else {
        throw new Error(response.message || 'Failed to fetch properties');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching properties:', err);
    } finally {
      setLoading(false);
    }
  }, [initialFilters]);

  // Load properties saat component mount
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Refresh data
  const refresh = useCallback(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Search dengan filter baru
  const searchProperties = useCallback((filters) => {
    fetchProperties({ ...filters, page: 1 });
  }, [fetchProperties]);

  // Load page tertentu
  const loadPage = useCallback((page) => {
    fetchProperties({ page });
  }, [fetchProperties]);

  return {
    properties,
    loading,
    error,
    pagination,
    refresh,
    searchProperties,
    loadPage
  };
};