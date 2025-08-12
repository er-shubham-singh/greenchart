
import React, { useEffect, useState } from 'react';
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
import {showLoader, hideLoader} from '../actions/LoaderAction'

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

  useEffect(() => {
    dispatch(showLoader());
    const timer = setTimeout(() => dispatch(hideLoader()), 500); // simulate small delay
    return () => clearTimeout(timer);
  }, [location.pathname, dispatch]);


  return (
    <div className="flex h-screen bg-gray-900 text-gray-200">
      {/* Mobile Menu Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-3 text-white bg-gray-800 rounded-full shadow-md"
        onClick={toggleSidebar}
      >
        <FontAwesomeIcon icon={isSidebarOpen ? faTimes : faBars} size="lg" />
      </button>

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
        {/* Brand */}
        <div>
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-green-400 tracking-wide">
              GreenCart
            </h2>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
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
        </div>

        {/* Logout */}
        <button
          className="flex items-center space-x-3 p-3 rounded-lg text-red-400 hover:bg-gray-700 transition-colors duration-200"
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
      <main className="flex-1 min-h-screen overflow-y-auto px-4 sm:px-6 md:px-8 bg-gray-900">
        <Outlet />
      </main>
    </div>
  );
}
