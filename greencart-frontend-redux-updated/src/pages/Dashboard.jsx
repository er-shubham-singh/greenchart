import React from 'react'
import { useSelector } from 'react-redux'
import { PieChart, Pie, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts'

export default function Dashboard() {
  const sim = useSelector((s) => s.simulation.latest) || {}
  const pieData = [
    { name: 'On-time', value: sim.onTimeDeliveries || 0, fill: '#82ca9d' },
    { name: 'Late', value: sim.lateDeliveries || 0, fill: '#ff6b6b' },
  ]
  const fuel = Object.entries(sim.fuelCostByTraffic || {}).map(([k, v]) => ({
    name: k,
    value: v,
  }))

  // Wrapper to make charts responsive
  const ChartWrapper = ({ children }) => (
    <div className='w-full h-64 sm:h-72 md:h-80'>
      <ResponsiveContainer width='100%' height='100%'>
        {children}
      </ResponsiveContainer>
    </div>
  )

  return (
    <div className='min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6 lg:p-8'>
      <div className='max-w-7xl mx-auto'>
        <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-4 lg:mb-6'>
          Analytics Dashboard
        </h1>

        {/* Metrics */}
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-8'>
          <MetricCard label='Total Profit' value={`₹${sim.totalProfit ?? 0}`} color='text-green-400' />
          <MetricCard label='Efficiency' value={`${sim.efficiency ?? 0}%`} color='text-blue-400' />
          <MetricCard label='Total Orders' value={sim.totalOrders ?? 0} color='text-purple-400' />
        </div>

        {/* Charts */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* On-time vs Late */}
          <ChartCard title='On-time vs Late Deliveries'>
            <ChartWrapper>
              <PieChart>
                <Pie data={pieData} dataKey='value' nameKey='name' cx='50%' cy='50%' outerRadius='80%' label />
                <Tooltip contentStyle={{ backgroundColor: '#2d3748', borderColor: '#4a5568', borderRadius: '8px' }} />
              </PieChart>
            </ChartWrapper>
          </ChartCard>

          {/* Fuel Cost */}
          <ChartCard title='Fuel Cost Breakdown'>
            <ChartWrapper>
              <BarChart data={fuel} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey='name' stroke='#a0aec0' />
                <YAxis stroke='#a0aec0' />
                <Tooltip contentStyle={{ backgroundColor: '#2d3748', borderColor: '#4a5568', borderRadius: '8px' }} />
                <Bar dataKey='value' fill='#8884d8' />
              </BarChart>
            </ChartWrapper>
          </ChartCard>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ label, value, color }) {
  return (
    <div className='p-6 bg-gray-800 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300'>
      <p className='text-gray-400 text-sm'>{label}</p>
      <strong className={`text-2xl sm:text-3xl font-extrabold ${color} mt-2 block`}>{value}</strong>
    </div>
  )
}

function ChartCard({ title, children }) {
  return (
    <div className='p-6 bg-gray-800 rounded-xl shadow-lg flex flex-col'>
      <h3 className='font-semibold text-lg text-gray-200 mb-4'>{title}</h3>
      <div className='flex-1'>{children}</div>
    </div>
  )
}
