import React, { Component } from 'react';
import { OverlayTrigger, Tooltip } from 'patternfly-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import classNames from 'classnames';

import './CopyToClipboardMultiline.css';

class CopyToClipboardMultiline extends Component {
  render() {
    return (
      <div className={classNames('input-group', 'copy-to-clipboard-multiline', this.props.className)}>
        <pre>{this.props.children}</pre>
        <span>
          <CopyToClipboard text={this.props.children}>
            <OverlayTrigger
              overlay={<Tooltip id="tooltip">Copied!</Tooltip>}
              placement="left"
              trigger={['click']}
              rootClose
            >
              <a className="btn btn-default copy-btn">Copy</a>
            </OverlayTrigger>
          </CopyToClipboard>
        </span>
      </div>
    );
  }
}

export default CopyToClipboardMultiline;
