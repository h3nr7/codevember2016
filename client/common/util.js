import React          from 'react'
// import HtmlToReact    from 'html-to-react'
// import _              from 'underscore'

/**
 * create reducer
 * @param  {[type]} initialState [description]
 * @param  {[type]} reducerMap   [description]
 * @return {[type]}              [description]
 */
export function createReducer(initialState, reducerMap) {
    return (state, action) => {
        state = state || initialState;
        const reducer = reducerMap[action.type];
        return reducer ? reducer(state, action.payload) : state;
    };
}

/**
 * format response error
 * @param  {[type]} type    [description]
 * @param  {[type]} message [description]
 * @return {[type]}         [description]
 */
export function formatResponseError(type, payload) {
  let obj = payload.message
  let message = obj.message || 'unknown message'

  return { error: { type: type, message: message, raw: obj.error } }
}
