// import React from 'react'
// import ReactDOM from 'react-dom'
import React from './react/k-react'
import { Component as PureComponent } from './react/k-react-component'
import ReactDOM from './react/k-react-dom'
import './index.css'
// import { Provider } from 'react-redux'
// import { Provider } from './pages/ReactReduxPage/k-react-redux'
// import App from './App'
// import reportWebVitals from './reportWebVitals'
// import store from './store'

// ReactDOM.render(
//   <Provider store={store}>
//     <React.StrictMode>
//       <App />
//     </React.StrictMode>
//   </Provider>,
//   document.getElementById('root'),
// )

function TestFunc({ name }) {
  return (
    <div className="border">
      这里是函数组件
      {name}
    </div>
  )
}

class TestClass extends PureComponent {
  render() {
    return (
      <div>
        这里是class组件
        {this.props.name}
      </div>
    )
  }
}

const jsx = (
  <div className="border">
    <TestFunc name="alex" />
    <TestClass name="火蜘蛛" />
    <p>这是一个文本</p>
    <a href="https://baidu.com">开课吧</a>
    <div className="border">
      <h5>hello</h5>
      <button type="button" onClick={() => { console.log('click') }}>点击</button>
    </div>
    <>
      <h1>111</h1>
      <h1>222</h1>
    </>
    {[1, 2, 3].map((num) => <p key={num}>{num}</p>)}
  </div>
)

ReactDOM.render(
  jsx,
  document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals()
