import React, { Component } from 'react';
import { OverlayTrigger, Tooltip } from 'patternfly-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

class CopyToClipboardMultiline extends Component {
  render() {
    return (
      <div className="input-group" style={{ display: 'block', overflowX: 'auto', ...this.props.style }}>
        <pre style={{ maxHeight: 350, backgroundColor: '#fff', wordBreak: 'normal', wordWrap: 'normal' }}>
          {this.props.children}
        </pre>
        <span>
          <CopyToClipboard text={this.props.children}>
            <OverlayTrigger
              overlay={<Tooltip id="tooltip">Copied!</Tooltip>}
              placement="left"
              trigger={['click']}
              rootClose
            >
              <a
                className="btn btn-default"
                style={{ boxShadow: 'none', position: 'absolute', right: 0, top: 0 }}
              >
                Copy
              </a>
            </OverlayTrigger>
          </CopyToClipboard>
        </span>
      </div>
    );
  }
}

export default CopyToClipboardMultiline;
