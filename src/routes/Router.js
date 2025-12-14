import RequireAuth from '../components/auth/RequireAuth';
import React, { lazy } from 'react';
import { Navigate, createBrowserRouter } from 'react-router';

import Loadable from '../layouts/full/shared/loadable/Loadable';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

/* ****Pages***** */
const ModernDash = Loadable(lazy(() => import('../views/dashboard/Modern')));
const Ecommerce = Loadable(lazy(() => import('../views/apps/Incident/Ecommerce')));
const IncidentAdd = Loadable(lazy(() => import('../views/apps/Incident/Add')));
const IncidentList = Loadable(lazy(() => import('../views/apps/Incident/List')));

const EcoleAdd = Loadable(lazy(() => import('../views/apps/Ecoles/Add')));
const EcoleList = Loadable(lazy(() => import('../views/apps/Ecoles/List')));

const CategorieAdd = Loadable(lazy(() => import('../views/apps/categorie/Add')));
const CategorieList = Loadable(lazy(() => import('../views/apps/categorie/List')));

const IncidentParDate = Loadable(lazy(() => import('../views/apps/calendar/BigCalendar')));

const UserList = Loadable(lazy(() => import('../views/apps/Users/List')));
const UserProfile = Loadable(lazy(() => import('../views/apps/user-profile/UserProfile')));

const Pricing = Loadable(lazy(() => import('../views/pages/pricing/Pricing')));
const AccountSetting = Loadable(
  lazy(() => import('../views/pages/account-setting/AccountSetting')),
);


// authentication
const Login = Loadable(lazy(() => import('../views/authentication/auth1/Login')));
const Login2 = Loadable(lazy(() => import('../views/authentication/auth2/Login2')));
const Register = Loadable(lazy(() => import('../views/authentication/auth1/Register')));
const Register2 = Loadable(lazy(() => import('../views/authentication/auth2/Register2')));
const ForgotPassword = Loadable(lazy(() => import('../views/authentication/auth1/ForgotPassword')));
const ForgotPassword2 = Loadable(
  lazy(() => import('../views/authentication/auth2/ForgotPassword2')),
);
const TwoSteps = Loadable(lazy(() => import('../views/authentication/auth1/TwoSteps')));
const Error = Loadable(lazy(() => import('../views/authentication/Error')));

const Router = [
  {
    path: '/',
     element: (
      <RequireAuth>
        <FullLayout />
      </RequireAuth>
    ),
    children: [
      { path: '/', element: <Navigate to="/dashboards" /> },
      { path: '/dashboards', exact: true, element: <ModernDash /> },
      { path: '/apps/ecommerce/shop', element: <Ecommerce /> },



      { path: '/apps/Categorie-Ecoles/list', element: <CategorieList /> },
      { path: '/apps/Categorie-Ecoles/add', element: <CategorieAdd /> },


      { path: '/apps/Ecoles/list', element: <EcoleList /> },
      { path: '/apps/Ecoles/add', element: <EcoleAdd /> },

      { path: '/apps/Incident/par-date', element: <IncidentParDate /> },
      { path: '/apps/Incident/list', element: <IncidentList /> },
      { path: '/apps/Incident/add', element: <IncidentAdd /> },

      { path: '/apps/Users/list', element: <UserList /> },
      { path: '/user-profile', element: <UserProfile /> },

      { path: '/pages/pricing', element: <Pricing /> },
      { path: '/pages/account-settings', element: <AccountSetting /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/',
    element: <BlankLayout />,
    children: [
      { path: '/auth/404', element: <Error /> },
      { path: '/auth/login', element: <Login /> },
      { path: '/auth/login2', element: <Login2 /> },
      { path: '/auth/register', element: <Register /> },
      { path: '/auth/register2', element: <Register2 /> },
      { path: '/auth/forgot-password', element: <ForgotPassword /> },
      { path: '/auth/forgot-password2', element: <ForgotPassword2 /> },
      { path: '/auth/two-steps', element: <TwoSteps /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

const router = createBrowserRouter(Router);

export default router;
