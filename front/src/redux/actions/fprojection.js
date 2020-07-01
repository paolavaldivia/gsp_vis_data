import fetch from 'isomorphic-fetch'
import {
  SELECT_F_PROJECTION,
  REQUEST_F_PROJECTION,
  RECEIVE_F_PROJECTION
} from 'redux/actions/types'
import {processData} from './utils'
import {fetchMetrics} from 'redux/actions/metrics'

export function selectProjection (name) {
  return {
    type: SELECT_F_PROJECTION,
    name
  }
}

export function requestFProjection (name) {
  return {
    type: REQUEST_F_PROJECTION,
    name
  }
}

export function receiveFProjection (text) {
  const dataset = processData(text)
  return {
    type: RECEIVE_F_PROJECTION,
    status: 'success',
    data: dataset,
    vars: dataset.columns,
    labeled: dataset.labeled,
    receivedAt: Date.now()
  }
}

export function fetchFProjection (name) {
  return function dispatch_ (dispatch) {
    dispatch(requestFProjection(name))
    console.log('name', name)
    return fetch(`http://localhost:5000/fprojection?projection=` + name)
      .then(
        response => response.text(),
        error => console.log('An error occured.', error)
      )
      .then(text => {
        return dispatch(receiveFProjection(text))
      })
      .then(() => {
        return dispatch(fetchMetrics())
      })
  }
}
