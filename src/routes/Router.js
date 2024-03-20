import React from 'react';
import HomeApp from 'src/App/home';
import LoginApp from 'src/App/login';
import DetailsApp from 'src/App/details/details';

const Router = [
  {
    path: "/",
    children: [
      { path: '/app/login', element: <LoginApp /> },
      { path: '/app/home', element: <HomeApp /> },
      { path: '/app/details', element: <DetailsApp /> },

    ]
  }
];

export default Router;
