import React, {Component} from 'react';

class Card1 extends Component{
    render(){
        return(
            <div className="col-xl-3 col-lg-6">
                <div className="card">
                    <div className="card-body">
                        <div className="stat-widget-one">
                            <div className="stat-icon dib"><i className="ti-money text-success border-success"></i></div>
                            <div className="stat-content dib">
                                <div className="stat-text">Total Profit</div>
                                <div className="stat-digit">1,012</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Card1;