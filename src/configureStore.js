import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from './reducers';

let middleware = [thunkMiddleware];
if (process.env.NODE_ENV !== 'production') {
  middleware = [...middleware, createLogger()];
}

export default function configureStore(preloadedState) {
  return createStore(rootReducer, preloadedState, applyMiddleware(...middleware));
}
