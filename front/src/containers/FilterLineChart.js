import React from 'react'
import { connect } from 'react-redux'
import LineChart from 'components/LineChart'

class Filter extends React.Component {
  render () {
    const props = this.props
    return (
      <LineChart data={props.data} width={props.width} height={props.height} x='0' y='1' />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.get('filter').data
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Filter)
