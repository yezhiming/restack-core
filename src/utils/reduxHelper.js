import {bindActionCreators} from 'redux'
import _ from 'lodash'
import {CALL_API} from '../middlewares/api'

/**
 * generate RSAA three action type
 * 生成RSAA标准的三个action状态
 * @param  {[string]} type [the action indetifier, pls UpperCase before you call this method]
 * @return {[object]}      [object with three action types]
 */
export function makeActionType(type) {
	let upper = _.toUpper(type).trim();
	let result = {
		request: upper + "_REQUEST",
		success: upper + "_SUCCESS",
		fail: upper + "_FAILURE"
	};
	result.types = _.values(result);
	return result;
}

/**
 * generate RSAA standard action for user
 * 生成RSAA标准action
 * @param  {[object]} options [RSAA options]
 * @return {[object]}         [reduxh dispatchable action]
 */
export function makeCallAPI(options) {
	return (body) => {
		console.log('call api')
		if(body && (body.adds || _.isNumber(body.adds))){ //request with adds
			options.body = body.body;
			options.adds = body.adds;
		}
		else if(body){
			if (body) options.body = body;
		}
		return {
			[CALL_API]: options
		}
	}
}

/**
 * automatic generate basic action(CRUD)
 * 自动生成 CRUD action
 * @param  {[string]} type [the action indetifier]
 * @param  {[string]} url  [url to interact]
 * @return {[object]}      [action body]
 */
export function makeBaseApi(type,url){
	const BASE_TYPE_NAME = _.toUpper(type).trim();
	const types = makeBaseActionType(type);

	const getReq = makeCallAPI({
	  endpoint: url,
	  method: 'GET',
	  types: types.getType.types
	});

	const postReq = makeCallAPI({
		endpoint: url,
		method: 'POST',
		types: types.postType.types
	});

	const getOneReq = function(id){
		return makeCallAPI({
		  endpoint: url + "/" + id,
		  method: 'GET',
		  types: types.getType.types
		})();
	}

	const deleteReq = function(id,adds){
		return makeCallAPI({
		  endpoint: url+ '/' + id,
		  method: 'DELETE',
		  types: types.deleteType.types
		})({adds});
	}

	const putReq = function(id, data){
		return makeCallAPI({
		  endpoint: url + "/" + id,
			method: 'PUT',
		  types: types.putType.types
		})(data);
	}

	const result = {
		get : getReq,
		getOne: getOneReq,
		put : putReq,
		post : postReq,
		delete : deleteReq,
		_type: 'actionHelper'
	}
	return Object.assign({},result,types);
}

/**
 * generate CRUD action type
 * 生成CRUD action
 * type structure
 * {
 * 	[your uppercased type string]+"_GET/_POST/.etc": [REAL_TYPE] (obj with three types)
 * }
 *
 * @param  {[type]} type [description]
 * @return {[object]}      [return object ]
 */
export function makeBaseActionType(type){
	const BASE_TYPE_NAME = _.toUpper(type).trim();

	const getStr = BASE_TYPE_NAME+"_GET";
	const getOneStr = BASE_TYPE_NAME+"_GET_ONE";
	const postStr = BASE_TYPE_NAME+"_POST";
	const deleteStr = BASE_TYPE_NAME+"_DELETE";
	const putStr = BASE_TYPE_NAME+"_PUT";

	const GET_TYPE = makeActionType(getStr);
	const GET_ONE_TYPE = makeActionType(getOneStr);
	const POST_TYPE = makeActionType(postStr);
	const DELETE_TYPE = makeActionType(deleteStr);
	const PUT_TYPE = makeActionType(putStr);

	return {
		getType: GET_TYPE,
		getOneType: GET_ONE_TYPE,
		postType: POST_TYPE,
		deleteType: DELETE_TYPE,
		putType: PUT_TYPE
	}
}

/**
 *	bindAction with generated CRUD actions for page/components
 *	为 页面/组件 绑定包含 makeDefaultApi 生成的CRUD的action
 * @param  {[type]} actions  [description]
 * @param  {[type]} dispatch [description]
 * @return {[type]}          [description]
 */
export function bindAction(actions, dispatch){
  var injectObj = {};
  for(var key in actions){
    if(actions[key]._type){
      injectObj = Object.assign({}, injectObj, actions[key])
    }
  }
  const newAction = Object.assign({}, actions, injectObj);
  return bindActionCreators(newAction, dispatch);
}

// /**
//  * @TODO
//  * [generateBaseReducer description]
//  * @param  {[type]} initialState [description]
//  * @param  {[type]} key          [description]
//  * @return {[type]}              [description]
//  */
// export function makeBaseReducer(initialState,type){
// 	const BASE_TYPE_NAME = _.toUpper(type).trim();
//
// 	const types = makeBaseActionType(type);
//
// 	var options = {}
//
// 	for(var key in types){
// 		optioins[types[key].success] = (state, action) => {
// 			if(!action.payload){
// 				console.error('no payload in action, check whether your response is correct');
// 				return state;
// 			}
// 			if(typeof action.payload === 'object'){
// 				return action.payload;
// 			}
// 		}
// 	}
//
//   return createReducer(initialState,{
// 		[GET_TYPE]:function(state, action){
//
// 		}
//   })
// }
