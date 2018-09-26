import React from 'react';
import { Button, FormControl } from 'patternfly-react';
import classNames from 'classnames';

import './InlineEdit.css';

class InlineEdit extends React.Component {
  constructor(props) {
    super(props);

    this.currentValue = '';
    this.state = {
      editing: false
    };
  }

  componentWillReceiveProps(props) {
    if (props.value) {
      this.currentValue = props.value;
    }
  }

  componentDidUpdate = () => {
    if (this.state.editing) {
      this.textInput.focus();
    }
  };

  cancelEdit = () => {
    this.textInput.value = this.currentValue;
    this.setState({ editing: false });
  };

  setEditable = () => {
    this.setState({ editing: true });
  };

  setRef = ref => {
    this.textInput = ref;
  };

  save = () => {
    const value = this.textInput.value;
    this.currentValue = value;
    this.setState({ editing: false });
    this.props.save && this.props.save(value);
  };

  clearInput = () => {
    this.textInput.value = '';
  };

  render() {
    return (
      <div className={`form-control-pf-editable ${this.state.editing ? 'form-control-pf-edit' : ''}`}>
        <button
          className={classNames('form-control-pf-value', { 'no-horizontal-padding': this.props.noHorizontalPadding })}
          onClick={this.setEditable}
        >
          <span className={`pull-left ${this.currentValue ? 'current-value' : 'placeholder'}`}>
            {this.currentValue || this.props.placeholder}
          </span>
          <i className="glyphicon glyphicon-pencil" />
        </button>
        <div className="form-control-pf-textbox">
          <FormControl type="text" inputRef={this.setRef} />
          <button className="form-control-pf-empty" onClick={this.clearInput}>
            <span className="fa fa-times-circle fa-lg" />
          </button>
        </div>
        <Button className="form-control-pf-save" bsStyle="primary" onClick={this.save}>
          <i className="glyphicon glyphicon-ok" />
        </Button>
        <Button className="form-control-pf-cancel" onClick={this.cancelEdit}>
          <i className="glyphicon glyphicon-remove" />
        </Button>
      </div>
    );
  }
}

export default InlineEdit;
