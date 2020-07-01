import React from 'react'
import ReactDOM from 'react-dom'
import BarVis from 'components/visualizations/BarVis'
const d3 = { ...require('d3-selection'),
  ...require('d3-transition') }

class Bar extends React.Component {
  componentDidMount () {
    // wrap element in d3
    this.d3Node = d3.select(ReactDOM.findDOMNode(this))
    this.d3Node.datum(this.props.data)
      .call(BarVis.enter)
  }

  shouldComponentUpdate (nextProps) {
    // if (nextProps.data.update) {
    this.d3Node.datum(nextProps.data)
      .call(BarVis.update)
    // }
    return true
  }

  componentDidUpate () {
    this.d3Node.datum(this.props.data)
      .call(BarVis.update)
  }

  componentWillUnMount () {

  }

  render () {
    // const d = this.props.data
    return (
      <g className='bar'>
        <rect className='front' />
      </g>
    )
  }
}

export default Bar
