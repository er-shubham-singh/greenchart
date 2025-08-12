import api from '../api/axios'
import * as types from '../constants/actionTypes'

export const fetchRoutes = () => async (dispatch) => {
  dispatch({ type: types.ROUTES_FETCH_REQUEST })
  try {
    const res = await api.get('/api/routes')
    dispatch({ type: types.ROUTES_FETCH_SUCCESS, payload: res.data })
  } catch (err) {
    dispatch({ type: types.ROUTES_FETCH_FAILURE, error: err.message })
  }
}

export const addRoute = (payload) => async (dispatch) => {
  const res = await api.post('/api/routes', payload)
  dispatch({ type: types.ROUTES_ADD_SUCCESS, payload: res.data })
}

export const updateRoute = (id, payload) => async (dispatch) => {
  const res = await api.put(`/api/routes/${id}`, payload)
  dispatch({ type: types.ROUTES_UPDATE_SUCCESS, payload: res.data })
}

export const deleteRoute = (id) => async (dispatch) => {
  await api.delete(`/api/routes/${id}`)
  dispatch({ type: types.ROUTES_DELETE_SUCCESS, payload: id })
}
