import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../actions/authActions'
import { Navigate, useLocation } from 'react-router-dom'

export default function Login() {
  const dispatch = useDispatch()
  const { token, status } = useSelector((s) => s.auth)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const loc = useLocation()
  const from = loc.state?.from?.pathname || '/'

  if (token) return <Navigate to={from} replace />

  const handle = async (e) => {
    e.preventDefault()
    try { await dispatch(login({ email, password })) } catch (err) { alert('Login failed') }
  }

  return (
    <div className='flex items-center justify-center h-screen'>
      <form className='w-full max-w-sm bg-white p-6 rounded shadow' onSubmit={handle}>
        <h1 className='text-xl font-bold mb-4'>Manager Login</h1>
        <label className='block mb-2'>Email<input className='w-full border p-2' value={email} onChange={e=>setEmail(e.target.value)} /></label>
        <label className='block mb-4'>Password<input type='password' className='w-full border p-2' value={password} onChange={e=>setPassword(e.target.value)} /></label>
        <button className='w-full bg-blue-600 text-white p-2 rounded'>{status==='loading'?'Logging...':'Login'}</button>
      </form>
    </div>
  )
}
