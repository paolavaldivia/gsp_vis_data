import React from 'react'
import { connect } from 'react-redux'
import ParallelCoordinates from 'components/ParallelCoordinates'

class DataPC extends React.Component {
  render () {
    const props = this.props
    const title = props.name + ': filtered ' + props.filter
    return (
      <ParallelCoordinates data={props.data} labeled={props.labeled} title={title} width={props.width} height={props.height} vars={props.vars} />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.get('filteredData').data,
    name: state.get('dataset').name,
    vars: state.get('dataset').vars,
    filter: state.get('filter').name,
    labeled: state.get('dataset').labeled
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DataPC)
