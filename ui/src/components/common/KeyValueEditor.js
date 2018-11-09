import React, { Component } from 'react';
import { Row, Col, FormControl, Icon, FormGroup, Button } from 'patternfly-react';

import './KeyValueEditor.css';

class KeyValueEditor extends Component {
  constructor(props) {
    super(props);

    this.state = { rows: [{ key: '', value: '' }] };
  }

  addRow = () =>
    this.setState({
      rows: [...this.state.rows, { key: '', value: '' }]
    });

  handleChange = (rowIndex, type, value) => {
    const rows = [...this.state.rows];
    const { onChange } = this.props;
    rows[rowIndex] = { ...rows[rowIndex], [type]: value };
    this.setState({ rows });
    onChange && onChange(this.state.rows);
  };

  handleDelete = rowIndex => {
    const { onChange } = this.props;
    if (this.state.rows.length === 1) {
      this.setState({ rows: [{ key: '', value: '' }] });
      onChange && onChange(this.state.rows);
    } else {
      this.setState({
        rows: [...this.state.rows.slice(0, rowIndex), ...this.state.rows.slice(rowIndex + 1)]
      });
      onChange && onChange(this.state.rows);
    }
  };

  render = () => (
    <div className="key-value-editor">
      <Row className="form-row-has-controls">
        <Col xs={6}>
          <label>Key</label>
        </Col>
        <Col xs={6}>
          <label>Value</label>
        </Col>
      </Row>
      {this.state.rows.map((row, i) => (
        <Row className="form-row-has-controls" key={i}>
          <Col xs={6} className="form-group">
            <FormControl
              type="text"
              placeholder="Key"
              onChange={e => this.handleChange(i, 'key', e.target.value)}
              value={row.key}
            />
          </Col>
          <Col xs={6} className="form-group">
            <FormControl
              type="text"
              placeholder="Value"
              onChange={e => this.handleChange(i, 'value', e.target.value)}
              value={row.value}
            />
          </Col>
          <div className="form-row-controls">
            <button
              className="btn-remove close"
              onClick={e => {
                e.preventDefault();
                this.handleDelete(i);
              }}
            >
              <Icon type="pf" name="close" />
            </button>
          </div>
        </Row>
      ))}
      <FormGroup>
        <Button bsStyle="link" className="btn-add" onClick={this.addRow}>
          Add Environment Variable
        </Button>
      </FormGroup>
    </div>
  );
}

export default KeyValueEditor;
