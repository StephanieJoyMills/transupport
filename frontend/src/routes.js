import React from 'react';

const Dashboard = React.lazy(() => import('./views/Dashboard'));
const Users = React.lazy(() => import('./views/Users/Users'));
const User = React.lazy(() => import('./views/Users/User'));
const Accounts = React.lazy(() => import('./views/Accounts/Accounts'));
const AccountView = React.lazy(() => import('./views/Accounts/AccountView'));
const EmailView = React.lazy(() => import('./views/Emails/EmailView'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/accounts/', exact: true, name: 'Accounts', component: Accounts },
  { path: '/accounts/view/:id', exact: true, name: 'Account Details', component: AccountView },
  { path: '/accounts/email', exact: true, name: 'Send Email', component: EmailView },
  { path: '/accounts/:status', exact: true, name: 'Accounts', component: Accounts },
];

export default routes;
