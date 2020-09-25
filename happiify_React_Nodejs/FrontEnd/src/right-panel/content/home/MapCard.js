import React, {Component} from 'react';

class MapCard extends Component{
    render(){
        return(
            <div className="col-xl-6">
                <div className="card" >
                    <div className="card-header">
                        <h4>World</h4>
                    </div>
                    <div className="Vector-map-js">
                        <div id="vmap" className="vmap" style={{height:265+'px'}}></div>
                    </div>
                </div>
            </div>
        );
    }
}

export default MapCard;