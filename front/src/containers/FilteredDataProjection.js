import React from 'react'
// import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import ScatterPlotChart from 'components/ScatterPlotChart'

class ProjectionFiltered extends React.Component {
  render () {
    const props = this.props
    const title = props.name + ': filtered ' + props.filter
    return (
      <ScatterPlotChart title={title}
        links={props.links} linksVisible={props.linksVisible}
        labeled={props.labeled} data={props.data} width={props.width} height={props.height} x='0' y='1' />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.get('fprojection').data,
    labeled: state.get('fprojection').labeled,
    name: state.get('dataset').name,
    filter: state.get('filter').name,
    links: state.get('dataset').links,
    linksVisible: state.get('dataset').linksVisible
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectionFiltered)
