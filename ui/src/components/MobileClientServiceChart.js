import React, { Component } from 'react';
import { DonutChart } from 'patternfly-react';

import '../style/MobileClientServiceChart.css'

class MobileClientServiceChart extends Component {
    viewAllServices(){
        return (
            <a>View All Mobile Services</a>
        )
    }

    render = () => {
        const mobileServices = Object.values(this.props.mobileServices || {})
        return (
            <div>
                <div className="donut-label section-label">
                    Mobile Services
                </div>
                <div>
                    <DonutChart
                        id="donunt-chart-2"
                        size={{width: 270,height: 91}}
                        data={{colors: {
                            'Bound Mobile Services' : '#0088ce',
                            'Unbound Mobile Services': '#ec7a08',
                        },columns: [
                            ['Bound Mobile Services', mobileServices[0].bound],
                            ['Unbound Mobile Services',mobileServices[0].unbound],
                        ],type: 'donut'}}
                        tooltip={{show: true}}
                        title={{type: 'total'}}
                        legend={{show: true,position: 'right'}}
                        />
                </div>
                <div>
                    {this.viewAllServices(this.mobileClients)}
                </div>
            </div>
        )
    }
}

export default MobileClientServiceChart;