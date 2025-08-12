import api from '../api/axios'
import * as types from '../constants/actionTypes'

export const fetchDrivers = () => async (dispatch) => {
  dispatch({ type: types.DRIVERS_FETCH_REQUEST })
  try {
    const res = await api.get('/api/drivers')
    dispatch({ type: types.DRIVERS_FETCH_SUCCESS, payload: res.data })
  } catch (err) {
    dispatch({ type: types.DRIVERS_FETCH_FAILURE, error: err.message })
  }
}

export const addDriver = (payload) => async (dispatch) => {
  const res = await api.post('/api/drivers', payload)
  dispatch({ type: types.DRIVERS_ADD_SUCCESS, payload: res.data })
}

export const updateDriver = (id, payload) => async (dispatch) => {
  const res = await api.put(`/api/drivers/${id}`, payload)
  dispatch({ type: types.DRIVERS_UPDATE_SUCCESS, payload: res.data })
}

export const deleteDriver = (id) => async (dispatch) => {
  await api.delete(`/api/drivers/${id}`)
  dispatch({ type: types.DRIVERS_DELETE_SUCCESS, payload: id })
}
