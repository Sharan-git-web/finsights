import { useState } from 'react';
import api from '../services/api';

export function useStockInsights() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStock = async (ticker) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/stocks/${ticker}`);
      setData(res.data);
    } catch (e) {
      setError(e.response?.data?.detail || 'Unable to fetch data');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchStock };
}
