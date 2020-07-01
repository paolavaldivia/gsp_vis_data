import PropTypes from 'prop-types'
import React from 'react'
import {Provider} from 'react-redux'
import Dashboard from 'components/Dashboard'
import Menu from 'components/Menu'
import Footer from 'components/Footer'
import Tooltip from 'containers/Tooltip'
import Info from 'containers/Info'

export default function App ({store}) {
  return (
    <Provider store={store}>
      <div>
        <Menu />
        <Dashboard />
        <Tooltip />
        <Footer />
        <Info />
      </div>
    </Provider>
  )
}

App.propTypes = {
  store: PropTypes.object.isRequired
}
