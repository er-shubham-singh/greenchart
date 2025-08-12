import * as types from '../constants/actionTypes'
const initialState = { latest: null, status: 'idle', error: null }
export default function simulationReducer(state = initialState, action) {
  switch (action.type) {
    case types.SIM_RUN_REQUEST: return { ...state, status: 'loading' }
    case types.SIM_RUN_SUCCESS: return { ...state, status: 'succeeded', latest: action.payload.data.simulation }
    case types.SIM_RUN_FAILURE: return { ...state, status: 'failed', error: action.error }
    default: return state
  }
}
