import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from './reducers';

let middleware = [thunkMiddleware];
if (process.env.NODE_ENV !== 'production') {
  middleware = [...middleware, createLogger()];
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore(preloadedState) {
  return createStore(rootReducer, preloadedState, composeEnhancers(applyMiddleware(...middleware)));
}
