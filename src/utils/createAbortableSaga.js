import { effects } from 'redux-saga'

export const CANCEL_SAGAS = "CANCEL_SAGAS";

const createAbortableSaga = (function currySaga(){
  if (process.env.NODE_ENV !== 'development'){
    return function(watcher){
      return watcher;
    }
  }else{
    return function(watcher){
      return function* main () {
          const sagaTask = yield effects.fork(watcher);
          yield effects.take(CANCEL_SAGAS);
          yield effects.cancel(sagaTask);
      };
    }
  }
})()

export default createAbortableSaga;
