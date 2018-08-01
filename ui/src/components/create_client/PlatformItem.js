import React, { Component } from 'react';

class PlatformItem extends Component {
    
    state={ selected: this.props.selected };
    
    render=()=> {
        return (
               <div>
               <a class={this.state.selected?"platform-item selected":"platform-item"} href="#" onClick={this.handleClick}>
                            <div class="platform-item-icon-container">
                            {this.platformItemIcon()}                
                            </div>
                            <div class="platform-item-name" title={this.props.title}>
                                {this.props.title}
                            </div>                                        
                </a>
                </div>
        )
    }

    handleClick=(e) => {
        const state={selected:true,id:this.props.id}
        this.setState(state)
        this.props.itemSelected(state)
        e.preventDefault();
    }

    platformItemIcon() {
        const inside=(this.props.inclass === undefined)?this.props.children:<span class={this.props.inclass}></span>;
        return <div class="platform-item-icon">
            {inside}
        </div> 
    }
}

export default PlatformItem;