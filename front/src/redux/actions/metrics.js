import fetch from 'isomorphic-fetch'
import {
  REQUEST_METRICS,
  RECEIVE_METRICS
} from 'redux/actions/types'

export function requestMetrics (metrics) {
  return {
    type: REQUEST_METRICS,
    metrics
  }
}

const processData = (json) => {
  const data = json
  return data
}

export function receiveMetrics (json) {
  const resp = processData(json)
  return {
    type: RECEIVE_METRICS,
    status: 'success',
    metrics: resp,
    receivedAt: Date.now()
  }
}

export function fetchMetrics (name) {
  return function dispatch_ (dispatch) {
    dispatch(requestMetrics(name))
    return fetch(`http://localhost:5000/metrics`)
      .then(
        response => response.json(),
        error => console.log('An error occured.', error)
      )
      .then(json => {
        return dispatch(receiveMetrics(json))
      })
  }
}
