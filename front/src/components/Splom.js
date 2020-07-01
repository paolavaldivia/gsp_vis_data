import React from 'react'
import PropTypes from 'prop-types'
import ScatterPlot from 'components/ScatterPlot'
import Hist from 'components/Hist'
import chart from 'styles/chart.scss'

const Splom = (props) => {
  if (props.vars.length > 8) {
    return (
      <div className={chart.chart} style={{width: '100%', height: '100%'}}>
        <h4> {props.title} </h4>
      </div>
    )
  }

  const data = props.data
  const labeled = props.labeled
  const width = props.width
  const vars = props.vars
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
  const nvars = vars.length
  const cellSize = (size - padding * 2) / nvars

  const scatterplots = vars.map((vi, i) => {
    const axisB = i === (nvars - 1)
    return vars.map((vj, j) => {
      const axisL = j === 0
      return (i !== j
        ? <ScatterPlot labeled={labeled} transform={'translate(' + cellSize * j + ',' + cellSize * i + ')'}
          width={cellSize} height={cellSize} data={data} y={vi} x={vj}
          axisLeft={axisL} axisBottom={axisB} />
        : <Hist transform={'translate(' + cellSize * j + ',' + cellSize * i + ')'}
          width={cellSize} height={cellSize} data={data} y={vi} x={vj} title={vi}
          axisLeft={axisL} axisBottom={axisB} />
      )
    })
  })
  return (
    <div className={chart.chart} style={{width: '100%', height: '100%'}}>
      <h4> {props.title} </h4>
      <svg style={svgStyle}>
        {scatterplots}
      </svg>
    </div>
  )
}

Splom.propTypes = {
  data: PropTypes.array,
  labeled: PropTypes.bool,
  vars: PropTypes.array,
  width: PropTypes.number,
  height: PropTypes.number,
  title: PropTypes.string
}

export default Splom
