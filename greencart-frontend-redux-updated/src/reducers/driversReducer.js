import * as types from '../constants/actionTypes'
const initialState = { items: [], status: 'idle', error: null }
export default function driversReducer(state = initialState, action) {
  switch (action.type) {
    case types.DRIVERS_FETCH_REQUEST: return { ...state, status: 'loading' }
    case types.DRIVERS_FETCH_SUCCESS: return { ...state, status: 'succeeded', items: action.payload }
    case types.DRIVERS_FETCH_FAILURE: return { ...state, status: 'failed', error: action.error }
    case types.DRIVERS_ADD_SUCCESS: return { ...state, items: [...state.items, action.payload] }
    case types.DRIVERS_UPDATE_SUCCESS: return { ...state, items: state.items.map(i=> i._id===action.payload._id? action.payload : i) }
    case types.DRIVERS_DELETE_SUCCESS: return { ...state, items: state.items.filter(i=> i._id!==action.payload) }
    default: return state
  }
}
