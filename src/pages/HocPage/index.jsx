import React, { PureComponent } from 'react'
import obj from '../ReduxPage/test'

function Child() {
  return <div>Child</div>
}

// 高阶组件，
// 注意拆分 cmp => xxx 表示接收一个组件返回一个组件，
// props => <xxx /> 表示新组件，props就是传递给新组件的属性 <Foo xxx=xxx />
const foo = (Cmp) => (props) =>
  (
    <div style={{ border: '1px solid red', padding: '10px' }}>
      <Cmp {...props} />
    </div>
  )

const Foo = foo(foo(Child))

// class Child2 extends PureComponent {
//   render() {
//     <div>Child2</div>
//   }
// }

@foo
class HocPage extends PureComponent {
  render() {
    console.log('hoc-props', this.props)
    return (
      <div>
        <h3>hocpage</h3>
        <Foo />
        {' '}
        {obj.a}
      </div>
    )
  }
}

export default HocPage
