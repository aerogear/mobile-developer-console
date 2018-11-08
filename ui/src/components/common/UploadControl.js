import React, { Component } from 'react';
import { FormControl } from 'patternfly-react';

class UploadControl extends Component {
  localUpload = e => {
    const { files } = e.target;
    if (!files.length) {
      return;
    }

    const file = files[0];
    const start = 0;
    const stop = file.size;

    const reader = new FileReader();
    const component = this;
    // If we use onloadend, we need to check the readyState.
    reader.onload = evt => {
      if (evt.target.readyState === FileReader.DONE) {
        component.props.onTextLoaded && component.props.onTextLoaded(evt.target.result);
      }
    };

    const blob = file.slice(start, stop);
    reader.readAsText(blob);
  };

  render = () => <FormControl type="file" onChange={this.localUpload} />;
}

export default UploadControl;
