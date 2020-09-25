import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {Link} from 'react-router-dom';
import LANGUAGE from '../../../service/Language-data';
import apiRoot from '../../../config.api';

class UpdatePermission2 extends Component{
    state={
        subjectList: [],
        allFirstLevel: [],
        firstLevel: 0,
        name: '' 
    }

    static propTypes={
        langState: PropTypes.string.isRequired,
        permission2Id: PropTypes.number.isRequired
    };

    handleChange=(e)=>{
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleClick=(e)=>{
        const { name, firstLevel, subjectList } = this.state;
        const { permission2Id } = this.props;
        const oldName = subjectList.find(one=>one.id === permission2Id).permission_name;
        const haveOne = subjectList.find(one=> one.permission_name === name);
        if(name === '' || firstLevel === 0){
            alert(`Please enter a group name and upper group name.`);
        }
        else if(name !== oldName && haveOne){
            alert(`The permission name has been used. Please try again.`);
        }
        else{
            axios.put(apiRoot + "users/permissions/update2", { permission2Id, name, firstLevel })
                .then(res => {
                    alert("A second-level permission was updated!");
                    this.setState({
                        name: '',
                        firstLevel: 0
                    });                
                })
                .catch(err=>{
                    console.log("Updating a second-level permission error in UpdatePermission2 component!");
            });
        }
        e.preventDefault();
    }

    componentDidMount(){
        const { permission2Id } =this.props;
        axios.get(apiRoot + "users/permissions")
            .then((res) => {
                const allFirstLevel = res.data.filter(one=>+one.parent_id === 0);
                const name = res.data.find(one=>one.id === permission2Id).permission_name;
                const firstLevel = res.data.find(one=>one.id === permission2Id).parent_id;
                //const firstLevel = res.data.find(one=>one.id === firstLevelId).permission_name;
                this.setState({
                    name,
                    firstLevel,
                    allFirstLevel, 
                    subjectList: res.data
                 });
            })
            .catch((err) => {            
                console.log("Getting second-level permissions error in UpdatePermission2 component!");            
        });
    }


    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.UpdatePermission2.cn;
        else lang=LANGUAGE.UpdatePermission2.en;

        const {allFirstLevel} = this.state;
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
                                <Link to='/users/permissions'>
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
                        <hr/>
                        <div className="row">
                            <div className="col col-sm-2 text-right input-group-sm">
                                <label htmlFor="firstLevel" className="col-form-label">{lang[4]}</label>
                            </div>
                            <div className="col col-sm-10 input-group-sm">
                                <select name="firstLevel" className="custom-select mr-sm-2" id="firstLevel" value={this.state.firstLevel} onChange={this.handleChange}>
                                    <option value={ 0 }>{'--Please choose an option--'}</option>
                                    {allFirstLevel.map((one, index) => <option key={index} value={one.id}>{one.permission_name}</option> )}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>            
            </div>
        );
    }
}

export default UpdatePermission2;