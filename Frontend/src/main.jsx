import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import router from './router.jsx'
// import { ContextProvider } from './context/ContextProvider'
import { RouterProvider } from 'react-router-dom'
import { SocketProvider } from './context/SocketContext'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <ContextProvider> */}
    <SocketProvider>
      <RouterProvider router={router} />
    </SocketProvider>
    {/* </ContextProvider> */}
  </StrictMode>,
)