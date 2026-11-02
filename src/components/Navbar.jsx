import React from 'react';
import { profile } from "../assets/index.js";
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin-login");
  };

  return (
    <nav className="w-full bg-[#01472e] text-[#fefae0] relative shadow-md px-4 py-3 md:px-8 border-b border-[#ccd5ae]/20">
      <div className="max-w-7xl mx-auto flex flex-row items-center justify-between">
        
        {/* Left Side: Title & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#ccd5ae] text-[#01472e] flex items-center justify-center font-bold text-base shadow-sm">
            🌿
          </div>
          <div>
            <h1 className="text-xl lg:text-2xl font-bold tracking-wider text-[#fefae0] uppercase leading-none">
              - SHUTO SHOILI
            </h1>
            <p className="text-[10px] tracking-[0.25em] text-[#ccd5ae] uppercase mt-1">
              Botanical Cafe Admin
            </p>
          </div>
        </div>

        {/* Right Side: Profile & Logout */}
        <div className="flex items-center gap-4">
          <img
            src={profile}
            alt="Admin Profile"
            className="w-9 h-9 lg:w-11 lg:h-11 rounded-full object-cover border-2 border-[#ccd5ae] shadow-sm"
          />
          {token && (
            <button
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ccd5ae] hover:bg-red-100 text-[#01472e] hover:text-red-700 transition cursor-pointer text-xs font-bold uppercase tracking-wider"
              onClick={handleLogout}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          )}
        </div>

      </div>
    </nav>
  );
};
