export App from './containers/Root'
export configureStore from './store/configureStore'

export function requireAll(requireContext) {
  return requireContext.keys().map(requireContext);
}

export function requireAllAsObject(requireContext) {
  return requireContext.keys().reduce(function(all, each){
    var e = requireContext(each).default
    return {...e, ...all}
  }, {})
}

export createReducer from './utils/createReducer'

export {makeActionType,makeCallAPI,makeBaseApi,makeBaseActionType,bindAction} from './utils/reduxHelper'

export { Request ,callAPI} from './utils/request'

export i18n from './i18n'
