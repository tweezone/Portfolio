import React, {Component} from 'react';

class Card2 extends Component{
    render(){
        return(
            <div className="col-xl-3 col-lg-6">
                <div className="card">
                    <div className="card-body">
                        <div className="stat-widget-one">
                            <div className="stat-icon dib"><i className="ti-user text-primary border-primary"></i></div>
                            <div className="stat-content dib">
                                <div className="stat-text">New Customer</div>
                                <div className="stat-digit">961</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Card2;