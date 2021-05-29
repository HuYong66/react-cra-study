import React, { PureComponent, useEffect } from 'react'
import { createBrowserHistory } from 'history'
import matchPath from './matchPath'

export const RouterContext = React.createContext()

export class BrowserRouter extends PureComponent {
  static computeRootMatch(pathname) {
    return {
      path: '/',
      url: '/',
      params: {},
      isExact: pathname === '/',
    }
  }

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
      <RouterContext.Provider
        value={{ history: this.history, location, match: BrowserRouter.computeRootMatch(location.pathname) }}
      >
        {this.props.children}
      </RouterContext.Provider>
    )
  }
}

export class Switch extends PureComponent {
  render() {
    // return this.props.children
    return (
      <RouterContext.Consumer>
        {(context) => {
          const location = this.props.location || context.location
          let element
          let match
          // 组件渲染从上到下，这里进行了路由匹配，到route时就只剩一个了
          React.Children.forEach(this.props.children, (child) => {
            if (!match && React.isValidElement(child)) {
              element = child
              const { path } = child.props
              match = path ? matchPath(location.pathname, { ...child.props, path }) : context.match
            }
          })
          return match ? React.cloneElement(element, { location, computedMatch: match }) : null
        }}
      </RouterContext.Consumer>
    )
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
    //         // clone和create区别在于一个是类型(实例.type可以获得类型)，一个是实例， 下面两个都能实现结果
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
            component, children, render, computedMatch, path,
          } = this.props
          const location = this.props.location || context.location
          const match = computedMatch || (path ? matchPath(location.pathname, this.props) : context.match)
          const props = { ...context, location, match }
          // return match
          //   ? children
          //     ? typeof children === 'function'
          //       ? children(props)
          //       : children
          //     : component
          //       ? React.createElement(component, props)
          //       : render
          //         ? render(props)
          //         : null
          //   : typeof children === 'function'
          //     ? children(props)
          //     : null
          return (
            // 这里再包一层并不多余，虽然大部分自身props传过去了，但是非function children没有props,这时就需要借助外力，如自定义hooks
            // 非function children, 需要获取match里面的参数, 使用useParams得到，useParams需要用到useContext
            // 而useContext 取的是最近的provider, useHistory, useLocation 同理也是借助useContext
            <RouterContext.Provider value={props}>
              {match
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
                  : null}
            </RouterContext.Provider>
          )
        }}
      </RouterContext.Consumer>
    )
  }
}

export class Redirect extends PureComponent {
  render() {
    return (
      <RouterContext.Consumer>
        {(context) => {
          const { history } = context
          const { to } = this.props
          return <LifeCycle onMount={() => history.push(to)} />
        }}
      </RouterContext.Consumer>
    )
  }
}

function LifeCycle(props) {
  useEffect(() => {
    props.onMount()
  }, [])
  return null
}

// class LifeCycle extends PureComponent {
//   componentDidMount() {
//     this.props.onMount()
//   }
//   render() {
//     return null
//   }
// }

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

export const withRouter = (WrappedComponent) => (props) => (
  <RouterContext.Consumer>
    {(context) => {
      const extraProps = { history: context.history, match: context.match }
      return <WrappedComponent {...props} {...extraProps} />
    }}
  </RouterContext.Consumer>
)
