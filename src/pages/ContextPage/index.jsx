import React, { PureComponent } from 'react'
import Child from './Child'
import ThemeContext from './context'

function Child1() {
  return (
    <div>
      <ThemeContext.Consumer>
        {
      (theme) => (
        <div>
          child1
          {theme}
        </div>
      )
      }
      </ThemeContext.Consumer>
    </div>
  )
}

export default class ContextPage extends PureComponent {
  render() {
    return (
      <div>
        context
        <ThemeContext.Provider value="red">
          <Child1 />
          <Child />
        </ThemeContext.Provider>
      </div>
    )
  }
}
