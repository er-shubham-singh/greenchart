import api from '../api/axios'
import * as types from '../constants/actionTypes'

export const login = (credentials) => async (dispatch) => {
  dispatch({ type: types.AUTH_LOGIN_REQUEST })
  try {
    const res = await api.post('/api/auth/login', credentials)
    const { token, user } = res.data
    localStorage.setItem('greencart_token', token)
    dispatch({ type: types.AUTH_LOGIN_SUCCESS, payload: { token, user } })
    return res.data
  } catch (err) {
    dispatch({ type: types.AUTH_LOGIN_FAILURE, error: err.message })
    throw err
  }
}

export const logout = () => (dispatch) => {
  localStorage.removeItem('greencart_token')
  dispatch({ type: types.AUTH_LOGOUT })
}
