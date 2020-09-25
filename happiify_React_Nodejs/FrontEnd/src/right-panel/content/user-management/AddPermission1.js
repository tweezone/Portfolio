import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {Link} from 'react-router-dom';
import LANGUAGE from '../../../service/Language-data';
import apiRoot from '../../../config.api';

class AddPermission1 extends Component{
    state={
        subjectList: [],
        name: ''
    }

    static propTypes={
        langState: PropTypes.string.isRequired
    };

    handleChange=(e)=>{
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleClick=(e)=>{
        const { name, subjectList } = this.state;
        const haveOne = subjectList.find(one=> one.permission_name === name);
        if(name === ''){
            alert(`Please enter a permission name.`);
        }
        else if(haveOne){
            alert(`The permission name has been used. Please try again.`);
        }
        else{
            axios.post(apiRoot + "users/permissions/add1", { name })
                .then(res => {
                    alert("A first-level permission was added!");
                    this.setState({ name: '' });
                })
                .catch(err=>{
                    console.log("Adding a permission error in AddPermission1 component!");
            });
        }
        e.preventDefault();
    }

    handleJump = (id)=>{
        this.props.jump(id);
    }

    componentDidMount(){
        axios.get(apiRoot + "users/permissions")
            .then((res) => {
                this.setState({ subjectList: res.data });
            })
            .catch((err) => {            
                console.log("Getting permissions error in AddPermission1 component!");            
        });
    }

    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.AddPermission1.cn;
        else lang=LANGUAGE.AddPermission1.en;
        
        return(
            <div className="container-fluid">
                <div className="card rounded">
                    <div className="card-header">
                        <span style={{fontSize: "1.4em"}}><i className="fas fa-pencil-alt"></i>&nbsp;{lang[0]}</span>
                        <div className="float-right">
                            <div className=" btn-toolbar " >
                                <div className="btn-group-sm mr-2" role="group" aria-label="First group">
                                    <button type="button" className="btn btn-success" onClick={this.handleClick} title={lang[1]}><i className="fas fa-save"></i></button>
                                </div>
                                <Link to='/users/permissions' onClick={()=>this.handleJump('first-level')}>
                                    <div className="btn-group-sm mr-2" role="group" aria-label="Second group">
                                        <button type="button" className="btn btn-primary" title={lang[2]}><i className="fas fa-arrow-alt-circle-right"></i></button>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="card-body" style={{fontWeight: 'bold'}}>
                        <div className="row">
                            <div className="col col-sm-2 text-right input-group-sm">
                                <label htmlFor="name" className="col-form-label">{lang[3]}</label>
                            </div>
                            <div className="col col-sm-10 input-group-sm">
                                <input name="name" type="text" className="form-control" id="name" value={this.state.name} onChange={this.handleChange} required/>
                            </div>
                        </div>
                    </div>
                </div>            
            </div>
        );
    }
}

export default AddPermission1;