import { combineReducers } from 'redux-immutable'
import { dataset } from './data'
import { tooltip } from './tooltip'
import { projection } from 'redux/reducers/projection'
import { fprojection } from 'redux/reducers/fprojection'
import { filter } from 'redux/reducers/filter'
import { filteredData } from 'redux/reducers/filteredData'
import { metrics } from 'redux/reducers/metrics'

const rootReducer = combineReducers(
  {
    dataset,
    tooltip,
    projection,
    filter,
    filteredData,
    fprojection,
    metrics
  }
)

export default rootReducer
