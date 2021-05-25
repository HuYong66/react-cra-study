const counterReducer = (state = 0, action) => {
  switch (action.type) {
    case 'ADD':
      return state + 1
    case 'MINUS':
      return state - action.num
    default:
      return state
  }
}

export default counterReducer
