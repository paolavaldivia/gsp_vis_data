import fetch from 'isomorphic-fetch'
import {
  SELECT_PROJECTION,
  REQUEST_PROJECTION,
  RECEIVE_PROJECTION
} from 'redux/actions/types'
import {processData} from './utils'

export function selectProjection (name) {
  return {
    type: SELECT_PROJECTION,
    name
  }
}

export function requestProjection (name) {
  return {
    type: REQUEST_PROJECTION,
    name
  }
}

export function receiveProjection (text) {
  const dataset = processData(text)
  return {
    type: RECEIVE_PROJECTION,
    status: 'success',
    data: dataset,
    vars: dataset.columns,
    labeled: dataset.labeled,
    receivedAt: Date.now()
  }
}

export function fetchProjection (name) {
  return function dispatch_ (dispatch) {
    dispatch(requestProjection(name))
    console.log('name', name)
    return fetch(`http://localhost:5000/projection?projection=` + name)
      .then(
        response => response.text(),
        error => console.log('An error occured.', error)
      )
      .then(text => {
        return dispatch(receiveProjection(text))
      })
  }
}
