import React from 'react';
import { profile } from "../assets/index.js";
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export const Navbar = () => {
  const navigate = useNavigate()
  const token = localStorage.getItem("adminToken")

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin-login");
  };


  return (
    <nav className="w-full bg-gray-200 relative  shadow-md px-4 py-3 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-row items-center justify-between">

        {/* Left Side: Title & Subtitle */}
        <div>
          <h1 className="text-2xl lg:text-4xl font-bold text-cyan-600">Shuto-Shoilo</h1>
          <p className="text-sm lg:text-lg text-gray-500">Admin Panel</p>
        </div>

        {/* Right Side: Profile */}
        <div className='flex flex-col justify-center items-center'>
          <img
            src={profile}
            alt="Admin Profile"
            className="w-10 h-10 lg:w-14 lg:h-14 rounded-full object-cover border-2 border-gray-300 shadow-sm"
          />
          {token ?
            <div
              className="flex items-center gap-2 p-2 rounded-md hover:bg-red-100 transition cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 text-red-600" />
              <span className="text-lg text-red-600">Logout</span>
            </div>
            : <></>}
        </div>

      </div>
    </nav>
  );
};
