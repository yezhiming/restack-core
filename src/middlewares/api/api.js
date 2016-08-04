import callApi from '../../utils/request'
// import { Schema, arrayOf, normalize } from 'normalizr'
import CALL_API from './CALL_API'
import { isRSAA, validateRSAA } from './validation'

// 在RSAA上额外添加一个headers
// A Redux middleware that interprets actions with CALL_API info specified.
// Performs the call and promises when such actions are dispatched.
export default store => next => async action => {
  const callAPI = action[CALL_API];

  // Do not process actions without a [CALL_API] property
  if (!isRSAA(action)) {
    return next(action);
  }

  let { endpoint } = callAPI
  // const { schema, types } = callAPI
  const { method, body, credentials, bailout, types, headers, adds} = callAPI

  if (typeof endpoint === 'function') {
    endpoint = endpoint(store.getState())
  }

  if (typeof endpoint !== 'string') {
    throw new Error('Specify a string endpoint URL.')
  }
  // if (!schema) {
  //   throw new Error('Specify one of the exported Schemas.')
  // }
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected an array of three action types.')
  }
  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Expected action types to be strings.')
  }

  function actionWith(data) {
    const finalAction = Object.assign({}, action, data)
    delete finalAction[CALL_API]
    return finalAction
  }

  const [ requestType, successType, failureType ] = types
  next(actionWith({ type: requestType }))

  //修改,使用payload把data包起来, 把RSAA的body转成data
  return callApi(endpoint, { method, data: body, credentials, types, ...headers}).then(
    response => next(actionWith({
      payload: response.payload? response.payload : response,
      adds,
      type: successType
    })),
    error => next(actionWith({
      type: failureType,
      error: error.message || 'Something bad happened'
    }))
  )
}
