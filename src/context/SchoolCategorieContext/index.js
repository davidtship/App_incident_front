import React, { createContext, useState, useEffect } from 'react';

export const SchoolCategoryContext = createContext({});

export const SchoolCategoryProvider = ({ children }) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const [categories, setCategories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  /* ================= FETCH CATEGORIES ================= */

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${apiUrl}/api/school-categories/`
      );

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des catégories');
      }

      const data = await response.json();

      setCategories(data.results ?? data);
      setTotalCount(data.count ?? (data.results?.length ?? data.length));
    } catch (error) {
      console.error('Erreur fetch catégories:', error);
      setCategories([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  /* ================= INIT ================= */

  useEffect(() => {
    fetchCategories();
  }, []);

  /* ================= SEARCH ================= */

  const handleSearch = (text) => {
    setSearch(text);
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name?.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= CONTEXT VALUE ================= */

  return (
    <SchoolCategoryContext.Provider
      value={{
        categories: filteredCategories,
        totalCount,
        loading,
        search,
        handleSearch,
        fetchCategories, // utile après ajout/suppression
      }}
    >
      {children}
    </SchoolCategoryContext.Provider>
  );
};
