import React from 'react'
import {Outlet} from "react-router-dom"
import { Navbar,Sidebar } from './components'
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <div className="min-h-screen">
      <ToastContainer/>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 sm:p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}


export default App
