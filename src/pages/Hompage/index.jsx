import { Button } from 'antd'
import React, { PureComponent } from 'react'
// import { withRouter, useHistory } from 'react-router-dom'
import { withRouter } from '@/router/k-react-router-dom'
import { useHistory } from '@/router/k-react-router-dom/hooks'
// import { ReduxPage } from '../index'

class Home extends PureComponent {
  handleClick = () => {
    const { history } = this.props
    // history.push('/hoc', { id: 999 })
    history.push({ pathname: '/hoc', state: { id: 90990 } })
  }

  render() {
    // console.log('home-render', this.props)

    return (
      <div className="test">
        <h3>homepage</h3>
        <Button type="primary" onClick={this.handleClick}>this.props.history跳转</Button>
        <Child />
        <Child2 />
        {/* <ReduxPage /> */}
        {/* {React.cloneElement(<ReduxPage />)}
        {React.createElement(ReduxPage)} */}
      </div>
    )
  }
}

@withRouter
class Child extends React.PureComponent {
  handleClick = () => {
    const { history } = this.props
    history.push('/hoc', { id: 999 })
  }

  render() {
    // console.log('home-child1-props', this.props)

    return (
      <div>
        child1
        <Button type="primary" onClick={this.handleClick}>withRouter跳转</Button>
      </div>
    )
  }
}

function Child2() {
  const history = useHistory()
  const handleClick = () => {
    history.push('/hoc', { id: 999 })
    // console.log('home-child2-props', history)
  }
  return (
    <div>
      child2
      <Button type="primary" onClick={handleClick}>useRouter跳转</Button>
    </div>
  )
}

export default Home
