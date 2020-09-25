import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {Link} from 'react-router-dom';
import LANGUAGE from '../../../service/Language-data';
import apiRoot from '../../../config.api';

class UpdatePermission1 extends Component{
    state={
        subjectList: [],
        name: ''
    }

    static propTypes={
        langState: PropTypes.string.isRequired,
        permission1Id: PropTypes.number.isRequired
    };

    handleChange=(e)=>{
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleClick=(e)=>{
        const { name, subjectList } = this.state;
        const { permission1Id } = this.props;
        const oldName = subjectList.find(one=>one.id === permission1Id).permission_name;
        const haveOne = subjectList.find(one=> one.permission_name === name);
        if(name === ''){
            alert(`Please enter a first-level permission name.`);
        }
        else if(name !== oldName && haveOne){
            alert(`The permission name has been used. Please try again.`);
        }
        else{
            axios.put(apiRoot + "users/permissions/update1", { permission1Id, name })
                .then(res => {
                    alert("A first-level permission was updated!");
                    this.setState({ name: '' });                
                })
                .catch(err=>{
                    console.log("Updating a first-level permission error in UpdatePermission1 component!");
            });
        }
        e.preventDefault();
    }

    handleJump = (id)=>{
        this.props.jump(id);
    }

    componentDidMount(){
        const { permission1Id } =this.props;
        axios.get(apiRoot + "users/permissions")
            .then((res) => {
                const currentOne = res.data.find(one => one.id === permission1Id);
                this.setState({ 
                    subjectList: res.data,
                    name: currentOne.permission_name
                });
            })
            .catch((err) => {            
                console.log("Getting first-level permission error in UpdatePermission1 component!");            
            });
    }

    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.UpdatePermission1.cn;
        else lang=LANGUAGE.UpdatePermission1.en;
        
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
                                <input name="name" type="text" className="form-control" id="name" value={this.state.name} onChange={this.handleChange}/>
                            </div>
                        </div>
                    </div>
                </div>            
            </div>
        );
    }
}

export default UpdatePermission1;