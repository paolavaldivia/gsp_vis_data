import React from 'react'
import PropTypes from 'prop-types'
import Bar from 'containers/Bar'
import Axis from 'components/visualizations/Axis'
const d3 = { ...require('d3-scale'),
  ...require('d3-array')}

const Hist = (props) => {
  // if (!props.data || props.data.lenght === 0) return null
  const data = props.data
  const width = props.width
  const height = props.height
  const x = props.x
  const y = props.y
  const axisLeft = props.axisLeft
  const axisBottom = props.axisBottom
  const transform = props.transform
  const title = props.title

  const padding = 10
  const w = width - padding * 2
  const h = height - padding * 2

  const binCount = 8
  const [min, max] = d3.extent(data, d => d[x])

  const scaleX = d3.scaleLinear().range([0, Math.max(w, 0)])
  const scaleY = d3.scaleLinear().range([Math.max(h, 0), padding])
  scaleX.domain([min, max])
  scaleY.domain(d3.extent(data, d => d[y]))

  const histogram = d3.histogram()
    .value(d => d[x])
    .domain(scaleX.domain())
    .thresholds(d3.range(min, max, (max - min) / binCount))

  const bins = histogram(data)

  const scaleYH = d3.scaleLinear().range([h, padding])
  scaleYH.domain([0, d3.max(bins, d => d.length)])

  const dWidth = bins.length > 1 ? scaleX(bins[0].x1) - scaleX(bins[0].x0) : 2
  const _data = bins.map(d => {
    return {
      'width': Math.max(dWidth - 2, 0),
      'height': Math.max(h - scaleYH(d.length), 0),
      'x': isNaN(scaleX(d.x0)) ? 0 : scaleX(d.x0),
      'y': isNaN(scaleYH(d.length)) ? 0 : scaleYH(d.length)
    }
  })
  const bars = _data.map((d, i) => {
    return (<Bar data={d} height={height} key={'b' + i} />)
  })

  return (
    <g transform={transform}>
      <rect className='chart-container' width={Math.max(w, 0)} height={Math.max(h, 0)} />
      <Axis orient='left' label={axisLeft} size={w} scale={scaleY} />
      <Axis orient='bottom' label={axisBottom} size={h} scale={scaleX} />
      {bars}
      <text transform={'translate(2,' + (2 + padding / 2) + ')'}>{title}</text>
    </g>
  )
}

Hist.propTypes = {
  data: PropTypes.array,
  width: PropTypes.number,
  height: PropTypes.number,
  title: PropTypes.string,
  x: PropTypes.string,
  y: PropTypes.string,
  axisLeft: PropTypes.bool,
  axisBottom: PropTypes.bool,
  transform: PropTypes.string
}

export default Hist
