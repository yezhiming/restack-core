 const createReducer = (initialState, handlers) => {
  return function(state = initialState, action) {
    if(handlers.hasOwnProperty(action.type)){
      return handlers[action.type](state, action);
    } else if (handlers.hasOwnProperty('default')){
      return handlers['default'](state, action);
    } else {
      return state;
    }
  }
}

export default createReducer
