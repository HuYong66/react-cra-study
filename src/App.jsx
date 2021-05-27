import React, { useEffect } from 'react'
// import {
//   BrowserRouter as Router, Route, Link, Switch,
// } from 'react-router-dom'
import { Button } from 'antd'
import {
  BrowserRouter as Router, Route, Link, Switch,
} from './router/k-react-router-dom'
import { connect } from './pages/ReactReduxPage/k-react-redux'
// import { connect } from 'react-redux'
import logo from './logo.svg'
import './App.less'
import { Empty } from './pages'
import { constantRouters, dynamicUserRouters } from './router'

function App({ userInfo = {} }) {
  // const history = useHistory() // 无法获取到history, 路由底下的函数组件可以

  useEffect(() => {
    // 在页面加载时读取sessionStorage里的用户信息
    // if (sessionStorage.getItem('userInfo')) {
    //   if (dispatch) {
    //     console.log('页面加载初始化sessionStorage')
    //     dispatch({ type: 'init', sessionUserInfo: JSON.parse(sessionStorage.getItem('userInfo')) })
    //   }
    // }

    // 在页面刷新时将redux里的用户信息保存到sessionStorage里
    // !! 这里一直失败，原因是setItem时, userInfo还没有更新，拿不到值，另采用方法实现
    // const listenRefresh = () => {
    //   console.log('页面刷新存储sessionStorage')
    //   sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
    // }

    // 添加刷新监听
    // window.addEventListener('beforeunload', listenRefresh)
    // return () => {
    //   console.log('卸载刷新监听1111111111111111111111111111')
    //   window.removeEventListener('beforeunload', listenRefresh)
    // }
  }, [])
  // console.log('app-render', history, dispatch)

  return (
    <div className="App">
      <header className="App-header">
        <Button>测试</Button>
        <img src={logo} className="App-logo" alt="logo" />
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React &nbsp;
          {userInfo.name || '游客'}
        </a>
        <section>
          <Router>
            <Link to="/login">login</Link>
            /
            <Link to="/home">home</Link>
            /
            <Link to="/hoc">hoc</Link>
            /
            <Link to="/context">context</Link>
            /
            <Link to="/redux">redux</Link>
            /
            <Link to="/react-redux">react-redux</Link>
            <Switch>
              {dynamicUserRouters
                && dynamicUserRouters.filter((item) => userInfo.pageRouter && userInfo.pageRouter.includes(item.path))
                  .map((item, index) => (
                    <Route
                      key={index}
                      exact={item.exact || true}
                      path={item.path}
                      component={item.component}
                    />
                  ))}
              {constantRouters.map((item, index) => (
                <Route key={index} exact={item.exact || true} path={item.path} component={item.component} />
              ))}
              <Route component={Empty} />
            </Switch>
          </Router>
        </section>
      </header>
    </div>
  )
}

export default connect((state) => ({ userInfo: state.userInfo }))(App)
// export default App
