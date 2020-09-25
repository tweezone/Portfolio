import React, {Component} from 'react';

class GraphicCard extends Component{
    render(){
        return(
            <div className="col-xl-6">
                <div className="card">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-sm-4">
                                <h4 className="card-title mb-0">Traffic</h4>
                                <div className="small text-muted">October 2017</div>
                            </div>
                            <div className="col-sm-8 hidden-sm-down">
                                <button type="button" className="btn btn-primary float-right bg-flat-color-1"><i className="fa fa-cloud-download"></i></button>
                                <div className="btn-toolbar float-right" role="toolbar" aria-label="Toolbar with button groups">
                                    <div className="btn-group mr-3" data-toggle="buttons" aria-label="First group">
                                        <label className="btn btn-outline-secondary">
                                            <input type="radio" name="options" id="option1"/> Day
                                        </label>
                                        <label className="btn btn-outline-secondary active">
                                            <input type="radio" name="options" id="option2" /> Month
                                        </label>
                                        <label className="btn btn-outline-secondary">
                                            <input type="radio" name="options" id="option3"/> Year
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="chart-wrapper mt-4" >
                            <canvas id="trafficChart" style={{height:200+'px'}} height="200"></canvas>
                        </div>
                    </div>
                    <div className="card-footer">
                        <ul>
                            <li>
                                <div className="text-muted">Visits</div>
                                <strong>29.703 Users (40%)</strong>
                                <div className="progress progress-xs mt-2" style={{height: 5+'px'}}>
                                    <div className="progress-bar bg-success" role="progressbar" style={{width: 40+'%'}} aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </li>
                            <li className="hidden-sm-down">
                                <div className="text-muted">Unique</div>
                                <strong>24.093 Users (20%)</strong>
                                <div className="progress progress-xs mt-2" style={{height: 5+'px'}}>
                                    <div className="progress-bar bg-info" role="progressbar" style={{width: 20+'%'}} aria-valuenow="20" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </li>
                            <li>
                                <div className="text-muted">Pageviews</div>
                                <strong>78.706 Views (60%)</strong>
                                <div className="progress progress-xs mt-2" style={{height: 5+'px'}}>
                                    <div className="progress-bar bg-warning" role="progressbar" style={{width: 60+'%'}} aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </li>
                            <li className="hidden-sm-down">
                                <div className="text-muted">New Users</div>
                                <strong>22.123 Users (80%)</strong>
                                <div className="progress progress-xs mt-2"style={{height: 5+'px'}}>
                                    <div className="progress-bar bg-danger" role="progressbar" style={{width: 80+'%'}} aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
                                </div>
                            </li>
                            <li className="hidden-sm-down">
                                <div className="text-muted">Bounce Rate</div>
                                <strong>40.15%</strong>
                                <div className="progress progress-xs mt-2" style={{height: 5+'px'}}>
                                    <div className="progress-bar" role="progressbar" style={{width: 40+'%'}} aria-valuenow="40" aria-valuemin="0" aria-valuemax="100">
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default GraphicCard;