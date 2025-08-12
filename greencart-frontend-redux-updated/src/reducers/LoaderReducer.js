// src/reducers/loaderReducer.js
import { SHOW_LOADER, HIDE_LOADER } from '../actions/LoaderAction';

const initialState = { loading: false };

export default function loaderReducer(state = initialState, action) {
  switch (action.type) {
    case SHOW_LOADER:
      return { loading: true };
    case HIDE_LOADER:
      return { loading: false };
    default:
      return state;
  }
}
