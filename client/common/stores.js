import initialState           from './initialState'
import thunk                  from 'redux-thunk'
import createLogger           from 'redux-logger'

import blogReducer from 'reducer/blogReducer'


const logger = createLogger({
  // Options
  duration: true,
  collapsed: true,
  diff: true
})

import { createStore, combineReducers, applyMiddleware } from 'redux'
import { browserHistory } from 'react-router'
import { syncHistoryWithStore, routerReducer } from 'react-router-redux'

/**
 * ROOT REDUCERS
 */
const rootReducer = combineReducers({
  routing: routerReducer,
  blog: blogReducer
  // TODO: all other reducers
})

/** store and middleware */
let createStoreWithMiddleware = applyMiddleware(thunk, logger)(createStore)
let stores = createStoreWithMiddleware(rootReducer, initialState())

/** sync history with routes */
const history = syncHistoryWithStore(browserHistory, stores)

/**
 * EXPORTS
 */
export {
  stores,
  history
}
