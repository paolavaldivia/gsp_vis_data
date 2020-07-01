import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import LineVis from 'components/visualizations/LineVis'
import Point from 'containers/Point'
import Axis from 'components/visualizations/Axis'

const d3 = { ...require('d3-selection'),
  ...require('d3-transition'),
  ...require('d3-scale'),
  ...require('d3-array'),
  ...require('d3-shape')}

class LineChart extends React.Component {
  constructor (props) {
    super(props)
    this.scaleX = d3.scaleLinear()
    this.scaleY = d3.scaleLinear()
    this.w = 0
    this.h = 0
    this.padding = 20
    this.d = {}
  }
  update (props) {
    const data = props.data
    const x = props.x
    const y = props.y
    const width = props.width
    const height = props.height

    this.w = Math.max(width - this.padding * 2, 0)
    this.h = Math.max(height - this.padding * 2, 0)

    this.scaleX.range([0, this.w]).domain(d3.extent(data, d => d[x]))
    this.scaleY.range([this.h, 0]).domain(d3.extent(data, d => d[y]))

    // define the line
    const valueLine = d3.line()
      .x(d => this.scaleX(d[x]))
      .y(d => this.scaleY(d[y]))

    const _data = data.map((d) => {
      return {
        '_x': this.scaleX(d[x]),
        '_y': this.scaleY(d[y]),
        'd': d,
        '_r': 2,
        'color': 'indianred'
      }
    })

    this.points = _data.map((d, i) => {
      return (<Point data={d} key={i} />)
    })
    this.d.color = 'green'
    this.d.path = valueLine(data)
  }
  componentDidMount () {
    this.update(this.props)
    // wrap element in d3
    this.d3Node = d3.select(ReactDOM.findDOMNode(this))
    this.d3Node.datum(this.d)
    // .on('mouseover', (e) => console.log(e))
      .call(LineVis.enter)
  }

  shouldComponentUpdate (nextProps) {
    this.update(nextProps)
    // if (nextProps.data.update) {
    this.d3Node.datum(this.d)
      .call(LineVis.update)
    // }
    return true
  }

  componentDidUpate () {
    this.update(this.props)
    this.d3Node.datum(this.d)
      .call(LineVis.update)
  }

  componentWillUnMount () {
  }

  render () {
    if (!this.props.data || this.props.data.lenght === 0) { return null }
    const width = this.props.width
    const height = this.props.height
    const svgStyle = {
      width: isNaN(width) ? 0 : width,
      height: isNaN(height) ? 0 : height,
      padding: this.padding
    }
    return (
      <div style={{width: '100%', height: '100%'}}>
        <svg style={svgStyle}>
          <g className='line-chart'>
            <rect className='chart-container' width={this.w} height={this.h} />
            <Axis orient='left' label size={this.w} scale={this.scaleY} />
            <Axis orient='bottom' label size={this.h} scale={this.scaleX} />
            <path className='line' />
            {this.points}
          </g>
        </svg>
      </div>
    )
  }
}

LineChart.propTypes = {
  data: PropTypes.array,
  width: PropTypes.number,
  height: PropTypes.number,
  x: PropTypes.string,
  y: PropTypes.string
}

export default LineChart
