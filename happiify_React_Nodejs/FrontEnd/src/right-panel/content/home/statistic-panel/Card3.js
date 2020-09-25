import React, {Component} from 'react';

class Card3 extends Component{
    render(){
        return(
            <div className="col-xl-3 col-lg-6">
                <div className="card">
                    <div className="card-body">
                        <div className="stat-widget-one">
                            <div className="stat-icon dib"><i className="ti-layout-grid2 text-warning border-warning"></i></div>
                            <div className="stat-content dib">
                                <div className="stat-text">Active Projects</div>
                                <div className="stat-digit">770</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Card3;