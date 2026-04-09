import React from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import RegionTableList from 'src/components/apps/ecoles/RegionTableList';
import { RegionProvider } from 'src/context/RegionContext';
import BlankCard from 'src/components/shared/BlankCard';

const BCrumb = [
  { to: '/', title: 'Regions' },
  { title: 'Liste des regions' },
];

const IncidentList = () => (
  <RegionProvider>
    <PageContainer title="Liste des regions" description="Page des incidents">
      <Breadcrumb title="Regions" items={BCrumb} />
      <BlankCard>
        <RegionTableList />
      </BlankCard>
    </PageContainer>
  </RegionProvider>
);

export default IncidentList;
