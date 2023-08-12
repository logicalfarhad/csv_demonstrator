function AuthReducer(state, action) {
  switch (action.type) {
    case "LOGIN": {
      return {
        ...state,
        token: action.payload,
      };
    }
    case "SIGNUP": {
      return {
        ...state,
        token: action.payload,
      };
    }
    case "LOGOUT": {
      return {
        token: "",
      };
    }
    default: {
      return state;
    }
  }
}

export default AuthReducer;
