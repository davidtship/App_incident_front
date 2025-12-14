import React from 'react';
import Breadcrumb from 'src/layouts/full/shared/breadcrumb/Breadcrumb';
import PageContainer from 'src/components/container/PageContainer';
import SchoolCategorieTableList from 'src/components/apps/schoolcategories/SchoolCategoriesTableList';
import { SchoolCategoryProvider } from 'src/context/SchoolCategorieContext';
import BlankCard from 'src/components/shared/BlankCard';

const BCrumb = [
  { to: '/', title: 'Catégories scolaires' },
  { title: 'Liste des catégories' },
];

const SchoolCategorieList = () => (
  <SchoolCategoryProvider>
    <PageContainer
      title="Liste des catégories scolaires"
      description="Page de gestion des catégories scolaires"
    >
      <Breadcrumb title="Catégories scolaires" items={BCrumb} />

      <BlankCard>
        <SchoolCategorieTableList />
      </BlankCard>
    </PageContainer>
  </SchoolCategoryProvider>
);

export default SchoolCategorieList;
