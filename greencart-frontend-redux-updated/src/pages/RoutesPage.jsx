import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRoutes, addRoute, updateRoute, deleteRoute } from '../actions/routesActions';
import Modal from '../components/Modal'; // Assuming Modal is styled to fit the new theme
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faPlus, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function RoutesPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const { items, status, error } = useSelector((s) => s.routes);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [form, setForm] = useState({ route_id: '', distance_km: 0, traffic_level: 'Low', base_time_min: 0 });

  useEffect(() => {
    dispatch(fetchRoutes());
  }, [dispatch]);

  const openAddModal = () => {
    setEditingRoute(null);
    setForm({ route_id: '', distance_km: 0, traffic_level: 'Low', base_time_min: 0 });
    setIsModalOpen(true);
  };
  
  const openEditModal = (route) => {
    setEditingRoute(route);
    setForm({
      route_id: route.route_id,
      distance_km: route.distance_km,
      traffic_level: route.traffic_level,
      base_time_min: route.base_time_min,
    });
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRoute(null);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  const payload = {
    route_id: Number(form.route_id),
    distance_km: Number(form.distance_km),
    traffic_level: form.traffic_level,
    base_time_min: Number(form.base_time_min),
  };

  try {
    if (editingRoute) {
      await dispatch(updateRoute(form.route_id, payload));
      toast.success(`Route ${form.route_id} updated successfully!`);
    } else {
      await dispatch(addRoute(payload));
      toast.success('New route added successfully!');
    }
    closeModal();
  } catch (err) {
    toast.error('Operation failed. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};

  
const handleDelete = async (routeId) => {
  if (window.confirm('Are you sure you want to delete this route?')) {
    try {
      await dispatch(deleteRoute(routeId));
      toast.success(`Route ${routeId} deleted successfully.`);
    } catch (err) {
      toast.error('Failed to delete route.');
    }
  }
};


  return (
    <div className='min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-8'>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <div className='max-w-4xl mx-auto'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-3xl font-bold'>Routes Management</h1>
          <button
            onClick={openAddModal}
            className='bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2'
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Add Route</span>
          </button>
        </div>

        {/* Routes List */}
        <div className='bg-gray-800 p-6 rounded-xl shadow-lg'>
          {status === 'loading' && (
            <div className='flex justify-center items-center py-8'>
              <FontAwesomeIcon icon={faSpinner} spin size='2x' className='text-green-500' />
              <span className='ml-4 text-gray-400'>Loading routes...</span>
            </div>
          )}
          {status === 'succeeded' && items.length > 0 && (
            <ul className='divide-y divide-gray-700'>
              {items.map((r) => (
                <li
                  key={r.route_id}
                  className='flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 space-y-2 sm:space-y-0'
                >
                  <span className='text-gray-300 font-medium'>
                    <span className='text-green-400'>Route {r.route_id}</span> — {r.distance_km} km ({r.traffic_level})
                  </span>
                  <div className='space-x-2'>
                    <button
                      onClick={() => openEditModal(r)}
                      className='text-blue-400 p-2 rounded-full hover:bg-gray-700 transition-colors duration-200'
                      aria-label={`Edit route ${r.route_id}`}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      onClick={() => handleDelete(r.route_id)}
                      className='text-red-400 p-2 rounded-full hover:bg-gray-700 transition-colors duration-200'
                      aria-label={`Delete route ${r.route_id}`}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
          {status === 'succeeded' && items.length === 0 && (
            <p className='text-center text-gray-400 py-8'>No routes found. Click "Add Route" to create one.</p>
          )}
          {status === 'failed' && (
            <p className='text-center text-red-500 py-8'>Failed to load routes: {error}</p>
          )}
        </div>
      </div>

      {/* Modal for Add/Edit Form */}
      <Modal open={isModalOpen} title={editingRoute ? 'Edit Route' : 'Add New Route'} onClose={closeModal}>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label htmlFor='route_id' className='block text-gray-400 font-medium mb-1'>
              Route ID
            </label>
            <input
              id='route_id'
              className='w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500'
              value={form.route_id}
              onChange={(e) => setForm({ ...form, route_id: e.target.value })}
              readOnly={!!editingRoute} // Make ID read-only when editing
            />
          </div>
          <div>
            <label htmlFor='distance_km' className='block text-gray-400 font-medium mb-1'>
              Distance (km)
            </label>
            <input
              id='distance_km'
              type='number'
              className='w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500'
              value={form.distance_km}
              onChange={(e) => setForm({ ...form, distance_km: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor='traffic_level' className='block text-gray-400 font-medium mb-1'>
              Traffic Level
            </label>
            <select
              id='traffic_level'
              className='w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500'
              value={form.traffic_level}
              onChange={(e) => setForm({ ...form, traffic_level: e.target.value })}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
          <div>
            <label htmlFor='base_time_min' className='block text-gray-400 font-medium mb-1'>
              Base Time (min)
            </label>
            <input
              id='base_time_min'
              type='number'
              className='w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500'
              value={form.base_time_min}
              onChange={(e) => setForm({ ...form, base_time_min: e.target.value })}
            />
          </div>
          <div className='flex justify-end pt-4'>
<button
  type='submit'
  disabled={isSubmitting}
  className={`bg-green-600 text-white font-bold px-6 py-3 rounded-md transition-colors duration-200 ${
    isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
  }`}
>
  {isSubmitting
    ? editingRoute
      ? 'Updating...'
      : 'Submitting...'
    : editingRoute
    ? 'Update Route'
    : 'Add Route'}
</button>

          </div>
        </form>
      </Modal>
    </div>
  );
}