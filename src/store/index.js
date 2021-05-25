// import { createStore } from 'redux'
import { createStore, combineReducers } from '../pages/ReduxPage/k-redux'
import counterReducer from './countReducer'
import userInfoReducer from './userInfoReducer'

// 由于刷新会丢失内存数据，所以登陆时将用户信息备份至sessionStorage,初始化时读取sessionStorage里用户信息
const userInfo = JSON.parse(sessionStorage.getItem('userInfo')) || undefined
const store = createStore(combineReducers({ count: counterReducer, userInfo: userInfoReducer }), { userInfo })
// const store = createStore(counterReducer)
export default store
