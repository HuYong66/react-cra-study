import React, { PureComponent } from 'react'
import ThemeContext from './context'

class Child extends PureComponent {
  // constructor(props) {
  // super(props)
  // console.log(this.context) // undefined 构造器不能拿到context
  // }

  render() {
    return (
      <div>
        Child0
        {this.context}
      </div>
    )
  }
}

Child.contextType = ThemeContext

export default Child
