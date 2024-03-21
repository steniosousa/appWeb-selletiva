import React from 'react';
import InitialPage from 'src/App/InitialPage';
import LoginApp from 'src/App/login';
import DetailsApp from 'src/App/details/details';
import DiscardDetails from 'src/App/Discard/details';

const Router = [
  {
    path: "/",
    children: [
      { path: '/app/login', element: <LoginApp /> },
      { path: '/app/home', element: <InitialPage /> },
      { path: '/app/details', element: <DetailsApp /> },
      { path: '/app/discardDetails', element: <DiscardDetails /> }

    ]
  }
];

export default Router;
