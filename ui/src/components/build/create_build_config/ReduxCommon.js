import { connect } from 'react-redux';
import { setWithValidation } from './Validations';
import { createSetBuildConfigValue, setUiState, createRemoveValues } from '../../../actions/buildConfigs';

function mapStateToProps(state) {
  return {
    createBuildConfigState: state.createBuildConfig
  };
}

const mapDispatchToProps = (path, validation) => ({
  setField: setWithValidation(createSetBuildConfigValue(path), validation),
  setUiState,
  removeValues: createRemoveValues(path)
});

export const createBuildConfigConnect = (path, validation, component) =>
  connect(
    mapStateToProps,
    mapDispatchToProps(path, validation)
  )(component);
