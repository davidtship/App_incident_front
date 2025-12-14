import React, { createContext, useEffect, useState } from 'react';

export const RegionContext = createContext({});

export const RegionProvider = ({ children }) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const [regions, setRegions] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  /* ================= FETCH REGIONS ================= */

  const fetchRegions = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${apiUrl}/api/region/`);
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des régions');
      }

      const data = await response.json();

      setRegions(data.results ?? data);
      setTotalCount(data.count ?? (data.results?.length ?? data.length));
    } catch (error) {
      console.error('Erreur fetch régions:', error);
      setRegions([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  /* ================= INIT ================= */

  useEffect(() => {
    fetchRegions();
  }, []);

  /* ================= SEARCH ================= */

  const handleSearch = (text) => {
    setSearch(text);
  };

  const filteredRegions = regions.filter((region) =>
    region.name?.toLowerCase().includes(search.toLowerCase()) ||
    region.code_region?.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= CONTEXT VALUE ================= */

  return (
    <RegionContext.Provider
      value={{
        regions: filteredRegions,
        totalCount,
        loading,
        search,
        handleSearch,
        fetchRegions, // utile après ajout/suppression/modification
      }}
    >
      {children}
    </RegionContext.Provider>
  );
};
