import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext({});

export const UserProvider = ({ children }) => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL;

  const [users, setUsers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  /* ================= FETCH USERS ================= */

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${apiUrl}/auths/users/`);
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des utilisateurs');
      }

      const data = await response.json();
      setUsers(data.results ?? data);
      setTotalCount(data.count ?? (data.results?.length ?? data.length));
    } catch (error) {
      console.error('Erreur fetch utilisateurs:', error);
      setUsers([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  /* ================= INIT ================= */

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= SEARCH ================= */

  const handleSearch = (text) => {
    setSearch(text);
  };

  const filteredUsers = users.filter((user) =>
    user.username?.toLowerCase().includes(search.toLowerCase()) ||
    user.email?.toLowerCase().includes(search.toLowerCase()) ||
    user.first_name?.toLowerCase().includes(search.toLowerCase()) ||
    user.last_name?.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= CONTEXT VALUE ================= */

  return (
    <UserContext.Provider
      value={{
        users: filteredUsers,
        totalCount,
        loading,
        search,
        handleSearch,
        fetchUsers, // utile après ajout/suppression
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
