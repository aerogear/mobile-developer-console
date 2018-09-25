const defaultState = {
  isFetching: false,
  items: [],
  fetchError: false,
  isCreating: false,
  createError: false
};

const resourceReducer = actions => (state = defaultState, action) => {
  switch (action.type) {
    case actions.listRequest:
      return {
        ...state,
        isFetching: true,
        fetchError: false
      };
    case actions.listSuccess:
      return {
        ...state,
        isFetching: false,
        items: action.result,
        fetchError: false
      };
    case actions.listFailure:
      return {
        ...state,
        isFetching: false,
        fetchError: action.error
      };
    case actions.createRequest:
      return {
        ...state,
        isCreating: true,
        createError: false
      };
    case actions.createSuccess:
      return {
        ...state,
        isCreating: false,
        createError: false,
        items: [...state.items, action.result]
      };
    case actions.createFailure:
      return {
        ...state,
        isCreating: false,
        createError: action.error
      };
    default:
      return state;
  }
};

export default resourceReducer;
