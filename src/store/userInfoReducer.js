const UserInfoReducer = (state = {}, action) => {
  switch (action.type) {
    case 'login':
      return action.userInfo
    case 'logout':
      return undefined
    // case 'init':
    //   return action.sessionUserInfo
    default:
      return state
  }
}

export default UserInfoReducer
