import React, { useEffect, useState } from 'react'
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
  // 无法获取到history, 路由底下的函数组件可以
  // ！！问题解决思路，拿不到history是因为不在router下，拿不到context，考虑使用嵌套路由再套一层
  // <Router><Route componet={现在APP里的内容}></Router> 这样就能拿到history，然后存放在window全局对象里使用了
  // const history = useHistory()

  const [num, setNum] = useState(0)

  useEffect(() => {
    // 在页面加载时读取sessionStorage里的用户信息
    // if (sessionStorage.getItem('userInfo')) {
    //   if (dispatch) {
    //     console.log('页面加载初始化sessionStorage')
    //     dispatch({ type: 'init', sessionUserInfo: JSON.parse(sessionStorage.getItem('userInfo')) })
    //   }
    // }

    // 在页面刷新时将redux里的用户信息保存到sessionStorage里
    // !! 这里一直失败，原因是setItem时, userInfo还没有更新，拿不到值，已另采用方法实现，在store生成时拿值，在登陆时赋值
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
  // console.log('app-render')

  return (
    <div className="App">
      <header className="App-header">
        <Button onClick={() => setNum(num + 1)}>测试</Button>
        <img src={logo} className="App-logo" alt="logo" />
        <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
          Learn React &nbsp;
          {userInfo.name || '游客'}
        </a>
        <section>
          <Router>
            <Link to="/test">test</Link>
            /
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

            {/* 可以通过比对path获取当前路由信息，如制作面包屑之类 */}
            <Route component={() => <h3>LAYOUT-TOP</h3>} />
            <Switch>
              <Route path="/test" component={Test} />
              <Route path="/test2">{() => <h3>test2</h3>}</Route>

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
            {/* 可以通过获取到history，实现底部模块页跳转，直接使用link也行 */}
            <Route component={() => <h3>LAYOUT-BOTTOM</h3>} />
          </Router>
        </section>
      </header>
    </div>
  )
}

function TestChild(props) {
  console.log('test2-render', props)

  return (
    <div>
      TestChild
      {props.match.params.id}
    </div>
  )
}

function Test(props) {
  console.log('test-render', props)
  return (
    <div>
      Test
      <Link to="/test/1314/child">test嵌套子路由</Link>
      <Route path="/test/:id/child" component={TestChild} />
    </div>
  )
}

export default connect((state) => ({ userInfo: state.userInfo }))(App)
// export default App
