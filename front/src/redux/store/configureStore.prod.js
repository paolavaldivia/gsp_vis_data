import {applyMiddleware, createStore} from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from 'redux/reducers'

export function configureStore (initialState) {
  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(
      thunkMiddleware // lets us dispatch() functions,
    )
  )
}
