import fetch from 'isomorphic-fetch'
import {
  REQUEST_F_DATA,
  RECEIVE_F_DATA
} from 'redux/actions/types'
import {processData} from './utils'
import {fetchFProjection} from 'redux/actions/fprojection'

export function requestFilteredData (filter) {
  return {
    type: REQUEST_F_DATA,
    filter
  }
}

export function receiveFilteredData (text) {
  const dataset = processData(text)
  return {
    type: RECEIVE_F_DATA,
    status: 'success',
    data: dataset,
    vars: dataset.columns,
    labeled: dataset.labeled,
    receivedAt: Date.now()
  }
}

export function fetchFilteredData () {
  return function dispatch_ (dispatch, getState) {
    dispatch(requestFilteredData())
    return fetch(`http://localhost:5000/filtered`)
      .then(
        response => response.text(),
        error => console.log('An error occured.', error)
      )
      .then(json => {
        return dispatch(receiveFilteredData(json))
      })
      .then(() => {
        const projection = getState().get('projection')['name']
        return dispatch(fetchFProjection(projection))
      })
  }
}
