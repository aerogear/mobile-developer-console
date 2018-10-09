const defaultState = {
  isFetching: false,
  items: [],
  fetchError: false,
  isCreating: false,
  createError: false,
  isDeleting: false,
  deleteError: false,
  isActioning: false,
  actionError: false,
};

const resourceReducer = actions => (state = defaultState, action) => {
  let indexOfRemovedObject;
  switch (action.type) {
    case actions.listRequest:
      return {
        ...state,
        isFetching: true,
        fetchError: false,
      };
    case actions.listSuccess:
      return {
        ...state,
        isFetching: false,
        items: action.result,
        fetchError: false,
      };
    case actions.listFailure:
      return {
        ...state,
        isFetching: false,
        fetchError: action.error,
      };
    case actions.createRequest:
      return {
        ...state,
        isCreating: true,
        createError: false,
      };
    case actions.createSuccess:
      return {
        ...state,
        isCreating: false,
        createError: false,
        items: [...state.items, action.result],
      };
    case actions.createFailure:
      return {
        ...state,
        isCreating: false,
        createError: action.error,
      };
    case actions.deleteRequest:
      return {
        ...state,
        isDeleting: true,
        deleteError: false,
      };
    case actions.deleteSuccess:
      indexOfRemovedObject = state.items.findIndex(item => item.metadata.name === action.result);
      return {
        ...state,
        isDeleting: false,
        deleteError: false,
        items: [
          ...state.items.slice(0, indexOfRemovedObject),
          ...state.items.slice(indexOfRemovedObject + 1),
        ],
      };
    case actions.deleteFailure:
      return {
        ...state,
        isDeleting: false,
        deleteError: action.error,
      };
    case actions.actionRequest:
      return {
        ...state,
        isActioning: true,
        actionError: false,
      };
    case actions.actionSuccess:
      return {
        ...state,
        isActioning: false,
        actionError: false,
      };
    case actions.actionFailure:
      return {
        ...state,
        isActioning: false,
        actionError: action.error,
      };
    default:
      return state;
  }
};

export default resourceReducer;
