import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setLoading } from './store/LoaderSlice'; 
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Simulation from './pages/Simulation';
import Drivers from './pages/Drivers';
import RoutesPage from './pages/RoutesPage';
import Orders from './pages/Orders';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Loader from './components/Loader';

export default function App() {
  const loading = useSelector((state) => state.loader.loading);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(true));

    const timer = setTimeout(() => {
      dispatch(setLoading(false));
    }, 500);

    return () => clearTimeout(timer);
  }, [location, dispatch]);

  return (
    <>
      {loading && <Loader />}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="simulation" element={<Simulation />} />
          <Route path="drivers" element={<Drivers />} />
          <Route path="routes" element={<RoutesPage />} />
          <Route path="orders" element={<Orders />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}
