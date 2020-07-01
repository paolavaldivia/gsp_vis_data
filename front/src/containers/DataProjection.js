import React from 'react'
// import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import ScatterPlotChart from 'components/ScatterPlotChart'

class Projection extends React.Component {
  render () {
    const props = this.props
    return (
      <ScatterPlotChart title={props.name} labeled={props.labeled}
        data={props.data} links={props.links} linksVisible={props.linksVisible}
        width={props.width} height={props.height} x='0' y='1' />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.get('projection').data,
    labeled: state.get('projection').labeled,
    name: state.get('dataset').name,
    links: state.get('dataset').links,
    linksVisible: state.get('dataset').linksVisible
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Projection)
