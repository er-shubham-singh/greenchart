// import React, { useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { runSimulation } from '../actions/simulationActions'

// export default function Simulation() {
//   const dispatch = useDispatch()
//   const sim = useSelector(s=>s.simulation)
//   const [numberOfDrivers, setNumberOfDrivers] = useState(6)
//   const [start_time, setStartTime] = useState('09:00')
//   const [max_hours, setMaxHours] = useState(8)

//   const handle = async (e) => {
//     e.preventDefault()
//     try { await dispatch(runSimulation({ numberOfDrivers, start_time, max_hours_per_driver: max_hours })) }
//     catch (err) { alert('Simulation failed: '+err.message) }
//   }

//   return (
//     <div>
//       <h1 className='text-xl font-bold mb-4'>Run Simulation</h1>
//       <form className='bg-white p-4 rounded shadow max-w-md' onSubmit={handle}>
//         <label className='block mb-2'>Number of Drivers<input type='number' className='w-full border p-2' value={numberOfDrivers} onChange={e=>setNumberOfDrivers(Number(e.target.value))} /></label>
//         <label className='block mb-2'>Start Time<input className='w-full border p-2' value={start_time} onChange={e=>setStartTime(e.target.value)} /></label>
//         <label className='block mb-4'>Max Hours per Driver<input type='number' className='w-full border p-2' value={max_hours} onChange={e=>setMaxHours(Number(e.target.value))} /></label>
//         <button className='bg-green-600 text-white p-2 rounded'>Run</button>
//       </form>

//       <div className='mt-6'>
//         <h2 className='font-semibold'>Latest Simulation</h2>
//         <pre className='bg-white p-4 rounded mt-2'>{JSON.stringify(sim.latest, null, 2)}</pre>
//       </div>
//     </div>
//   )
// }

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { runSimulation } from '../actions/simulationActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';
import Modal from '../components/Modal'; // Assuming a Modal component with close icon and blurred background

export default function Simulation() {
  const dispatch = useDispatch();
  const { latest, loading, error } = useSelector((s) => s.simulation);
  const [numberOfDrivers, setNumberOfDrivers] = useState(6);
  const [startTime, setStartTime] = useState('09:00');
  const [maxHours, setMaxHours] = useState(8);
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false); // State for the results modal

  const handleRunSimulation = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        runSimulation({
          numberOfDrivers,
          start_time: startTime,
          max_hours_per_driver: maxHours,
        })
      );
      // Open the modal automatically on successful simulation
      setIsResultsModalOpen(true);
    } catch (err) {
      // The error is handled by the Redux state, but a local alert can be a fallback
      alert(`Simulation failed: ${err.message}`);
    }
  };

  return (
    <div className='min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-8'>
      <div className='max-w-4xl mx-auto'>
        <h1 className='text-3xl sm:text-4xl font-bold mb-8 text-center'>Run New Simulation</h1>

        {/* Simulation Form Card */}
        <div className='bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg'>
          <h2 className='text-2xl font-semibold mb-6'>Simulation Parameters</h2>
          <form className='grid grid-cols-1 md:grid-cols-2 gap-6' onSubmit={handleRunSimulation}>
            {/* Number of Drivers */}
            <div>
              <label htmlFor='drivers' className='block text-gray-400 font-medium mb-1'>
                Number of Drivers
              </label>
              <input
                id='drivers'
                type='number'
                className='w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500'
                value={numberOfDrivers}
                onChange={(e) => setNumberOfDrivers(Number(e.target.value))}
                min='1'
              />
            </div>
            {/* Start Time */}
            <div>
              <label htmlFor='startTime' className='block text-gray-400 font-medium mb-1'>
                Start Time
              </label>
              <input
                id='startTime'
                type='time'
                className='w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500'
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
            </div>
            {/* Max Hours */}
            <div className='md:col-span-2'>
              <label htmlFor='maxHours' className='block text-gray-400 font-medium mb-1'>
                Max Hours per Driver
              </label>
              <input
                id='maxHours'
                type='number'
                className='w-full bg-gray-700 border border-gray-600 rounded-md p-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500'
                value={maxHours}
                onChange={(e) => setMaxHours(Number(e.target.value))}
                min='1'
              />
            </div>
            {/* Submit Button */}
            <div className='md:col-span-2 mt-4'>
              <button
                type='submit'
                className='w-full bg-green-600 text-white font-bold p-3 rounded-md hover:bg-green-700 transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center space-x-2'
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin />
                    <span>Running Simulation...</span>
                  </>
                ) : (
                  <span>Run Simulation</span>
                )}
              </button>
            </div>
          </form>
          {error && <p className='mt-4 text-center text-red-500'>{error}</p>}
        </div>

        {/* Button to show results modal */}
        {latest && !loading && (
          <div className='text-center mt-8'>
            <button
              onClick={() => setIsResultsModalOpen(true)}
              className='bg-blue-600 text-white font-bold py-3 px-6 rounded-md hover:bg-blue-700 transition-colors duration-200'
            >
              Show Latest Results
            </button>
          </div>
        )}
      </div>

      {/* Modal for Latest Simulation Results */}
      {latest && (
        <Modal open={isResultsModalOpen} onClose={() => setIsResultsModalOpen(false)}>
          <div className='relative bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-lg mx-auto'>
            <button 
              onClick={() => setIsResultsModalOpen(false)} 
              className='absolute top-4 right-4 text-gray-400 hover:text-gray-100 transition-colors'
            >
              <FontAwesomeIcon icon={faTimes} size='lg' />
            </button>
            <h2 className='text-2xl font-semibold mb-4'>Latest Simulation Results</h2>
            <div className='max-h-96 overflow-y-auto bg-gray-900 rounded-md'>
              <pre className='text-green-400 p-4 text-sm'>
                {JSON.stringify(latest, null, 2)}
              </pre>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
