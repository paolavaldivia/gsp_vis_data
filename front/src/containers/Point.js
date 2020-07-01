import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import PointVis from 'components/visualizations/PointVis'
import {showTooltip, hideTooltip, setTooltip} from 'redux/actions/tooltip'
import {highlightSample, selectSample, unhighlightSample, unselectSample} from 'redux/actions/interactions'
const d3 = { ...require('d3-selection'),
  ...require('d3-transition') }

class Point extends React.Component {
  componentDidMount () {
    // wrap element in d3
    this.d3Node = d3.select(ReactDOM.findDOMNode(this))
    this.d3Node.datum(this.props.data)
      .on('click', this._onMouseClick.bind(this))
      .on('mouseover', this._onMouseOver.bind(this))
      .on('mouseout', this._onMouseLeave.bind(this))
      .call(PointVis.enter)
  }

  shouldComponentUpdate (nextProps) {
    // if (nextProps.data.update) {
    this.d3Node.datum(nextProps.data)
      .call(PointVis.update)
    // }
    return true
  }

  componentDidUpate () {
    this.d3Node.datum(this.props.data)
      .call(PointVis.update)
  }

  componentWillUnMount () {

  }

  _onMouseClick () {
    const d = this.props.data
    if (!d.id) return
    if (d.d && d.d.selected) {
      this.props.unselectSample(d)
    } else {
      this.props.selectSample(d)
    }
  }
  _onMouseOver () {
    const d = this.props.data
    // e.stopPropagation()
    if (!d.id) return
    console.log(d['d'])
    // const tooltip = d['d']['name'] + ': ' + d.x.toPrecision(3) + ' ' + d.y.toPrecision(3)
    this.props.highlightSample(d)
    // this.props.setTooltip(tooltip, e.pageX, e.pageY)
  }
  _onMouseLeave () {
    const d = this.props.data
    if (!d.id) return
    if (d.d && d.d.selected) return
    this.props.unhighlightSample(d)
    // this.props.hideTooltip()
  }

  render () {
    // const d = this.props.data
    return (
      <g className='point'>
        <circle className='back' />
        <circle className='front' />
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
    setTooltip: (content, x, y) => {
      dispatch(setTooltip(content))
      dispatch(showTooltip(x, y))
    },
    hideTooltip: () => (dispatch(hideTooltip())),
    highlightSample: (d) => (dispatch(highlightSample(d))),
    unhighlightSample: (d) => (dispatch(unhighlightSample(d))),
    selectSample: (d) => (dispatch(selectSample(d))),
    unselectSample: (d) => (dispatch(unselectSample(d)))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Point)
