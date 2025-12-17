import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import router from './router.jsx'
// import { ContextProvider } from './context/ContextProvider'
import { RouterProvider } from 'react-router-dom'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <ContextProvider> */}
      <RouterProvider router={router} />
    {/* </ContextProvider> */}
  </StrictMode>,
)