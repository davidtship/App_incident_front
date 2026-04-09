import React, { lazy } from 'react';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import RequireAuth from '../components/auth/RequireAuth';
import Loadable from '../layouts/full/shared/loadable/Loadable';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

/* ****Pages***** */
const ModernDash = Loadable(lazy(() => import('../views/dashboard/Modern')));
const IncidentAdd = Loadable(lazy(() => import('../views/apps/Incident/Add')));
const IncidentList = Loadable(lazy(() => import('../views/apps/Incident/List')));

const EcoleAdd = Loadable(lazy(() => import('../views/apps/Ecoles/Add')));
const EcoleList = Loadable(lazy(() => import('../views/apps/Ecoles/List')));
const RegionList = Loadable(lazy(() => import('../views/apps/Region/List')));

const CategorieAdd = Loadable(lazy(() => import('../views/apps/Categorie/Add')));
const CategorieList = Loadable(lazy(() => import('../views/apps/Categorie/List')));

const IncidentParDate = Loadable(lazy(() => import('../views/apps/calendar/BigCalendar')));

const UserList = Loadable(lazy(() => import('../views/apps/Users/List')));
const Pricing = Loadable(lazy(() => import('../views/pages/pricing/Pricing')));
const AccountSetting = Loadable(lazy(() => import('../views/pages/account-setting/AccountSetting')));

/* ***Authentication Pages*** */
const Login = Loadable(lazy(() => import('../views/authentication/auth1/Login')));
const Register = Loadable(lazy(() => import('../views/authentication/auth1/Register')));
const ForgotPassword = Loadable(lazy(() => import('../views/authentication/auth1/ForgotPassword')));

const Error = Loadable(lazy(() => import('../views/authentication/Error')));

/* ------------------- ROUTER ------------------- */
const routes = [
  {
    path: '/',
    element: (
      <RequireAuth>
        <FullLayout />
      </RequireAuth>
    ),
    children: [
      { path: '/', element: <ModernDash />},
      { path: '/dashboards', element: <ModernDash /> },

      // Incidents
      { path: '/apps/Incident/list', element: <IncidentList /> },
      { path: '/apps/Incident/add', element: <IncidentAdd /> },
      { path: '/apps/Incident/par-date', element: <IncidentParDate /> },
      { path: '/apps/ecommerce/shop', element: <Ecommerce /> },

      // Écoles
      { path: '/apps/Ecoles/list', element: <EcoleList /> },
      { path: '/apps/Ecoles/add', element: <EcoleAdd /> },
      { path: '/apps/Ecoles/region', element: <RegionList /> },
      // Catégories
      { path: '/apps/Categorie-Ecoles/list', element: <CategorieList /> },
      { path: '/apps/Categorie-Ecoles/add', element: <CategorieAdd /> },

      // Utilisateurs
      { path: '/apps/Users/list', element: <UserList /> },


      // Pages
      { path: '/pages/pricing', element: <Pricing /> },
      { path: '/pages/account-settings', element: <AccountSetting /> },

      // Catch All
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/',
    element: <BlankLayout />,
    children: [
      { path: '/auth/404', element: <Error /> },
      { path: '/auth/login', element: <Login /> },
      { path: '/auth/register', element: <Register /> },
      { path: '/auth/forgot-password', element: <ForgotPassword /> },

      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
