import api from '../api/axios'
import * as types from '../constants/actionTypes'

export const runSimulation = (payload) => async (dispatch) => {
  dispatch({ type: types.SIM_RUN_REQUEST })
  try {
    const res = await api.post('/api/simulate', payload)
    dispatch({ type: types.SIM_RUN_SUCCESS, payload: res.data })
    return res.data
  } catch (err) {
    dispatch({ type: types.SIM_RUN_FAILURE, error: err.message })
    throw err
  }
}
