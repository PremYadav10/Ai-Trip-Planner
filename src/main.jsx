import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter } from 'react-router-dom'
import { RouterProvider } from 'react-router'
import CreateTrip from './create trip/CreateTrip.jsx'
import Header from './components/ui/custom/Header'
import { GoogleOAuthProvider } from '@react-oauth/google';
import ViewTrip from './view-trip/[tripid]/index.jsx'
import MyTrip from './my-trip/MyTrip'

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />

    },
    {
      path: '/CreateTrip',
      element: <CreateTrip/>
    },
    {
      path: '/view-trip/:tripid',
      element: <ViewTrip />
    },
    {
      path: '/my-trip',
      element: <MyTrip/>
    }
  ]
)

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLINT_ID}>
    <Header />
    <RouterProvider router={router} />
  </GoogleOAuthProvider>
  </React.StrictMode>
)
