import React, { PureComponent } from 'react'
import { Button, message } from 'antd'
import { Redirect } from 'react-router-dom'
// import { connect } from 'react-redux'
import { connect } from '../ReactReduxPage/k-react-redux'

@connect((state) => ({ userInfo: state.userInfo }))
class LoginPage extends PureComponent {
  state = {
    loading: false,
  }

  componentWillUnmount() {
    /**
     * 解决报错
     * Can't perform a React state update on an unmounted component.
     * This is a no-op, but it indicates a memory leak in your application.
     * To fix, cancel all subscriptions and asynchronous tasks in the componentWillUnmount method.
     */
    this.setState = () => false
  }

  login = () => {
    const { dispatch } = this.props
    this.setState({ loading: true })
    setTimeout(() => {
      const userInfo = { id: '2013014045', name: 'huyong', pageRouter: ['/hoc', '/context', '/redux', '/react-redux'] }
      dispatch({
        type: 'login',
        userInfo,
      })
      message.success('登陆成功')
      // 备份用户登陆信息到sessionStorage
      sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
      this.setState({ loading: false })
    }, 2000)
  }

  logout = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'logout',
    })
  }

  render() {
    const { loading } = this.state
    const { userInfo = {} } = this.props
    // console.log('login-render-userInfo', userInfo)

    if (userInfo.id) {
      return (
        <Redirect to="/home" />
      )
    }
    return (
      <div>
        <h3>login-page</h3>
        <Button type="primary" onClick={this.login} loading={loading}>
          login
        </Button>
        <Button type="primary" onClick={this.logout}>
          logout
        </Button>
      </div>
    )
  }
}

export default LoginPage
