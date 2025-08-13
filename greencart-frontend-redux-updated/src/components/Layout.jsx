import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../actions/authActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTachometerAlt,
  faTruck,
  faRoute,
  faBox,
  faSignOutAlt,
  faBars,
  faTimes,
} from '@fortawesome/free-solid-svg-icons';
// showLoader and hideLoader are no longer needed here,
// as the loader can be managed at a higher level or within individual pages.

export default function Layout() {
  const dispatch = useDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Dashboard', icon: faTachometerAlt },
    { to: '/simulation', label: 'Simulation', icon: faTruck },
    { to: '/routes', label: 'Routes', icon: faRoute },
    { to: '/orders', label: 'Orders', icon: faBox },
  ];

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-900 text-gray-200">
      {/* Mobile Menu Button & Brand Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-gray-900 z-50 flex items-center px-4">
        <button
          className="p-2 text-white bg-gray-800 rounded-full"
          onClick={toggleSidebar}
        >
          <FontAwesomeIcon icon={isSidebarOpen ? faTimes : faBars} size="lg" />
        </button>
        <h2 className="text-xl font-bold text-green-400 tracking-wide ml-4">
          GreenCart
        </h2>
      </div>

      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0
        w-64 h-screen bg-gray-800 bg-opacity-90 backdrop-blur-md
        flex flex-col justify-between p-6
        z-40 transition-transform duration-300 ease-in-out shadow-xl`}
      >
        {/* Brand - visible only on desktop */}
        <div className="hidden md:flex items-center justify-between mb-10">
          <h2 className="text-2xl font-bold text-green-400 tracking-wide">
            GreenCart
          </h2>
        </div>

        {/* Navigation */}
        <nav className="space-y-2 mt-16 md:mt-0">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center space-x-3 p-3 rounded-lg font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-green-500 to-green-400 text-white shadow-md'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-green-400'
                }`}
                onClick={closeSidebar}
              >
                <FontAwesomeIcon icon={link.icon} className="w-5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          className="flex items-center space-x-3 p-3 rounded-lg text-red-400 hover:bg-gray-700 transition-colors duration-200 mt-auto"
          onClick={() => {
            dispatch(logout());
            closeSidebar();
          }}
        >
          <FontAwesomeIcon icon={faSignOutAlt} className="w-5" />
          <span className="font-medium">Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen overflow-y-auto px-4 sm:px-6 md:px-8 bg-gray-900 pt-16 md:pt-0">
        <Outlet />
      </main>
    </div>
  );
}