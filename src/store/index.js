// import { createStore } from 'redux'
import thunk from 'redux-thunk'
import createSagaMiddleWare from 'redux-saga'
import loginSaga from './loginSaga'
import { createStore, combineReducers, applyMiddleware } from '../pages/ReduxPage/k-redux'
import counterReducer from './countReducer'
import userInfoReducer from './userInfoReducer'

// 由于刷新会丢失内存数据，所以登陆时将用户信息备份至sessionStorage,初始化时读取sessionStorage里用户信息
const userInfo = JSON.parse(sessionStorage.getItem('userInfo')) || undefined

// 创建saga
const sagaMiddleware = createSagaMiddleWare()

const store = createStore(
  combineReducers({ count: counterReducer, userInfo: userInfoReducer }),
  { userInfo },
  applyMiddleware(thunk, sagaMiddleware),
)

// 运行saga
sagaMiddleware.run(loginSaga)

// const store = createStore(counterReducer)
export default store
