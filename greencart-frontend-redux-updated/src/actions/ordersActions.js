import api from '../api/axios'
import * as types from '../constants/actionTypes'

export const fetchOrders = () => async (dispatch) => {
  dispatch({ type: types.ORDERS_FETCH_REQUEST })
  try {
    const res = await api.get('/api/orders')
    dispatch({ type: types.ORDERS_FETCH_SUCCESS, payload: res.data })
  } catch (err) {
    dispatch({ type: types.ORDERS_FETCH_FAILURE, error: err.message })
  }
}

export const addOrder = (payload) => async (dispatch) => {
  const res = await api.post('/api/orders', payload)
  dispatch({ type: types.ORDERS_ADD_SUCCESS, payload: res.data })
}

export const updateOrder = (id, payload) => async (dispatch) => {
  const res = await api.put(`/api/orders/${id}`, payload)
  dispatch({ type: types.ORDERS_UPDATE_SUCCESS, payload: res.data })
}

export const deleteOrder = (id) => async (dispatch) => {
  await api.delete(`/api/orders/${id}`)
  dispatch({ type: types.ORDERS_DELETE_SUCCESS, payload: id })
}
