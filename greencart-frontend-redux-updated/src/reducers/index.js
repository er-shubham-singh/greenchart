import { combineReducers } from 'redux';
import auth from './authReducer';
import drivers from './driversReducer';
import routes from './routesReducer';
import orders from './ordersReducer';
import simulation from './simulationReducer';
import loader from './LoaderReducer'; 

export default combineReducers({
  auth,
  drivers,
  routes,
  orders,
  simulation,
  loader,
});
