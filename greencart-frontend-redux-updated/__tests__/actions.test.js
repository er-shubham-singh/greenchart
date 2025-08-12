import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../src/actions/driversActions'
import * as types from '../src/constants/actionTypes'
import api from '../src/api/axios'

jest.mock('../src/api/axios')
const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

test('fetchDrivers dispatches success', async () => {
  api.get.mockResolvedValue({ data: [{ _id:'d1', name:'A' }] })
  const store = mockStore({ drivers: { items: [] } })
  await store.dispatch(actions.fetchDrivers())
  const dispatched = store.getActions()
  expect(dispatched[0].type).toBe(types.DRIVERS_FETCH_REQUEST)
  expect(dispatched[1].type).toBe(types.DRIVERS_FETCH_SUCCESS)
})
