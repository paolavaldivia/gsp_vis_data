import {applyMiddleware, createStore, compose} from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from 'redux/reducers'
import logger from 'redux-logger'

export function configureStore (initialState) {
  return createStore(
    rootReducer,
    initialState,
    compose(
      applyMiddleware(
        thunkMiddleware, // lets us dispatch() functions,
        logger
      )
    ),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
}
