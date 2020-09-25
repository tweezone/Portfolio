import React, { Component} from 'react';

class NotFound extends Component{
    render(){
        return(
            <div className="row justify-content-md-center">
                <div className="col col-md-6">
                    <div className="card text-white bg-danger rounded">
                        <img className="card-img-top" src='../../../images/direction for not found page.jpg' alt='not-found'/>
                        <div className="card-body text-center">
                            <h5 className="card-title">Page Not Found!</h5>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default NotFound;