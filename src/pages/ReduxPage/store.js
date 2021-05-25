// import { createStore, combineReducers, applyMiddleware } from 'redux'
// import thunk from 'redux-thunk'
// import logger from 'redux-logger'
import { createStore, combineReducers, applyMiddleware } from './k-redux'

function myLogger(middleApi) {
  const { getState } = middleApi
  // 接收dispatch，返回新的函数，里面实现中间件功能，再调用原来的dispatch
  // 初始化的dispatch没打印state是因为初始化在createStore调用的是原生的dispatch
  console.log('初始化logger', getState())
  return (dispatch) => (action) => {
    console.log('logger state', getState())
    dispatch(action)
  }
}

function myThunk({ getState }) {
  return (dispatch) => (action) => {
    if (typeof action === 'function') {
      action(dispatch, getState)
      return
    }
    dispatch(action)
  }
}

const id = (state = 2013014045, action) => {
  // console.log('执行1', state, action)
  switch (action.type) {
    case 'add':
      return state + action.num
    case 'clearId':
      return 0
    default:
      return state
  }
}

const name = (state = 'huyong', action) => {
  // console.log('执行2', state, action)
  switch (action.type) {
    case 'setName':
      return action.name
    case 'clearName':
      return ''
    default:
      return state
  }
}

// const store = createStore(combineReducers({ id, name }), { id: 99, name: 'yyy' }, applyMiddleware(logger, thunk))
const store = createStore(combineReducers({ id, name }), { id: 99, name: 'yyy' }, applyMiddleware(myLogger, myThunk))

export default store
