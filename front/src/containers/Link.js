import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import LinkVis from 'components/visualizations/LinkVis'
const d3 = { ...require('d3-selection'),
  ...require('d3-transition') }

class Link extends React.Component {
  componentDidMount () {
    // wrap element in d3
    this.d3Node = d3.select(ReactDOM.findDOMNode(this))
    this.d3Node.datum(this.props.data)
      .call(LinkVis.enter)
  }

  shouldComponentUpdate (nextProps) {
    // if (nextProps.data.update) {
    this.d3Node.datum(nextProps.data)
      .call(LinkVis.update)
    // }
    return true
  }

  componentDidUpate () {
    this.d3Node.datum(this.props.data)
      .call(LinkVis.update)
  }

  render () {
    // const d = this.props.data
    return (
      <g className='link'>
        <line className='line' />
      </g>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    // anySelected: state.get('dataset').anySelected
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // anySelected: state.get('dataset').anySelected
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Link)
