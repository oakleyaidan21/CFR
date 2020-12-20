const initialPersistingState = {
  authTokens: [],
};

const persistingReducer = (state = initialPersistingState, action: any) => {
  switch (action.type) {
    default: {
      return state;
    }
  }
};

export default persistingReducer;
