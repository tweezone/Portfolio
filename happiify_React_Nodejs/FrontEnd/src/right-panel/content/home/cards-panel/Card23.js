import React, {Component} from 'react';

class Card23 extends Component {
    render(){
        return(
            <div className="col-lg-3 col-md-6">
                <div className="social-box linkedin">
                    <i className="fa fa-linkedin"></i>
                    <ul>
                        <li>
                            <strong><span className="count">40</span> +</strong>
                            <span>contacts</span>
                        </li>
                        <li>
                            <strong><span className="count">250</span></strong>
                            <span>feeds</span>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default Card23;