import React, {Component} from 'react';

class ManagerCard extends Component{
    render(){
        return(
            <div className="col-xl-3 col-lg-6">
                <section className="card">
                    <div className="twt-feed blue-bg">
                        <div className="corner-ribon black-ribon">
                            <i className="fa fa-twitter"></i>
                        </div>
                        <div className="fa fa-twitter wtt-mark"></div>

                        <div className="media">
                            <a href="">
                                <img className="align-self-center rounded-circle mr-3" style={{width:85+'px', height:85+'px'}} alt="" src="images/admin.jpg"/>
                            </a>
                            <div className="media-body">
                                <h2 className="text-white display-6">Jim Doe</h2>
                                <p className="text-light">Project Manager</p>
                            </div>
                        </div>
                    </div>
                    <div className="weather-category twt-category">
                        <ul>
                            <li className="active">
                                <h5>750</h5>
                                Tweets
                            </li>
                            <li>
                                <h5>865</h5>
                                Following
                            </li>
                            <li>
                                <h5>3645</h5>
                                Followers
                            </li>
                        </ul>
                    </div>
                    <div className="twt-write col-sm-12">
                        <textarea placeholder="Write your Tweet and Enter" rows="1" className="form-control t-text-area"></textarea>
                    </div>
                    <footer className="twt-footer">
                        <a href=""><i className="fa fa-camera"></i></a>
                        <a href=""><i className="fa fa-map-marker"></i></a>
                        New Castle, UK
                        <span className="pull-right">
                            32
                        </span>
                    </footer>
                </section>
            </div>
        );
    }
}

export default ManagerCard;