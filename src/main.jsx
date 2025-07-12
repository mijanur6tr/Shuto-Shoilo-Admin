import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'

const url = import.meta.env.VITE_BACKEND_URL

import { PrivateRoute } from './components/PrivateRoute.jsx'
import { Order } from './pages/Order.jsx'
import {List} from "./pages/List.jsx"
import {Add} from "./pages/Add.jsx"
import { AdminLogin } from './pages/AdminLogin.jsx'


const router = createBrowserRouter([
  {
    path:"/admin-login",
    element:<AdminLogin url={url}/>
  },
  {
    path:"/",
    element:(<PrivateRoute><App/></PrivateRoute>),
    children:[
      {
        path:"/",
        element:<Order url={url}/>
      },
      {
        path:"/add",
        element:<Add url={url}/>
      },
      {
        path:"/list",
        element:<List url={url}/>
      },
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    
    <RouterProvider router={router}/>
    
   
  </StrictMode>,
)
