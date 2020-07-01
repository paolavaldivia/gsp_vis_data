import React from 'react'
import { connect } from 'react-redux'
import ParallelCoordinates from 'components/ParallelCoordinates'

class DataPC extends React.Component {
  render () {
    const props = this.props
    return (
      <ParallelCoordinates data={props.data} labeled={props.labeled} title={props.name} width={props.width} height={props.height} vars={props.vars} />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.get('dataset').data,
    name: state.get('dataset').name,
    vars: state.get('dataset').vars,
    labeled: state.get('dataset').labeled
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DataPC)
