import React, { Component } from 'react';
import { Row, Col, FormControl, Icon, FormGroup } from 'patternfly-react';

import './KeyValueEditor.css';

class KeyValueEditor extends Component {
  constructor(props) {
    super(props);

    this.state = { rows: [{ key: '', value: '' }] };
  }

  addRow = () => {
    this.setState({
      rows: [...this.state.rows, { key: '', value: '' }]
    });
  };

  handleChange = (rowIndex, type, value) => {
    const rows = [...this.state.rows];
    rows[rowIndex] = { ...rows[rowIndex], [type]: value };
    this.setState({ rows });
  };

  handleDelete = rowIndex => {
    if (this.state.rows.length === 1) {
      this.setState({ rows: [{ key: '', value: '' }] });
    } else {
      this.setState({
        rows: [...this.state.rows.slice(0, rowIndex), ...this.state.rows.slice(rowIndex + 1)]
      });
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
        <a role="button" onClick={this.addRow}>
          Add Environment Variable
        </a>
      </FormGroup>
    </div>
  );
}

export default KeyValueEditor;
