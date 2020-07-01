import { HIGHLIGHT_SAMPLE, UNHIGHLIGHT_SAMPLE, SELECT_SAMPLE, UNSELECT_SAMPLE, UPDATE_SELECTIONS, SHOW_LINKS, HIDE_LINKS } from 'redux/actions/types'

export function highlightSample (d) {
  return {
    type: HIGHLIGHT_SAMPLE,
    d
  }
}

export function unhighlightSample (d) {
  return {
    type: UNHIGHLIGHT_SAMPLE,
    d
  }
}

export function selectSample (d) {
  return function (dispatch) {
    dispatch({
      type: SELECT_SAMPLE,
      d
    })
    dispatch({
      type: UPDATE_SELECTIONS
    })
  }
}

export function unselectSample (d) {
  return function (dispatch) {
    dispatch({
      type: UNSELECT_SAMPLE,
      d
    })
    dispatch({
      type: UPDATE_SELECTIONS
    })
  }
}

export function showLinks () {
  return {
    type: SHOW_LINKS
  }
}

export function hideLinks () {
  return {
    type: HIDE_LINKS
  }
}
