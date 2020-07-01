import React from 'react'
import PropTypes from 'prop-types'
import Axis from 'components/visualizations/Axis'
import Line from 'containers/Line'
import chart from 'styles/chart.scss'
const d3 = { ...require('d3-scale'),
  ...require('d3-shape'),
  ...require('d3-array'),
  ...require('d3-scale-chromatic')}

const ParallelCoordinates = (props) => {
  if (props.vars.length > 15) {
    return (
      <div className={chart.chart} style={{width: '100%', height: '100%'}}>
        <h4> {props.title} </h4>
      </div>
    )
  }

  const data = props.data
  const width = props.width
  const vars = props.vars
  let height = props.height
  height = props.title ? height - 40 : height
  height = Math.max(height, 0)

  const padding = 20

  const w = Math.max(width - padding * 2, 0)
  const h = Math.max(height - padding * 2, 0)

  const scaleV = d3.scalePoint().range([0, w]).domain(vars)
  const scalesY = vars.map((vi) => {
    return d3.scaleLinear()
      .range([h, 0])
      .domain(d3.extent(data, d => d[vi]))
  })
  const scaleColor = d3.scaleOrdinal(d3.schemeAccent)

  const path = (d) => d3.line()(vars.map((vi, i) => [scaleV(vi), scalesY[i](d[vi])]))

  const svgStyle = {
    width: isNaN(width) ? 0 : width,
    height: isNaN(height) ? 0 : height,
    padding: padding
  }

  const lines = data.map((d, i) => {
    const _d = {
      path: path(d),
      color: props.labeled ? scaleColor(d.label) : 'green',
      d: d,
      id: d.id
    }
    return (
      <Line key={i} data={_d} />
    )
  })

  const axis = vars.map((vi, i) => {
    return (
      <Axis orient='left' label key={i} scale={scalesY[i]} size={10} transform={'translate(' + scaleV(vi) + ', 0)'} />
    )
  })
  const titles = vars.map((vi, i) => {
    return (
      <text key={'t' + i} style={{fontSize: 10}} transform={'translate(' + scaleV(vi) + ',' + (10 * (i % 2)) + ')'}>
        {vi}
      </text>
    )
  })
  return (
    <div className={chart.chart} style={{width: '100%', height: '100%'}}>
      <h4> {props.title} </h4>
      <svg style={svgStyle}>
        {lines}
        {axis}
        {titles}
      </svg>
    </div>
  )
}

ParallelCoordinates.propTypes = {
  data: PropTypes.array,
  labeled: PropTypes.bool,
  vars: PropTypes.array,
  width: PropTypes.number,
  height: PropTypes.number,
  title: PropTypes.string
}

export default ParallelCoordinates
