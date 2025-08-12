import React from 'react'

export default function Modal({ open, title, children, onClose }) {
  if (!open) return null
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50'>
      <div className='bg-white rounded shadow-lg w-full max-w-md p-4'>
        <div className='flex justify-between items-center mb-2'>
          <h3 className='text-lg font-semibold'>{title}</h3>
          <button onClick={onClose} className='text-gray-500'>Close</button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  )
}
