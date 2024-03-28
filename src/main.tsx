import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './pages/routes/router.tsx'
import { DataProvider } from './pages/context/dataContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DataProvider>
     <RouterProvider router={router}/>
    </DataProvider>
  </React.StrictMode>,
)
