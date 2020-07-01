import { SELECT_FILTER, REQUEST_FILTER, RECEIVE_FILTER } from 'redux/actions/types'

export const filter = (
  state = {
    isFetching: false,
    data: [],
    vars: [],
    name: 'low',
    alpha: 50,
    beta: 50,
    c: 0.5
  },
  action
) => {
  switch (action.type) {
    case SELECT_FILTER:
      return Object.assign({}, state, {
        name: action.filter,
        alpha: action.alpha,
        beta: action.beta,
        c: action.c
      })
    case REQUEST_FILTER:
      return Object.assign({}, state, {
        isFetching: true
      })
    case RECEIVE_FILTER:
      return Object.assign({}, state, {
        isFetching: false,
        data: action.filter,
        vars: action.vars,
        lastUpdated: action.receivedAt
      })
    default:
      return state
  }
}
