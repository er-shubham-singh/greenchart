import authReducer from '../src/reducers/authReducer'
import driversReducer from '../src/reducers/driversReducer'
import * as types from '../src/constants/actionTypes'

test('auth reducer handles login success', () => {
  const state = authReducer(undefined, { type: types.AUTH_LOGIN_SUCCESS, payload: { token: 't', user: { name: 'A' } } })
  expect(state.token).toBe('t')
  expect(state.user).toEqual({ name: 'A' })
})

test('drivers reducer add/update/delete', () => {
  let state = driversReducer(undefined, { type: types.DRIVERS_FETCH_SUCCESS, payload: [{ _id:'d1', name:'A'}] })
  expect(state.items.length).toBe(1)
  state = driversReducer(state, { type: types.DRIVERS_ADD_SUCCESS, payload: { _id:'d2', name:'B'} })
  expect(state.items.length).toBe(2)
  state = driversReducer(state, { type: types.DRIVERS_UPDATE_SUCCESS, payload: { _id:'d2', name: 'B2'} })
  expect(state.items.find(i=>i._id==='d2').name).toBe('B2')
  state = driversReducer(state, { type: types.DRIVERS_DELETE_SUCCESS, payload: 'd2' })
  expect(state.items.find(i=>i._id==='d2')).toBeUndefined()
})
