import React from 'react'
import { connect } from 'react-redux'
import Splom from 'components/Splom'

class DataFilteredSplom extends React.Component {
  render () {
    const props = this.props
    const title = props.name + ': filtered ' + props.filter
    return (
      <Splom data={props.data} labeled={props.labeled} title={title} width={props.width} height={props.height} vars={props.vars} />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.get('filteredData').data,
    vars: state.get('filteredData').vars,
    name: state.get('dataset').name,
    filter: state.get('filter').name,
    labeled: state.get('filteredData').labeled
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DataFilteredSplom)
