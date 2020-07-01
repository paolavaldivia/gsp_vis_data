import React from 'react'
import PropTypes from 'prop-types'
import Point from 'containers/Point'
import Link from 'containers/Link'
import Axis from 'components/visualizations/Axis'
const d3 = { ...require('d3-scale'),
  ...require('d3-array'),
  ...require('d3-scale-chromatic')}

class ScatterPlot extends React.Component {
  render () {
    const props = this.props
    const data = props.data
    // const links = props.links
    const width = props.width
    const height = props.height
    const x = props.x
    const y = props.y
    const axisLeft = props.axisLeft
    const axisBottom = props.axisBottom
    const transform = props.transform
    const labeled = props.labeled

    const padding = 10
    const scaleX = d3.scaleLinear().range([0, width - padding * 2])
    const scaleY = d3.scaleLinear().range([height - padding * 2, 0])
    scaleX.domain(d3.extent(data, d => d[x]))
    scaleY.domain(d3.extent(data, d => d[y]))

    const scaleColor = d3.scaleOrdinal(d3.schemeAccent)

    const _data = data.map((d) => {
      return {
        '_x': scaleX(d[x]),
        '_y': scaleY(d[y]),
        '_r': 3,
        'x': d[x],
        'y': d[y],
        'id': d.id,
        'd': d,
        'color': labeled ? scaleColor(d.label) : 'green'
      }
    })

    const points = _data.map((d) => {
      return (<Point data={d} key={d.id} size={height} />)
    })

    var links = []

    if (props.linksVisible) {
      const _links = props.links.map((d) => {
        return {
          'x1': scaleX(data[parseInt(d[0])][x]),
          'x2': scaleX(data[parseInt(d[1])][x]),
          'y1': scaleY(data[parseInt(d[0])][y]),
          'y2': scaleY(data[parseInt(d[1])][y])
        }
      })
      links = _links.map((d, i) => {
        return (<Link data={d} key={i} />)
      })
    }

    // const svgStyle = {
    //   width: isNaN(width) ? 0 : width,
    //   height: isNaN(height) ? 0 : height,
    //   padding: padding
    // }
    return (
      <g transform={transform}>
        <rect className='chart-container' width={Math.max(width - padding * 2, 0)}
          height={Math.max(height - padding * 2, 0)} />
        <Axis orient='left' label={axisLeft} size={width - padding * 2} scale={scaleY} />
        <Axis orient='bottom' label={axisBottom} size={height - padding * 2} scale={scaleX} />
        { props.linksVisible && links }
        {points}
      </g>
    )
  }
}

ScatterPlot.propTypes = {
  data: PropTypes.array,
  labeled: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number,
  x: PropTypes.string,
  y: PropTypes.string,
  axisLeft: PropTypes.bool,
  axisBottom: PropTypes.bool,
  transform: PropTypes.string,
  linksVisible: PropTypes.bool,
  links: PropTypes.array
}

export default ScatterPlot
