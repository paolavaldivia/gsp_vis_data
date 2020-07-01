import React from 'react'
import ReactDOM from 'react-dom'
const d3 = {...require('d3-axis'),
  ...require('d3-selection')}

// const duration = 250

class Axis extends React.Component {
  update (props) {
    const orient = props.orient
    const scale = props.scale
    const label = props.label
    const size = orient === 'bottom' ? props.size : -props.size

    this.d3Axis = orient === 'bottom' ? d3.axisBottom : d3.axisLeft
    const axis = this.d3Axis(scale).ticks(4)
    axis.tickSize(size)
    if (!label) axis.tickFormat('')
    this.d3Node.call(axis)
  }
  componentDidMount () {
    // wrap element in d3
    this.d3Node = d3.select(ReactDOM.findDOMNode(this))
    this.update(this.props)
  }
  shouldComponentUpdate (nextProps) {
    // if (nextProps.data.update) {
    this.update(nextProps)
    // // }
    // console.log('should')
    return true
  }

  componentDidUpate () {
    this.update(this.props)
    // console.log('didupdate')
  }

  render () {
    // console.log('render')
    const className = this.props.orient === 'bottom' ? 'x axis' : 'y axis'
    return (
      <g transform={this.props.transform} className={className} />
    )
  }
}

export default Axis
