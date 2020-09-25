import React, {Component} from 'react';

class Card21 extends Component {
    render(){
        return(
            <div className="col-lg-3 col-md-6">
                <div className="social-box facebook">
                    <i className="fa fa-facebook"></i>
                    <ul>
                        <li>
                            <strong><span className="count">40</span> k</strong>
                            <span>friends</span>
                        </li>
                        <li>
                            <strong><span className="count">450</span></strong>
                            <span>feeds</span>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default Card21;