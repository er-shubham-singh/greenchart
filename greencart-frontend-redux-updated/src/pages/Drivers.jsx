import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDrivers, addDriver, updateDriver, deleteDriver } from '../actions/driversActions'
import Modal from '../components/Modal'

export default function Drivers() {
  const dispatch = useDispatch()
  const { items, status } = useSelector(s => s.drivers)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', shift_hours: 8, past_week_hours: '' })

  useEffect(()=>{ dispatch(fetchDrivers()) }, [dispatch])

  const openAdd = () => { setEditing(null); setForm({ name:'', shift_hours:8, past_week_hours:'' }); setOpen(true) }
  const openEdit = (d) => { setEditing(d); setForm({ name:d.name, shift_hours:d.shift_hours, past_week_hours:(d.past_week_hours||[]).join('|') }); setOpen(true) }

  const submit = async (e) => {
    e.preventDefault()
    const payload = { name: form.name, shift_hours: Number(form.shift_hours), past_week_hours: form.past_week_hours.split('|').filter(Boolean).map(Number) }
    try {
      if (editing) await dispatch(updateDriver(editing._id, payload))
      else await dispatch(addDriver(payload))
      setOpen(false)
    } catch (err) { alert('Failed') }
  }

  return (
    <div>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-xl font-bold'>Drivers</h1>
        <button onClick={openAdd} className='bg-blue-600 text-white px-3 py-1 rounded'>Add Driver</button>
      </div>
      <div className='bg-white p-4 rounded shadow'>
        {status==='loading' ? 'Loading...' : <ul>{items.map(d=> <li key={d._id} className='flex justify-between items-center py-1'><span>{d.name} — {d.shift_hours}h</span><span><button onClick={()=>openEdit(d)} className='text-blue-600 mr-2'>Edit</button><button onClick={()=>dispatch(deleteDriver(d._id))} className='text-red-600'>Delete</button></span></li>)}</ul>}
      </div>

      <Modal open={open} title={editing? 'Edit Driver':'Add Driver'} onClose={()=>setOpen(false)}>
        <form onSubmit={submit}>
          <label className='block mb-2'>Name<input className='w-full border p-2' value={form.name} onChange={e=>setForm({...form, name:e.target.value})} /></label>
          <label className='block mb-2'>Shift hours<input type='number' className='w-full border p-2' value={form.shift_hours} onChange={e=>setForm({...form, shift_hours:e.target.value})} /></label>
          <label className='block mb-4'>Past week hours (pipe separated) <input className='w-full border p-2' value={form.past_week_hours} onChange={e=>setForm({...form, past_week_hours:e.target.value})} /></label>
          <div className='flex justify-end'><button className='bg-green-600 text-white px-3 py-1 rounded' type='submit'>Save</button></div>
        </form>
      </Modal>
    </div>
  )
}
