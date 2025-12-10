import React from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import EcoleTableList from 'src/components/apps/ecoles/EcolesTableList';
import { EcoleProvider } from 'src/context/EcoleContext';
import BlankCard from 'src/components/shared/BlankCard';

const BCrumb = [
  { to: '/', title: 'Ecoles' },
  { title: 'Liste des ecoles' },
];

const IncidentList = () => (
  <EcoleProvider>
    <PageContainer title="Liste des ecoles" description="Page des incidents">
      <Breadcrumb title="Ecoles" items={BCrumb} />
      <BlankCard>
        <EcoleTableList />
      </BlankCard>
    </PageContainer>
  </EcoleProvider>
);

export default IncidentList;
