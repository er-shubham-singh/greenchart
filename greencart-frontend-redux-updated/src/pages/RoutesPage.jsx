import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrders, addOrder, updateOrder, deleteOrder } from '../actions/ordersActions';
import Modal from '../components/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faPlus, faSpinner, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

export default function Orders() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((s) => s.orders);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [form, setForm] = useState({ order_id: '', value_rs: 0, route_id: '', delivery_time: '' });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7; 

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const openAddModal = () => {
    setEditingOrder(null);
    setForm({ order_id: '', value_rs: 0, route_id: '', delivery_time: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (order) => {
    setEditingOrder(order);
    setForm({
      order_id: order.order_id,
      value_rs: order.value_rs,
      route_id: order.route_id,
      delivery_time: order.delivery_time_raw || '',
    });
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingOrder(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      order_id: Number(form.order_id),
      value_rs: Number(form.value_rs),
      route_id: Number(form.route_id),
      delivery_time: form.delivery_time,
    };
    try {
      if (editingOrder) {
        await dispatch(updateOrder(form.order_id, payload));
      } else {
        await dispatch(addOrder(payload));
      }
      closeModal();
      if (!editingOrder) setCurrentPage(1); 
    } catch (err) {
      alert('Operation failed. Please check the data and try again.');
    }
  };
  
  const handleDelete = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await dispatch(deleteOrder(orderId));
      } catch (err) {
        alert('Failed to delete order.');
      }
    }
  };

  return (
    <div className='min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-3xl font-bold'>Orders Management</h1>
          <button
            onClick={openAddModal}
            className='bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 flex items-center space-x-2'
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Add Order</span>
          </button>
        </div>

        {/* Orders List */}
        <div className='bg-gray-800 p-6 rounded-xl shadow-lg'>
          {status === 'loading' && (
            <div className='flex justify-center items-center py-8'>
              <FontAwesomeIcon icon={faSpinner} spin size='2x' className='text-green-500' />
              <span className='ml-4 text-gray-400'>Loading orders...</span>
            </div>
          )}
          {status === 'succeeded' && items.length > 0 && (
            <>
              <ul className='divide-y divide-gray-700'>
                {currentItems.map((o) => (
                  <li
                    key={o.order_id}
                    className='flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 space-y-2 sm:space-y-0'
                  >
                    <span className='text-gray-300 font-medium'>
                      <span className='text-green-400'>Order {o.order_id}</span> — ₹{o.value_rs}
                    </span>
                    <div className='space-x-2'>
                      <button
                        onClick={() => openEditModal(o)}
                        className='text-blue-400 p-2 rounded-full hover:bg-gray-700 transition-colors duration-200'
                        aria-label={`Edit order ${o.order_id}`}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => handleDelete(o.order_id)}
                        className='text-red-400 p-2 rounded-full hover:bg-gray-700 transition-colors duration-200'
                        aria-label={`Delete order ${o.order_id}`}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Pagination controls */}
              <div className='flex justify-center items-center mt-6 space-x-2'>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className='p-2 rounded-full text-gray-400 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <span className='px-4 py-2 bg-gray-700 text-green-400 rounded-lg font-bold'>
                  {currentPage}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className='p-2 rounded-full text-gray-400 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            </>
          )}
          {status === 'succeeded' && items.length === 0 && (
            <p className='text-center text-gray-400 py-8'>No orders found. Click "Add Order" to create one.</p>
          )}
          {status === 'failed' && (
            <p className='text-center text-red-500 py-8'>Failed to load orders: {error}</p>
          )}
        </div>
      </div>

      {/* Modal for Add/Edit Form */}
      <Modal open={isModalOpen} title={editingOrder ? 'Edit Order' : 'Add New Order'} onClose={closeModal}>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label htmlFor='order_id' className='block text-gray-400 font-medium mb-1'>
              Order ID
            </label>
            <input
              id='order_id'
              className='w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500'
              value={form.order_id}
              onChange={(e) => setForm({ ...form, order_id: e.target.value })}
              readOnly={!!editingOrder}
            />
          </div>
          <div>
            <label htmlFor='value_rs' className='block text-gray-400 font-medium mb-1'>
              Value (₹)
            </label>
            <input
              id='value_rs'
              type='number'
              className='w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500'
              value={form.value_rs}
              onChange={(e) => setForm({ ...form, value_rs: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor='route_id' className='block text-gray-400 font-medium mb-1'>
              Route ID
            </label>
            <input
              id='route_id'
              type='number'
              className='w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500'
              value={form.route_id}
              onChange={(e) => setForm({ ...form, route_id: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor='delivery_time' className='block text-gray-400 font-medium mb-1'>
              Delivery Time (e.g., 1:20)
            </label>
            <input
              id='delivery_time'
              type='text'
              className='w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500'
              value={form.delivery_time}
              onChange={(e) => setForm({ ...form, delivery_time: e.target.value })}
            />
          </div>
          <div className='flex justify-end pt-4'>
            <button
              type='submit'
              className='bg-green-600 text-white font-bold px-6 py-3 rounded-md hover:bg-green-700 transition-colors duration-200'
            >
              {editingOrder ? 'Update Order' : 'Add Order'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
