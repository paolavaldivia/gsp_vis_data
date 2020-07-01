import React from 'react'
import PropTypes from 'prop-types'
import ScatterPlot from 'components/ScatterPlot'
import chart from 'styles/chart.scss'

const ScatterPlotChart = (props) => {
  const data = props.data
  const links = props.links
  const linksVisible = props.linksVisible
  const width = props.width
  const x = props.x
  const y = props.y
  let height = props.height
  height = props.title ? height - 40 : height
  height = Math.max(height, 0)

  const padding = 20
  const size = Math.min(width, height)

  const svgStyle = {
    width: isNaN(size) ? 0 : size,
    height: isNaN(size) ? 0 : size,
    padding: padding
  }
  const contetnSize = size - padding * 2
  return (
    <div className={chart.chart} style={{width: '100%', height: '100%'}}>
      <h4> {props.title} </h4>
      <svg style={svgStyle}>
        <ScatterPlot labeled={props.labeled}
          links={links} linksVisible={linksVisible}
          width={contetnSize} height={contetnSize} data={data} y={y} x={x}
          axisLeft axisBottom />
      </svg>
    </div>
  )
}

ScatterPlotChart.propTypes = {
  data: PropTypes.array,
  labeled: PropTypes.bool,
  x: PropTypes.string,
  y: PropTypes.string,
  title: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  links: PropTypes.array,
  linksVisible: PropTypes.bool
}

export default ScatterPlotChart
