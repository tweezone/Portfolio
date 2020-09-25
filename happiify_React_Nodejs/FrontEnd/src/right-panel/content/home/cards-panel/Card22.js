import React, {Component} from 'react';

class Card22 extends Component {
    render(){
        return(
            <div className="col-lg-3 col-md-6">
                <div className="social-box twitter">
                    <i className="fa fa-twitter"></i>
                    <ul>
                        <li>
                            <strong><span className="count">30</span> k</strong>
                            <span>friends</span>
                        </li>
                        <li>
                            <strong><span className="count">450</span></strong>
                            <span>tweets</span>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default Card22;