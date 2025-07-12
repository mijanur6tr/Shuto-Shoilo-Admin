import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Orders', path: '/' },
    { name: 'Add Items', path: '/add' },
    { name: 'List Items', path: '/list' },
  ];

  return (
    <>
      
      {!isOpen && (
        <div
          className="md:hidden flex  p-2 text-gray-700 focus:outline-none"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="w-6 h-6 relative top-35 " />
        </div>
      )}

      
      <aside
        className={`fixed top-0 left-0 z-40 w-64 bg-gray-100 min-h-screen border-r-2 border-gray-400 shadow-sm p-5 transform transition-transform duration-300 md:static md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        
        <div className="md:hidden flex justify-end">
          <button
            className="text-gray-600 mb-4"
            onClick={() => setIsOpen(false)}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        
        <nav className="flex flex-col gap-4">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)} // Close menu after click
              className={`text-base px-4 py-2 rounded-md font-medium hover:bg-indigo-100 transition ${
                location.pathname === item.path
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};
