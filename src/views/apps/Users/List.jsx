import React from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import UsersTableList from 'src/components/apps/users/UsersTableList';
import { UserProvider } from 'src/context/UsersContext';
import BlankCard from 'src/components/shared/BlankCard';

const BCrumb = [
  { to: '/', title: 'Utilisateurs' },
  { title: 'Liste des utilisateurs' },
];

const UsersList = () => (
  <UserProvider>
    <PageContainer title="Liste des utilisateurs" description="Page des utilisateurs">
      <Breadcrumb title="Utilisateurs" items={BCrumb} />
      <BlankCard>
        <UsersTableList />
      </BlankCard>
    </PageContainer>
  </UserProvider>
);

export default UsersList;
