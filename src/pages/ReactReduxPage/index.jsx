import React, { PureComponent } from 'react'
// import { connect } from 'react-redux'
import { Button } from 'antd'
import { connect } from './k-react-redux'
// import { bindActionCreators } from 'redux'
import { bindActionCreators } from '../ReduxPage/k-redux'
import styles from './index.module.less'

class ReactReduxPage extends PureComponent {
  render() {
    const { num, dispatch, minus } = this.props

    return (
      <div className={styles.test}>
        test-react-redux
        <br />
        {num}
        <Button type="button" onClick={() => dispatch({ type: 'ADD' })}>
          add
        </Button>
        <Button type="button" onClick={() => minus(2)}>
          minus
        </Button>
      </div>
    )
  }
}

// 参数(state, [ownProps]) ownProps 是组件本身props
const mapStateToProps = (state) => ({
  num: state.count,
})

// 对象形式
// const mapDispatchToProps = {
//   add: () => ({ type: 'ADD' }),
//   minus: (num) => ({ type: 'MINUS', num }),
// }

// 函数形式 参数：(dispatch, [ownProps])
const mapDispatchToProps = (dispatch) => {
  const creators = {
    add: () => ({ type: 'ADD' }),
    minus: (num) => ({ type: 'MINUS', num }),
  }
  return { dispatch, ...bindActionCreators(creators, dispatch) }
}

// export default connect(mapStateToProps)(ReactReduxPage) // 默认传入dispatch
export default connect(mapStateToProps, mapDispatchToProps)(ReactReduxPage)
