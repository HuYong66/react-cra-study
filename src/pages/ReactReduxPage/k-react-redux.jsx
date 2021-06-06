import React, { Component, PureComponent } from 'react'
import { omit } from 'lodash'

const StoreContext = React.createContext()
export const Consumer = (WrappedComponent) => (props) =>
  <StoreContext.Consumer>{(store) => <WrappedComponent {...props} store={store} />}</StoreContext.Consumer>

export const Provider = ({ store, children }) => (
  <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
)

export const connect = (mapStateToProps, mapDispatchToProps) => (WrappedComponent) => {
  const Content = class extends PureComponent {
    state = {
      extraProps: this.getExtraProps(),
    }

    componentDidMount() {
      const { subscribe, getState } = this.props.store
      // this.getExtraProps()
      this.clear = subscribe(() => {
        const newState = mapStateToProps && mapStateToProps(getState())
        this.setState((state) => ({ extraProps: { ...state.extraProps, ...newState } }))
      })
    }

    componentWillUnmount() {
      this.clear()
    }

    getExtraProps() {
      const { dispatch, getState } = this.props.store
      const stateProps = mapStateToProps && mapStateToProps(getState())
      let funcProps = {}
      if (!mapDispatchToProps) {
        funcProps.dispatch = dispatch
      }
      if (typeof mapDispatchToProps === 'object') {
        Object.keys(mapDispatchToProps).forEach((key) => {
          funcProps[key] = (...args) => dispatch(mapDispatchToProps[key](...args))
        })
      }
      if (typeof mapDispatchToProps === 'function') {
        funcProps = mapDispatchToProps(dispatch)
      }
      return { ...stateProps, ...funcProps }
      // this.setState({ extraProps: { ...stateProps, ...funcProps } })
    }

    render() {
      const { extraProps } = this.state
      const restProps = omit(this.props, ['store'])
      return <WrappedComponent {...restProps} {...extraProps} />
    }
  }
  // 这里并没有违反高阶组件不要在render里使用这条规则，因为这里只会执行一次
  return Consumer(Content)
}

// 有缺陷，挂载后计算extraProps会导致组件渲染两次
export const connect1 = (mapStateToProps = (state) => state, mapDispatchToProps) =>
  (WrappedComponent) =>
    class extends Component {
      static contextType = StoreContext

      // constructor(props) {
      //   super(props)
      //   const { subscribe } = this.context // 此时this.context获取不到
      //   subscribe(() => {
      //     this.forceUpdate()
      //   })
      // }

      state = {
        extraProps: {},
      }

      componentDidMount() {
        const { subscribe, getState } = this.context
        this.getExtraProps()
        this.clear = subscribe(() => {
          const newState = mapStateToProps && mapStateToProps(getState())
          this.setState((state) => ({ extraProps: { ...state.extraProps, ...newState } }))
        })
      }

      componentWillUnmount() {
        this.clear()
      }

      getExtraProps() {
        const { dispatch, getState } = this.context
        const stateProps = mapStateToProps && mapStateToProps(getState())
        let funcProps = {}
        if (!mapDispatchToProps) {
          funcProps.dispatch = dispatch
        }
        if (typeof mapDispatchToProps === 'object') {
          Object.keys(mapDispatchToProps).forEach((key) => {
            funcProps[key] = (...args) => dispatch(mapDispatchToProps[key](...args))
          })
        }
        if (typeof mapDispatchToProps === 'function') {
          funcProps = mapDispatchToProps(dispatch)
        }
        this.setState({ extraProps: { ...stateProps, ...funcProps } })
      }

      render() {
        const { extraProps } = this.state
        return <WrappedComponent {...this.props} {...extraProps} />
      }
    }
