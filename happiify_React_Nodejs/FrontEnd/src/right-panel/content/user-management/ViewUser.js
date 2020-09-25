import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {Link} from 'react-router-dom';
import LANGUAGE from '../../../service/Language-data';
import apiRoot from '../../../config.api';

class ViewUser extends Component{
    state={
        currentOne: {},
        username: '',
        email: '',
        mobile: '',
        role: '',
        image: '',
        Last_login: ''
    }

    static propTypes={
        langState: PropTypes.string.isRequired,
        logInName: PropTypes.string.isRequired,
        userId: PropTypes.number.isRequired
    };

    
    componentDidMount(){
        const { userId } = this.props;
        axios.get(apiRoot + "users")
            .then((res) => {
                const currentOne = res.data.find(one=>one.id === userId);
                this.setState({
                    currentOne,
                    username: currentOne.username,
                    email: currentOne.email,
                    mobile: currentOne.mobile,
                    role: currentOne.group_name,
                    image: currentOne.portrait,
                    Last_login: currentOne.last_login_time
                });
            })
            .catch((err) => {           
                console.log("Getting the user error in ViewUser component!");            
        });
    }

    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.ViewUser.cn;
        else lang=LANGUAGE.ViewUser.en;

        const { username, email, mobile, role, image, Last_login } = this.state;
        
        return(
            <div className="container-fluid">
                <div className="card rounded">
                    <div className="card-header">
                        <span style={{fontSize: "1.4em"}}><i className="fas fa-pencil-alt"></i>&nbsp;{lang[0]}</span>
                        <div className="float-right">
                            <Link to='/users' className="btn btn-primary btn-sm rounded" title={lang[1]}>
                                <i className="fas fa-arrow-alt-circle-right"></i>
                            </Link>
                        </div>
                    </div>
                    <div className="card-body" style={{fontWeight: 'bold'}}>
                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                            <li className="nav-item">
                                <a className="nav-link active" id="general-tab" data-toggle="tab" href="#overview" role="tab" aria-controls="general" aria-selected="true">{lang[2]}</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" id="activity-tab" data-toggle="tab" href="#activity" role="tab" aria-controls="activity" aria-selected="false">{lang[3]}</a>
                            </li>
                        </ul>
                        <div className="tab-content" id="myTabContent">
                            {/*Overview panel----------------------------------------------------------------------------------------------- */}
                            <div className="tab-pane fade show active" id="overview" role="tabpanel" aria-labelledby="general-tab">
                                <div className="row mt-3">
                                    <div className="col col-sm-2 text-right input-group-sm">
                                        <div className="text-center" >
                                            {(()=>{
                                                switch(image.slice(0,4)){
                                                    case '':        return (<img style={{verticalAlign: 'middle'}} className="card-img-top" src="../../../images/default_user.png"  alt={'user icon'}/>);
                                                    case 'http':    return (<img style={{verticalAlign: 'middle'}} className="card-img-top" src={image} alt={123}/>);
                                                    default:        return (<a style={{verticalAlign: 'middle'}} href={apiRoot + 'display/image/file?file=' + image}>
                                                                                <img className="card-img-top" src={apiRoot + 'display/image/file?file=' + image} alt={123}/>
                                                                            </a>) }
                                             })()}
                                        </div>
                                    </div>
                                    <div className="col col-sm-10 input-group-sm">
                                        <div className="table-responsive">
                                            <table className="table table-hover table-striped table-bordered">
                                                <tbody>
                                                    <tr>
                                                        <th scope="col" style={{width: "20%"}}>{lang[4]}</th>
                                                        <th scope="col" style={{width: "80%"}}>{username}</th>
                                                    </tr>
                                                    <tr>
                                                        <th scope="col" style={{width: "20%"}}>{lang[5]}</th>
                                                        <th scope="col" style={{width: "80%"}}>{email}</th>
                                                    </tr>
                                                    <tr>
                                                        <th scope="col" style={{width: "20%"}}>{lang[6]}</th>
                                                        <th scope="col" style={{width: "80%"}}>{mobile}</th>
                                                    </tr>
                                                    <tr>
                                                        <th scope="col" style={{width: "20%"}}>{lang[7]}</th>
                                                        <th scope="col" style={{width: "80%"}}>{Last_login}</th>
                                                    </tr>
                                                    <tr>
                                                        <th scope="col" style={{width: "20%"}}>{lang[8]}</th>
                                                        <th scope="col" style={{width: "80%"}}>{role}</th>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div> 
                            </div>
                            {/*Activity panel----------------------------------------------------------------------------------------------- */}
                            <div className="tab-pane fade" id="activity" role="tabpanel" aria-labelledby="activity-tab">
                                <div className="form-group col-md-9 mt-3">
                                    <div className="card rounded">
                                        <div className="card-header"> 
                                            <span>Select List</span>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col col-sm-2 text-right input-group-sm">
                                                    <label htmlFor="activity" className="col-form-label">Category</label>
                                                </div>
                                                <div className="col col-sm-10 input-group-sm">
                                                    <select multiple={true} size="5" name="activity" className="custom-select mr-sm-2" id="activity" value={this.state.tags_name} onChange={this.handleMultiSelect}>
                                                        
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group col-md-3 mt-3">
                                    <div className="card rounded">
                                        <div className="card-header"> 
                                            <span>Selected Result</span>
                                        </div>
                                        <div className="card-body">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>            
            </div>
        );
    }
}

export default ViewUser;