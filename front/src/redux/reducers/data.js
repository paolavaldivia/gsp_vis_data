import {
  SELECT_DATASET, REQUEST_DATA, RECEIVE_DATA,
  SET_NSAMPLES, SET_NFEATURES, SET_RANDOM, SET_NCLASSES,
  HIGHLIGHT_SAMPLE, UNHIGHLIGHT_SAMPLE, SELECT_SAMPLE, UNSELECT_SAMPLE,
  UPDATE_SELECTIONS, RECEIVE_LINKS, SHOW_LINKS, HIDE_LINKS
} from 'redux/actions/types'

export const dataset = (
  state = {
    isFetching: false,
    data: [],
    nSamples: 50,
    nFeatures: 5,
    vars: [],
    labeled: false,
    name: 'blobs',
    anySelected: false,
    links: [],
    linksVisible: false,
    random: undefined,
    nClasses: 3
  },
  action
) => {
  switch (action.type) {
    case SELECT_DATASET:
      return Object.assign({}, state, {
        name: action.dataset
      })
    case SET_NSAMPLES:
      return Object.assign({}, state, {
        nSamples: action.nSamples
      })
    case SET_NFEATURES:
      return Object.assign({}, state, {
        nFeatures: action.nFeatures
      })
    case SET_NCLASSES:
      return Object.assign({}, state, {
        nClasses: action.nClasses
      })
    case SET_RANDOM:
      return Object.assign({}, state, {
        random: action.random
      })
    case REQUEST_DATA:
      return Object.assign({}, state, {
        isFetching: true
      })
    case RECEIVE_DATA:
      return Object.assign({}, state, {
        isFetching: false,
        data: action.data,
        vars: action.vars,
        labeled: action.labeled,
        lastUpdated: action.receivedAt,
        links: []
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
    case RECEIVE_LINKS:
      return Object.assign({}, state, {
        links: action.links
      })
    case SHOW_LINKS:
      return Object.assign({}, state, {
        linksVisible: true
      })
    case HIDE_LINKS:
      return Object.assign({}, state, {
        linksVisible: false
      })
    default:
      return state
  }
}
