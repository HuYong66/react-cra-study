export const createStore = (reducer, initialState, enhancer) => {
  if (enhancer) {
    return enhancer(createStore)(reducer, initialState)
  }

  let currentState = initialState
  const callbacks = []
  const getState = () => currentState
  const subscribe = (callback) => {
    callbacks.push(callback)
    return () => {
      // console.log('解除subsribe监听')
      const index = callbacks.findIndex((item) => item === callback)
      callbacks.splice(index, 1)
    }
  }
  const dispatch = (action) => {
    currentState = reducer(currentState, action)
    callbacks.forEach((callback) => callback())
  }
  dispatch({ type: '@INIt/K-REDUX' })
  return { getState, subscribe, dispatch }
}

// 多reducer结合
export const combineReducers = (reducersObj) => (state = {}, action) => {
  const newState = {}
  Object.keys(reducersObj).forEach((key) => {
    newState[key] = reducersObj[key](state[key], action)
  })
  return newState
}

const compose = (...funcs) => {
  if (funcs.length === 0) {
    return (arg) => arg
  }
  if (funcs.length === 1) {
    return funcs[0]
  }
  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

// 中间件增强
export const applyMiddleware = (...middlewares) => (createStore1) => (reducer, initialState) => {
  const store = createStore1(reducer, initialState)
  let { dispatch } = store
  const middleApi = {
    getState: store.getState,
    dispatch,
  }
  const middlewareChain = middlewares.map((item) => item(middleApi))
  dispatch = compose(...middlewareChain)(dispatch)
  return { ...store, dispatch }
}

function bindActionCreator(creator, dispatch) {
  return (...args) => dispatch(creator(...args))
}

export function bindActionCreators(creators, dispatch) {
  const obj = {}
  Object.keys(creators).forEach((key) => {
    obj[key] = bindActionCreator(creators[key], dispatch)
  })
  return obj
}
