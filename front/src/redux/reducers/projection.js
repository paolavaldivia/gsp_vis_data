import { SELECT_PROJECTION, REQUEST_PROJECTION, RECEIVE_PROJECTION, HIGHLIGHT_SAMPLE, UNHIGHLIGHT_SAMPLE,
  SELECT_SAMPLE, UNSELECT_SAMPLE, UPDATE_SELECTIONS } from 'redux/actions/types'

export const projection = (
  state = {
    isFetching: false,
    data: [],
    vars: [],
    labeled: false,
    name: 'pca',
    anySelected: false
  },
  action
) => {
  switch (action.type) {
    case SELECT_PROJECTION:
      return Object.assign({}, state, {
        name: action.name
      })
    case REQUEST_PROJECTION:
      return Object.assign({}, state, {
        isFetching: true
      })
    case RECEIVE_PROJECTION:
      return Object.assign({}, state, {
        isFetching: false,
        data: action.data,
        vars: action.vars,
        labeled: action.labeled,
        lastUpdated: action.receivedAt
      })
    case HIGHLIGHT_SAMPLE:
      return Object.assign({}, state, {
        data: state.data.map(d => d.id === action.d.id
          ? { ...d, highlighted: true, faded: false }
          : { ...d, faded: true }
        )
      })
    case UNHIGHLIGHT_SAMPLE:
      return Object.assign({}, state, {
        data: state.data.map(d => d.id === action.d.id
          ? { ...d, highlighted: false }
          : { ...d, faded: state.anySelected }
        )
      })
    case SELECT_SAMPLE:
      return Object.assign({}, state, {
        data: state.data.map(d => d.id === action.d.id
          ? { ...d, selected: true, faded: false }
          : { ...d, faded: true }
        ),
        anySelected: state.data.some((d) => d.selected)
      })
    case UNSELECT_SAMPLE:
      return Object.assign({}, state, {
        data: state.data.map(d => d.id === action.d.id
          ? { ...d, selected: false }
          : { ...d, faded: false }
        )
      })
    case UPDATE_SELECTIONS:
      return Object.assign({}, state, {
        anySelected: state.data.some((d) => d.selected)
      })
    default:
      return state
  }
}
