import { SHOW_TOOLTIP, HIDE_TOOLTIP, TOOLTIP_CONTENT } from 'redux/actions/types'

export const tooltip = (state = {
  content: '',
  isVisible: false,
  x: 0,
  y: 0
}, action) => {
  switch (action.type) {
    case SHOW_TOOLTIP:
      return Object.assign({}, state, {
        x: action.x,
        y: action.y,
        isVisible: true
      })
    case HIDE_TOOLTIP:
      return Object.assign({}, state, {
        isVisible: false
      })
    case TOOLTIP_CONTENT:
      return Object.assign({}, state, {
        content: action.content
      })
    default:
      return state
  }
}
