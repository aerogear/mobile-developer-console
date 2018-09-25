import React, { Component } from 'react';

export class ResultsLine extends Component {
  resultDetails = () => (this.props.resultDetails ? <pre>{this.props.resultDetails}</pre> : '');

  render() {
    return (
      <div className="mobile-client-creation-result">
        <span className={this.props.iconClass || ''} />
        <span className="mobile-client-creation-result-text">
          {this.props.text}
          {this.resultDetails()}
        </span>
      </div>
    );
  }
}
