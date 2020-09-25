import React, {Component} from 'react';
//import PropTypes from 'prop-types';
import axios from 'axios';
import {Link} from 'react-router-dom';
import LANGUAGE from '../service/Language-data';
import apiRoot from '../config.api';

class Header extends Component{
    state={
            flag: "../../images/flags/4x3/ca.svg",
            user_portrait: ''
        }

    handleLangCN=()=>{
        this.setState(
            {flag: "../../images/flags/4x3/cn.svg"}
        );
        this.props.langCN();
        
    }

    handleLangEN=()=>{
        this.setState(
            {flag: "../../images/flags/4x3/ca.svg"}
        );
        this.props.langEN();        
    }

    handleLogOutClick=()=>{
        this.props.logOutClick();
    }
    
    componentDidUpdate(prevProps){
        const { logInName, authorization } = this.props;
        if(authorization !== prevProps.authorization){
            if(authorization==='true'){
                axios.get(apiRoot + "users")
                .then((res) => {
                    const currentOne = res.data.find(one=> one.username === logInName);                     
                    let user_portrait = '';
                    currentOne? user_portrait = currentOne.portrait : user_portrait = '';
                    this.setState({ user_portrait });
                })
                .catch((err) => {            
                    console.log("Getting users error in Header component!");            
                });
            }
        }
    }

    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.Header.cn;
        else lang=LANGUAGE.Header.en;

        const { authorization } = this.props;
        const { user_portrait } = this.state;
        return(          
            <header id="header" className="header">
                <div className="header-menu">
                    <div className="col-sm-7">
                        <a href="0" onClick={(e)=>e.preventDefault()} id="menuToggle" className="menutoggle pull-left"><i className="fas fa-tasks"></i></a>
                    </div>
                        {/*<div className="header-left">
                            <button className="search-trigger"><i className="fa fa-search"></i></button>
                            <div className="form-inline">
                                <form className="search-form">
                                    <input className="form-control mr-sm-2" type="text" placeholder="Search ..." aria-label="Search"/>
                                    <button className="search-close" type="submit"><i className="fa fa-close"></i></button>
                                </form>
                            </div>

                            <div className="dropdown for-notification">
                            <button className="btn btn-secondary dropdown-toggle" type="button" id="notification" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="fa fa-bell"></i>
                                <span className="count bg-danger">5</span>
                            </button>
                            <div className="dropdown-menu" aria-labelledby="notification">
                                <p className="red">You have 3 Notification</p>
                                <a className="dropdown-item media bg-flat-color-1">
                                    <i className="fa fa-check"></i>
                                    <p>Server #1 overloaded.</p>
                                </a>
                                <a className="dropdown-item media bg-flat-color-4">
                                    <i className="fa fa-info"></i>
                                    <p>Server #2 overloaded.</p>
                                </a>
                                <a className="dropdown-item media bg-flat-color-5">
                                    <i className="fa fa-warning"></i>
                                    <p>Server #3 overloaded.</p>
                                </a>
                            </div>
                            </div>
                            <div className="dropdown for-message">
                            <button className="btn btn-secondary dropdown-toggle" type="button"
                                    id="message"
                                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i className="ti-email"></i>
                                <span className="count bg-primary">9</span>
                            </button>
                            <div className="dropdown-menu" aria-labelledby="message">
                                <p className="red">You have 4 Mails</p>
                                <a className="dropdown-item media bg-flat-color-1">
                                    <span className="photo media-left"><img alt="avatar" src="images/avatar/1.jpg"/></span>
                                    <span className="message media-body">
                                        <span className="name float-left">Jonathan Smith</span>
                                        <span className="time float-right">Just now</span>
                                            <p>Hello, this is an example msg</p>
                                    </span>
                                </a>
                                <a className="dropdown-item media bg-flat-color-4">
                                    <span className="photo media-left"><img alt="avatar" src="images/avatar/2.jpg"/></span>
                                    <span className="message media-body">
                                        <span className="name float-left">Jack Sanders</span>
                                        <span className="time float-right">5 minutes ago</span>
                                            <p>Lorem ipsum dolor sit amet, consectetur</p>
                                    </span>
                                </a>
                                <a className="dropdown-item media bg-flat-color-5">
                                    <span className="photo media-left"><img alt="avatar" src="images/avatar/3.jpg"/></span>
                                    <span className="message media-body">
                                        <span className="name float-left">Cheryl Wheeler</span>
                                        <span className="time float-right">10 minutes ago</span>
                                            <p>Hello, this is an example msg</p>
                                    </span>
                                </a>
                                <a className="dropdown-item media bg-flat-color-3">
                                    <span className="photo media-left"><img alt="avatar" src="images/avatar/4.jpg"/></span>
                                    <span className="message media-body">
                                        <span className="name float-left">Rachel Santos</span>
                                        <span className="time float-right">15 minutes ago</span>
                                            <p>Lorem ipsum dolor sit amet, consectetur</p>
                                    </span>
                                </a>
                            </div>
                            </div>
                        </div>
                    </div>*/}
                    
                    <div className="col align-self-center">
                        <div className="col-sm-7">
                            <div className="btn-group float-left ml-2">
                                <p>Version: 0.0.8</p>
                            </div>
                        </div>
                        <div className="col-sm-5">
                            <div className="btn-group float-right">
                                <div className="dropdown mr-2">
                                    <a href="0" onClick={(e)=>e.preventDefault()} id="dLabel" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-offset="0,10">
                                        <img className='flag-icon' src={(this.props.langState !== 'cn')? '../../images/flags/4x3/ca.svg':'../../images/flags/4x3/cn.svg'} alt="flag"/>
                                    </a>
                                    <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dLabel" style={{minWidth: "75px"}}>
                                        <button className="dropdown-item" type="button" onClick={this.handleLangCN}>
                                            <img className='flag-icon' src='../../images/flags/4x3/cn.svg' alt="flag"/>
                                        </button>
                                        <div className="dropdown-divider"></div>
                                        <button className="dropdown-item" type="button" onClick={this.handleLangEN}>
                                            <img className='flag-icon' src='../../images/flags/4x3/ca.svg' alt="flag"/>
                                        </button>
                                    </div>
                                </div>
                                <div className="dropdown" >
                                    <a href="0" onClick={(e)=>e.preventDefault()} id="dLabel" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-offset="0,10">
                                        {authorization === "true" && 
                                        (()=>{
                                            switch(user_portrait.slice(0,4)){
                                                case '':        return (null);
                                                case 'http':    return (<img className="user-avatar rounded-circle" src={user_portrait} alt="User Avatar" width="25" height="25"/>);
                                                default:        return (<img className="user-avatar rounded-circle" src={apiRoot + 'display/image/file?file=' + user_portrait} alt="User Avatar" width="25" height="25"/>)
                                            }                                            
                                        })()}
                                    </a>
                                    <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dLabel" style={{fontSize: '0.8em'}}>
                                        <button className="dropdown-item" type="button">{lang[0]}</button>
                                        <button className="dropdown-item" type="button">{lang[1]}</button>
                                        <button className="dropdown-item" type="button">{lang[2]}</button>
                                        <div className="dropdown-divider"></div>
                                        <Link to="/login" className="dropdown-item" onClick={this.handleLogOutClick}><i className="fa fa-power -off"></i>{lang[3]}</Link>
                                    </div>
                                </div>
                            </div>







                            {/*<div className="user-area dropdown float-right">
                                <a className="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    {authorization && currentOne && 
                                        (()=>{
                                            switch(currentOne.portrait.slice(0,4)){
                                                case '':        return (null);
                                                case 'http':    return (<img className="user-avatar rounded-circle" src={currentOne.portrait} alt="User Avatar"/>);
                                                default:        return (<img className="user-avatar rounded-circle" src={apiRoot + 'display/image/file?file=' + currentOne.portrait} alt="User Avatar"/>)
                                            }
                                        })()}
                                </a>
                                <div className="user-menu dropdown-menu">
                                    <a className="nav-link" href=""><i className="fa fa- user"></i>My Profile</a>
                                    <a className="nav-link" href=""><i className="fa fa- user"></i>Notifications <span className="count">13</span></a>
                                    <a className="nav-link" href=""><i className="fa fa -cog"></i>Settings</a>
                                    <Link to="/login" className="nav-link" onClick={this.handleLogOutClick}><i className="fa fa-power -off"></i>Logout</Link>
                                </div>
                            </div>
                            <div className="language-select dropdown" id="language-select">
                                <a className="dropdown-toggle" href="" data-toggle="dropdown"  id="language" aria-haspopup="true" aria-expanded="true">
                                    <img className='flag-icon' src={(this.props.langState !== 'cn')? '../../images/flags/4x3/ca.svg':'../../images/flags/4x3/cn.svg'} alt="flag"/>
                                </a>
                                <div className="dropdown-menu" aria-labelledby="language" >                            
                                    <div className="dropdown-item" >
                                        <img className='flag-icon' src='../../images/flags/4x3/cn.svg' onClick={this.handleLangCN} alt="flag"/>
                                    </div>
                                    <div className="dropdown-item" >
                                    <img className='flag-icon' src='../../images/flags/4x3/ca.svg' onClick={this.handleLangEN} alt="flag"/>
                                    </div>                                
                                </div>
                            </div>*/}
                        </div>
                    </div>
                </div>
            </header>
        );
    }

}

export default Header;