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
  isReading: false,
  readingError: false
};

const resourceReducer = actions => (state = defaultState, action) => {
  let index;
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
    case actions.readRequest:
      return {
        ...state,
        isReading: true,
        readingError: false,
      };
    case actions.readSuccess:
      index = state.items.findIndex(item => item.metadata.name === action.result.metadata.name);
      if (index >= 0) {
        return {
          ...state,
          isReading: false,
          items: [
            ...state.items.slice(0, index),
            action.result,
            ...state.items.slice(index + 1),
          ],
          readingError: false,
        };
      } else {
        return {
          ...state,
          isReading: false,
          items: [...state.items, action.result],
          readingError: false,
        };
      }
    case actions.readFailure:
      return {
        ...state,
        isReading: false,
        readingError: action.error,
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
      index = state.items.findIndex(item => item.metadata.name === action.result);
      return {
        ...state,
        isDeleting: false,
        deleteError: false,
        items: [
          ...state.items.slice(0, index),
          ...state.items.slice(index + 1),
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
