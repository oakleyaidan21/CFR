const initialPersistingState = {
  refreshToken: null,
  authCode: null,
  users: {},
  postItemView: "simple",
};

const persistingReducer = (state = initialPersistingState, action: any) => {
  switch (action.type) {
    case "SET_AUTH_CODE": {
      return { ...state, authCode: action.authCode };
    }
    case "SET_REFRESH_TOKEN": {
      return { ...state, refreshToken: action.refreshToken };
    }
    case "SET_USERS": {
      console.log("new users:", action.users);
      return { ...state, users: { ...action.users } };
    }
    case "LOGOUT": {
      return { ...state, authCode: "none", refreshToken: "none" };
    }
    case "SET_POST_ITEM_VIEW": {
      return { ...state, postItemView: action.postItemView };
    }
    default: {
      return state;
    }
  }
};

export default persistingReducer;
