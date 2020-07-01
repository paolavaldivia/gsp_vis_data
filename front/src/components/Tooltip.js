import React from 'react'
import PropTypes from 'prop-types'
import { tooltip } from 'styles/tooltip.scss'

const { string, bool, number } = PropTypes

const Tooltip = (props) => {
  const divStyle = {
    visibility: props.visible ? 'visible' : 'hidden',
    left: props.x + 'px',
    top: props.y + 'px'
  }
  return (
    <div className={tooltip} style={divStyle}>
      {props.content}
    </div>
  )
}

Tooltip.propTypes = {
  content: string,
  visible: bool,
  x: number,
  y: number
}

export default Tooltip
