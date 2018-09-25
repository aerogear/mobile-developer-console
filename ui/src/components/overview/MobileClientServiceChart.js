import React, { Component } from 'react';
import { DonutChart } from 'patternfly-react';

class MobileClientServiceChart extends Component {
  render = () => {
    const { data } = this.props;
    const boundTitle = `${data.bound} Bound Mobile Services`;
    const unboundTitle = `${data.unbound} Unbound Mobile Services`;

    return (
      <div>
        <DonutChart
          id="donunt-chart-2"
          size={{ width: 270, height: 91 }}
          data={{
            colors: {
              [boundTitle]: '#0088ce',
              [unboundTitle]: '#ec7a08'
            },
            columns: [[boundTitle, data.bound], [unboundTitle, data.unbound]],
            type: 'donut'
          }}
          tooltip={{ show: true }}
          title={{ type: 'total' }}
          legend={{ show: true, position: 'right' }}
        />
      </div>
    );
  };
}

export default MobileClientServiceChart;
