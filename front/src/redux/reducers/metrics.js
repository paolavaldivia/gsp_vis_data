import {REQUEST_METRICS, RECEIVE_METRICS} from 'redux/actions/types'

export const metrics = (
  state = {
    isFetching: false,
    metrics: {}
  },
  action
) => {
  switch (action.type) {
    case REQUEST_METRICS:
      return Object.assign({}, state, {
        isFetching: true
      })
    case RECEIVE_METRICS:
      return Object.assign({}, state, {
        isFetching: false,
        metrics: action.metrics,
        lastUpdated: action.receivedAt
      })
    default:
      return state
  }
}
