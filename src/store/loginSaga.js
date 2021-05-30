import {
  call, put, takeEvery, all,
} from 'redux-saga/effects'

function getUser(params) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('请求模拟延迟', params)
      resolve({ id: '2013014045', name: 'huyong' })
    }, 2000)
  })
}

function getPermission(params) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('请求模拟延迟', params)
      resolve({ pageRouter: ['/hoc', '/context', '/redux', '/react-redux'] })
    }, 2000)
  })
}

function* loginHandle(action) {
  console.log('action', action)
  const res1 = yield call(getUser, '111')
  console.log('login1', res1)
  const res2 = yield call(getPermission, '222')
  console.log('login2', res2)
  const userInfo = { ...res1, ...res2 }
  yield put({
    type: 'login',
    userInfo,
  })
  // 备份用户登陆信息到sessionStorage
  sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
}

function* loginSaga() {
  yield takeEvery('loginSaga', loginHandle)
  // 等同于
  //  const action = yield take("loginSaga");
  //  yield fork(loginHandle, action);
}

// 多个saga组合
export function* rootSaga() {
  yield all([loginSaga()])
}

export default loginSaga
