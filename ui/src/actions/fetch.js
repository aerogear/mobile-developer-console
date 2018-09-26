const requestAction = type => ({
  type
});

const successAction = (type, result) => ({
  type,
  result
});

const failureAction = (type, error) => ({
  type,
  error
});

const fetchAction = ([request, success, failure], doFetch) => () => async dispatch => {
  dispatch(requestAction(request));
  try {
    const result = await doFetch();
    dispatch(successAction(success, result));
  } catch (error) {
    dispatch(failureAction(failure, error));
  }
};

export default fetchAction;
