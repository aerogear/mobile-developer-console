import React from 'react';
import { OverlayTrigger, Tooltip, Button } from 'patternfly-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import classNames from 'classnames';

import './CopyToClipboardMultiline.css';

const spanizeString = code => (
  <React.Fragment>
    {code.split('\n').map((line, index) => (
      <span key={index}>{line}</span>
    ))}
  </React.Fragment>
);

export const CopyToClipboardMultiline = ({ children: code = '', className }) => (
  <div className={classNames('input-group', 'copy-to-clipboard-multiline', className)}>
    <pre>{spanizeString(code)}</pre>
    <span>
      <CopyToClipboard text={code}>
        <OverlayTrigger
          overlay={<Tooltip id="tooltip">Copied!</Tooltip>}
          placement="left"
          trigger={['click']}
          rootClose
        >
          <Button className="btn btn-default copy-btn">Copy</Button>
        </OverlayTrigger>
      </CopyToClipboard>
    </span>
  </div>
);

export default CopyToClipboardMultiline;
