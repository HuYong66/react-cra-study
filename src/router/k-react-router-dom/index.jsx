import React, { PureComponent } from 'react'
import { createBrowserHistory } from 'history'
import matchPath from './matchPath'

const RouterContext = React.createContext()

export class BrowserRouter extends PureComponent {
  constructor(props) {
    super(props)
    this.history = createBrowserHistory()
    this.unlisten = this.history.listen((his) => {
      console.log('history-location', his)
      this.setState({
        location: his.location,
      })
    })
    this.state = {
      location: this.history.location,
    }
  }

  componentWillUnmount() {
    if (this.unlisten) {
      this.unlisten()
    }
  }

  render() {
    const { location } = this.state
    return (
      <RouterContext.Provider value={{ history: this.history, location }}>
        {this.props.children}
      </RouterContext.Provider>
    )
  }
}

export class Switch extends PureComponent {
  render() {
    return this.props.children
  }
}

export class Route extends PureComponent {
  render() {
    // 原始版本
    // const { component, path } = this.props
    // const match = window.location.pathname === path
    // console.log('window.location', window.location)
    // return match && React.createElement(component, this.props)

    // 第二版本
    // return (
    //   <RouterContext.Consumer>
    //     {
    //       (context) => {
    //         // const { component: Tcp, path } = this.props
    //         const { component, path } = this.props
    //         const match = context.location.pathname === path
    //         // clone和create区别在于一个是类型，一个是实例， 下面两个都能实现结果
    //         return match && React.createElement(component, this.props)
    //         // return match && React.cloneElement(<Tcp />, this.props)
    //       }
    //     }
    //   </RouterContext.Consumer>
    // )

    // 第三版本
    return (
      <RouterContext.Consumer>
        {(context) => {
          const {
            component, children, render,
          } = this.props
          const location = this.props.location || context.location
          const match = matchPath(location.pathname, this.props)
          const props = { ...context, location, match }
          return match
            ? children
              ? typeof children === 'function'
                ? children(props)
                : children
              : component
                ? React.createElement(component, props)
                : render
                  ? render(props)
                  : null
            : typeof children === 'function'
              ? children(props)
              : null
        }}
      </RouterContext.Consumer>
    )
  }
}

export class Link extends PureComponent {
  static contextType = RouterContext

  handleClick = (e) => {
    const { to } = this.props
    const { history } = this.context
    e.preventDefault()
    history.push(to)
  }

  render() {
    const { to, children } = this.props
    return (
      <a href={to} onClick={this.handleClick}>
        {children}
      </a>
    )
  }
}
