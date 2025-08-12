import * as types from '../constants/actionTypes'
const token = localStorage.getItem('greencart_token') || null
const initialState = { token, user: null, status: 'idle', error: null }
export default function authReducer(state = initialState, action) {
  switch (action.type) {
    case types.AUTH_LOGIN_REQUEST: return { ...state, status: 'loading' }
    case types.AUTH_LOGIN_SUCCESS: return { ...state, status: 'succeeded', token: action.payload.token, user: action.payload.user }
    case types.AUTH_LOGIN_FAILURE: return { ...state, status: 'failed', error: action.error }
    case types.AUTH_LOGOUT: return { ...state, token: null, user: null }
    default: return state
  }
}
