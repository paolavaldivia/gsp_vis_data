import 'babel-polyfill'
import 'styles/custom.scss'
import 'styles/custom.css'
import React from 'react'
import { render } from 'react-dom'
import { configureStore } from 'redux/store/configureStore'
import { AppContainer } from 'react-hot-loader'
import { initialState } from 'redux/reducers'
import App from 'containers/App'

const store = configureStore(initialState)

render(
  <AppContainer>
    <App store={store} />
  </AppContainer>,
  document.getElementById('root')
)

if (module.hot) {
  module.hot.accept('containers/App', () => {
    const newConfigureStore = require('redux/store/configureStore')
    const newStore = newConfigureStore.configureStore(initialState)
    const newHistory = newConfigureStore.history
    const NewRoot = require('./containers/App').default
    render(
      <AppContainer>
        <NewRoot store={newStore} history={newHistory} />
      </AppContainer>,
      document.getElementById('root')
    )
  })
}
