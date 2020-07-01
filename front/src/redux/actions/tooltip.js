import {
  SHOW_TOOLTIP, HIDE_TOOLTIP, TOOLTIP_CONTENT
} from 'redux/actions/types'

export function showTooltip (x, y) {
  return {
    type: SHOW_TOOLTIP,
    x: x,
    y: y
  }
}

export function hideTooltip () {
  return {
    type: HIDE_TOOLTIP
  }
}

export function setTooltip (content) {
  return {
    type: TOOLTIP_CONTENT,
    content: content
  }
}
