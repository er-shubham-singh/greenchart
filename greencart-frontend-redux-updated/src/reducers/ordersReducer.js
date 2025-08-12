import * as types from '../constants/actionTypes'
const initialState = { items: [], status: 'idle', error: null }
export default function ordersReducer(state = initialState, action) {
  switch (action.type) {
    case types.ORDERS_FETCH_REQUEST: return { ...state, status: 'loading' }
    case types.ORDERS_FETCH_SUCCESS: return { ...state, status: 'succeeded', items: action.payload }
    case types.ORDERS_FETCH_FAILURE: return { ...state, status: 'failed', error: action.error }
    case types.ORDERS_ADD_SUCCESS: return { ...state, items: [...state.items, action.payload] }
    case types.ORDERS_UPDATE_SUCCESS: return { ...state, items: state.items.map(i=> i.order_id===action.payload.order_id? action.payload : i) }
    case types.ORDERS_DELETE_SUCCESS: return { ...state, items: state.items.filter(i=> i.order_id!==action.payload) }
    default: return state
  }
}
