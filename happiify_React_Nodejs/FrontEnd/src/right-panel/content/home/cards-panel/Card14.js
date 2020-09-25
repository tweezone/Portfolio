import React, {Component} from 'react';

class Card14 extends Component {
    render(){
        return(
            <div className="col-sm-6 col-lg-3">
                <div className="card text-white bg-flat-color-4">
                    <div className="card-body pb-0">
                        <div className="dropdown float-right">
                            <button className="btn bg-transparent dropdown-toggle theme-toggle text-light" type="button" id="dropdownMenuButton" data-toggle="dropdown">
                                <i className="fa fa-cog"></i>
                            </button>
                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <div className="dropdown-menu-content">
                                    <a className="dropdown-item" href="">Action</a>
                                    <a className="dropdown-item" href="">Another action</a>
                                    <a className="dropdown-item" href="">Something else here</a>
                                </div>
                            </div>
                        </div>
                        <h4 className="mb-0">
                            <span className="count">10468</span>
                        </h4>
                        <p className="text-light">Members online</p>

                        <div className="chart-wrapper px-3" style={{height:70+'px'}} height="70"> {/*"/"???????*/}
                            <canvas id="widgetChart4"></canvas>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Card14;