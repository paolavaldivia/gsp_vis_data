import fetch from 'isomorphic-fetch'
import {
  SELECT_DATASET,
  REQUEST_DATA,
  RECEIVE_DATA, SET_NSAMPLES, SET_NFEATURES, SET_NCLASSES,
  SET_RANDOM,
  RECEIVE_LINKS
} from 'redux/actions/types'
import {processData} from './utils'
import {fetchFilter} from 'redux/actions/filter'
import {fetchFilteredData} from 'redux/actions/filteredData'
import {fetchProjection} from 'redux/actions/projection'

export function selectDataset (dataset) {
  return {
    type: SELECT_DATASET,
    dataset
  }
}

export function setNSamples (nSamples) {
  return {
    type: SET_NSAMPLES,
    nSamples
  }
}

export function setNFeatures (nFeatures) {
  return {
    type: SET_NFEATURES,
    nFeatures
  }
}

export function setNClasses (nClasses) {
  return {
    type: SET_NCLASSES,
    nClasses
  }
}

export function setRandom (random) {
  return {
    type: SET_RANDOM,
    random
  }
}

export function requestData (dataset, nSamples, nFeatures) {
  return {
    type: REQUEST_DATA,
    dataset,
    nSamples,
    nFeatures
  }
}

export function receiveData (text) {
  const dataset = processData(text)
  return {
    type: RECEIVE_DATA,
    status: 'success',
    data: dataset,
    vars: dataset.columns,
    labeled: dataset.labeled,
    receivedAt: Date.now()
  }
}

export function fetchData (dataset, nSamples, nFeatures) {
  return function dispatch_ (dispatch, getState) {
    const random = getState().get('dataset')['random']
    const randomStr = random ? `&random=` + random : ''
    const nClasses = getState().get('dataset')['nClasses']
    const classesStr = `&nClasses=` + nClasses
    dispatch(requestData(dataset, nSamples, nFeatures))
    return fetch(`http://localhost:5000/dataset?name=` + dataset + `&nSamples=` + nSamples + `&nFeatures=` + nFeatures + randomStr + classesStr)
      .then(
        response => response.text(),
        error => console.log('An error occured.', error)
      )
      .then(text => {
        return dispatch(receiveData(text))
      })
      .then(() => {
        const projection = getState().get('projection')['name']
        return dispatch(fetchProjection(projection))
      })
      .then(() => {
        const fname = getState().get('filter')['name']
        const falpha = getState().get('filter')['alpha']
        const fbeta = getState().get('filter')['beta']
        const fc = getState().get('filter')['c']
        return dispatch(fetchFilter(fname, falpha, fbeta, fc))
        // this.props.fetchFilter(this.props.filter, this.props.alpha, this.props.beta, this.props.c)
        // this.props.fetchFilteredData()
        // this.props.fetchProjection(this.props.projection)
        // this.props.fetchFilteredProjection(this.props.projection)
        // this.props.fetchMetrics()
      })
      .then(() => {
        return dispatch(fetchFilteredData())
      })
      .then(() => {
        return dispatch(fetchLinks())
      })
  }
}

export function receiveLinks (json) {
  const links = json
  return {
    type: RECEIVE_LINKS,
    status: 'success',
    links: links,
    receivedAt: Date.now()
  }
}

export function fetchLinks () {
  return function dispatch_ (dispatch, getState) {
    // dispatch(requestLinks())
    return fetch(`http://localhost:5000/links`)
      .then(
        response => response.json(),
        error => console.log('An error occured.', error)
      )
      .then(json => {
        return dispatch(receiveLinks(json))
      })
  }
}
