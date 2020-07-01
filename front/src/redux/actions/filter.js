import fetch from 'isomorphic-fetch'
import {
  SELECT_FILTER,
  REQUEST_FILTER,
  RECEIVE_FILTER
} from 'redux/actions/types'
const d3 = {...require('d3-dsv')}

export function selectFilter (filter, alpha, beta, c) {
  return {
    type: SELECT_FILTER,
    filter,
    alpha,
    beta,
    c
  }
}

export function requestFilter (filter) {
  return {
    type: REQUEST_FILTER,
    filter
  }
}

const processData = (text) => {
  const data = d3.csvParse(text)
  data.forEach((d, i) => {
    d.id = i
    d.name = i
    data.columns.forEach(c => {
      d[c] = +d[c]
    })
  })
  return data
}

export function receiveFilter (text) {
  const dataset = processData(text)
  return {
    type: RECEIVE_FILTER,
    status: 'success',
    filter: dataset,
    vars: dataset.columns,
    receivedAt: Date.now()
  }
}

export function fetchFilter (name, alpha, beta, c) {
  alpha = alpha.length === 0 ? 0 : alpha
  beta = beta.length === 0 ? 0 : beta
  c = c.length === 0 ? 0 : c
  return function dispatch_ (dispatch) {
    dispatch(requestFilter(name))
    return fetch(`http://localhost:5000/filter?filter=` + name + `&alpha=` + alpha + `&beta=` + beta + `&c=` + c)
      .then(
        response => response.text(),
        error => console.log('An error occured.', error)
      )
      .then(json => {
        return dispatch(receiveFilter(json))
      })
  }
}
