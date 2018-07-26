import React, { Component } from 'react';
import { DonutChart } from 'patternfly-react';

class MobileClientServiceChart extends Component {

    render = () => {
        const mobileServices = Object.values(this.props.mobileServices || {});
        const boundTitle = `${mobileServices[0].bound} Bound Mobile Services`;
        const unboundTitle = `${mobileServices[0].unbound} Unbound Mobile Services`;

        return (
            <div>
                <DonutChart
                    id="donunt-chart-2"
                    size={{width: 270,height: 91}}
                    data={{colors: {
                        [boundTitle] : '#0088ce',
                        [unboundTitle]: '#ec7a08',
                    },columns: [
                        [boundTitle, mobileServices[0].bound],
                        [unboundTitle, mobileServices[0].unbound],
                    ],type: 'donut'}}
                    tooltip={{show: true}}
                    title={{type: 'total'}}
                    legend={{show: true,position: 'right'}}/>
            </div>
        )
    }
}

export default MobileClientServiceChart;