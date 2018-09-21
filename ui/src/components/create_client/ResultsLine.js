import React, { Component } from 'react';

export class ResultsLine extends Component {

    resultDetails=()=>this.props.resultDetails?<pre>{this.props.resultDetails}</pre>:""

    render() {
      return <div class="mobile-client-creation-result">
        <span class={this.props.iconClass || ""} />
        <span class="mobile-client-creation-result-text">
          {this.props.text}
          {this.resultDetails()}
        </span>
      </div>
    }

}