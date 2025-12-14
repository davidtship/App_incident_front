import { Alert } from '@mui/material';
import React, { createContext, useState, useEffect } from 'react';

export const EcoleContext = createContext({});

export const EcoleProvider = ({ children }) => {
  const [ecoles, setEcoles] = useState([]);
  const [regions, setRegions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  // ---- FETCH ÉCOLES ----------------------------
  const fetchEcoles = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/api/schools/`
      );
      if (!response.ok) throw new Error('Erreur fetch écoles');

      const data = await response.json();
      setEcoles(data.results ?? data);
      setTotalCount(data.count ?? (data.results?.length ?? data.length));
    } catch (error) {
      console.error("Erreur fetch écoles:", error);
      setEcoles([]);
      setTotalCount(0);
    }
  };

  // ---- FETCH RÉGIONS ----------------------------
  const fetchRegions = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/api/region/`
      );
      if (!response.ok) throw new Error('Erreur fetch régions');

      const data = await response.json();
      setRegions(data.results ?? data);
    } catch (error) {
      console.error("Erreur fetch régions:", error);
      setRegions([]);
    }
  };

  // ---- FETCH CATEGORIES ----------------------------
  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `${apiUrl}/api/school-categories/`
      );
      if (!response.ok) throw new Error('Erreur fetch catégories');
      const data = await response.json();
      setCategories(data.results ?? data);
    } catch (error) {
      console.error("Erreur fetch catégories:", error);
      setCategories([]);
    }
  };

  // ---- CHARGEMENT EN PARALLÈLE ------------------
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchEcoles(), fetchRegions(), fetchCategories()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // ---- Helpers ------------------------
  const getRegionName = (regionId) => {
    const region = regions.find((r) => r.id === regionId);

    return region ? region.name : "Non définie";
  };

  const getCategorieName = (catId) => {
    const cat = categories.find((c) => c.id === catId);
   
    return cat ? cat.name : "Non définie";
  };

  // ---- Filtrage ------------------------
  const handleSearch = (text) => setSearch(text);

  const filteredEcoles = ecoles
    .map((ecole) => ({
      ...ecole,
      region_name: getRegionName(ecole.region),
      categorie_name: getCategorieName(ecole.categorie),
    }))
    .filter((ecole) =>
      ecole.name?.toLowerCase().includes(search.toLowerCase()) ||
      ecole.num_affect?.toLowerCase().includes(search.toLowerCase()) ||
      ecole.gerant?.toLowerCase().includes(search.toLowerCase()) ||
      ecole.region_name?.toLowerCase().includes(search.toLowerCase()) ||
      ecole.categorie_name?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <EcoleContext.Provider
      value={{
        ecoles: filteredEcoles,
        totalCount,
        loading,
        search,
        handleSearch,
        regions,
        categories,
        getRegionName,
        getCategorieName
      }}
    >
      {children}
    </EcoleContext.Provider>
  );
};
