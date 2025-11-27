import React, { createContext, useState, useEffect } from 'react';

export const IncidentContext = createContext({});

export const IncidentProvider = ({ children }) => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await fetch('https://safeschooldata-6d63cd50a8a3.herokuapp.com/api/incidents/');
        if (!response.ok) throw new Error('Erreur lors du fetch des incidents');

        const data = await response.json();
        setIncidents(data);
      } catch (error) {
        console.error("Erreur fetch incidents:", error.message);
        setIncidents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, []);

  const handleSearch = (text) => setSearch(text);

  // Filtrage par nom d'étudiant ou narration
  const filteredIncidents = incidents.filter(
    (incident) =>
      incident.student?.toLowerCase().includes(search.toLowerCase()) ||
      incident.narration?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <IncidentContext.Provider
      value={{
        incidents: filteredIncidents,
        loading,
        search,
        handleSearch,
      }}
    >
      {children}
    </IncidentContext.Provider>
  );
};
