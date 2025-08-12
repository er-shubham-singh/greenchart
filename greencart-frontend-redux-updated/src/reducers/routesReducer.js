import * as types from '../constants/actionTypes'
const initialState = { items: [], status: 'idle', error: null }
export default function routesReducer(state = initialState, action) {
  switch (action.type) {
    case types.ROUTES_FETCH_REQUEST: return { ...state, status: 'loading' }
    case types.ROUTES_FETCH_SUCCESS: return { ...state, status: 'succeeded', items: action.payload }
    case types.ROUTES_FETCH_FAILURE: return { ...state, status: 'failed', error: action.error }
    case types.ROUTES_ADD_SUCCESS: return { ...state, items: [...state.items, action.payload] }
    case types.ROUTES_UPDATE_SUCCESS: return { ...state, items: state.items.map(i=> i.route_id===action.payload.route_id? action.payload : i) }
    case types.ROUTES_DELETE_SUCCESS: return { ...state, items: state.items.filter(i=> i.route_id!==action.payload) }
    default: return state
  }
}
