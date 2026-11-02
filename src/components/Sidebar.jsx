import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, PlusCircle, ListChecks, Layers } from 'lucide-react';

export const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Cafe Orders', path: '/', icon: ShoppingBag },
    { name: 'Add Cafe Item', path: '/add', icon: PlusCircle },
    { name: 'Categories', path: '/categories', icon: Layers },
    { name: 'Menu Inventory', path: '/list', icon: ListChecks },
  ];

  return (
    <>
      {!isOpen && (
        <div
          className="md:hidden flex p-2 text-gray-700 focus:outline-none"
          onClick={() => setIsOpen(true)}
        >
          <Menu className="w-6 h-6 relative top-2" />
        </div>
      )}

      <aside
        className={`fixed top-0 left-0 z-40 w-64 bg-[#fefae0]/90 backdrop-blur-md min-h-screen border-r border-[#01472e]/15 shadow-sm p-6 transform transition-transform duration-300 md:static md:translate-x-0 ${
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

        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 text-sm px-4 py-3 rounded-xl font-semibold transition ${
                  isActive
                    ? 'bg-[#01472e] text-[#fefae0] shadow-sm'
                    : 'text-[#01472e] hover:bg-[#ccd5ae]/40'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
};
