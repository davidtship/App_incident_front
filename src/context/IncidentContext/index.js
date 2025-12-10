import React, { createContext, useState, useEffect } from 'react';

export const IncidentContext = createContext({});

export const IncidentProvider = ({ children }) => {
  const [incidents, setIncidents] = useState([]);
  const [totalCount, setTotalCount] = useState(0); // total depuis l'API paginée
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const apiUrl = import.meta.env.VITE_API_BASE_URL;
  
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await fetch(`
          ${apiUrl}/api/incidents/`
        );
        if (!response.ok) throw new Error('Erreur lors du fetch des incidents');

        const data = await response.json();

        // 👉 IMPORTANT : stocker seulement les résultats paginés
        setIncidents(data.results || []);
        setTotalCount(data.count || 0);

      } catch (error) {
        console.error("Erreur fetch incidents:", error.message);
        setIncidents([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, []);

  const handleSearch = (text) => setSearch(text);

  // Filtrage des résultats
  const filteredIncidents = incidents.filter((incident) =>
    incident.student?.toLowerCase().includes(search.toLowerCase()) ||
    incident.narration?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <IncidentContext.Provider
      value={{
        incidents: filteredIncidents,
        totalCount,
        loading,
        search,
        handleSearch,
      }}
    >
      {children}
    </IncidentContext.Provider>
  );
};
