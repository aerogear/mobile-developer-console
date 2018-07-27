import React, { Component } from 'react';

class PlatformItem extends Component {
    render() {
        return (
                <div class="platform-item">
                            {this.platformItemIcon()}                
                            <div class="platform-item-name" title={this.props.title}>
                                {this.props.title}
                            </div>                                        
                </div>
        )
    }

    platformItemIcon() {
        const inside=(this.props.class === undefined)?this.props.children:<span class={this.props.class}></span>;
        return <div class="platform-item-icon">
            {inside}
        </div> 
    }
}

export default PlatformItem;