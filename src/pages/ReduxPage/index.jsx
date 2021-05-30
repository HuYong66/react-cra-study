import React, { PureComponent } from 'react'
import { Button } from 'antd'
import obj from './test'
import store from './store'

export class ReduxPage extends PureComponent {
  constructor(props) {
    super(props)
    this.clear = store.subscribe(() => {
      this.forceUpdate()
    })
    // console.log(typeof this.clear, this.clear, 'clear')
  }

  componentDidMount() {
    setTimeout(() => {
      obj.a = 999
    }, 2000)
  }

  componentWillUnmount() {
    this.clear()
  }

  add = () => {
    store.dispatch(async (dispatch) => {
      await new Promise((resolve) => {
        setTimeout(() => {
          console.log('延时两秒')
          resolve()
        }, 2000)
      })
      dispatch({ type: 'add', num: 2 })
    })
  }

  render() {
    // console.log('render-reduxpage', store.getState())
    return (
      <div>
        redux
        <Button onClick={() => store.dispatch({ type: 'add', num: 2 })}>add</Button>
        <Button onClick={this.add}>redux-thunk异步add</Button>
        <Button onClick={this.clear}>解除监听</Button>
        {' '}
        <br />
        obj:
        <p>{obj.a}</p>
        name:
        <p>{store.getState().name}</p>
        id:
        <p>{store.getState().id}</p>
      </div>
    )
  }
}

export default ReduxPage
