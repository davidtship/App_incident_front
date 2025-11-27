import React from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import IncidentTableList from 'src/components/apps/incidents/IncidentTableList';
import { IncidentProvider } from 'src/context/IncidentContext';
import BlankCard from 'src/components/shared/BlankCard';

const BCrumb = [
  { to: '/', title: 'Incident' },
  { title: 'Liste des incidents' },
];

const IncidentList = () => (
  <IncidentProvider>
    <PageContainer title="Liste des incidents" description="Page des incidents">
      <Breadcrumb title="Incidents" items={BCrumb} />
      <BlankCard>
        <IncidentTableList />
      </BlankCard>
    </PageContainer>
  </IncidentProvider>
);

export default IncidentList;
