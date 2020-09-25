import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {Link} from 'react-router-dom';
import LANGUAGE from '../../../service/Language-data';
import apiRoot from '../../../config.api';

import SearchBar from '../../../service/components/SearchBar';

class AddRole extends Component{
    state={
        searchContent:'',
        searchChange:'', 
        allFirstLevel: [],
        allSecondLevel: [],
        checkedArr1: [],
        checkedArr2: [],
        checkedAll: false,
        subjectList: [],
        name: ''
    }

    static propTypes={
        langState: PropTypes.string.isRequired
    };

    handleSearchContent=(e)=>{
        this.setState({
            searchChange: e.target.value
        });
    };
    
    handleSearchSubmit=(e)=>{
        this.setState({
            searchContent: this.state.searchChange,
            currentPage: 1,        
        });
        e.preventDefault();
    }

    handleChange=(e)=>{
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleCheckedSecondLevel=(e,id)=>{
        let { checkedArr1, checkedArr2, checkedAll } = this.state;
        let currentOne = checkedArr2.find(one=>one.id === id);
        currentOne.value = e.target.checked;

        let forCheckedAllSecond = checkedArr2.filter(one=>one.pid === currentOne.pid).filter(one=> one.value);
        if(forCheckedAllSecond.length === 0) checkedArr1.find(one=> one.id === currentOne.pid).value = false;
        else checkedArr1.find(one=> one.id === currentOne.pid).value = true;
        
        let forCheckedAllFirst = checkedArr1.find(one=>!one.value);
        if(forCheckedAllFirst) checkedAll=false;

        this.setState({ checkedArr1, checkedArr2, checkedAll }); 
    }

    handleCheckedFirstLevel=(e,id)=>{
        let { checkedArr1, checkedArr2, checkedAll } = this.state;        
        checkedArr2.filter(one=>one.pid === id).forEach( one=>{one.value = e.target.checked });
        checkedArr1.find(one=>one.id === id).value = e.target.checked;

        let forCheckedAllFirst = checkedArr1.find(one=>!one.value);
        if(forCheckedAllFirst) checkedAll=false;

        this.setState({ checkedArr1, checkedArr2, checkedAll }); 
    }

    handleCheckedAll=(e)=>{
        const { checkedArr1, checkedArr2 } = this.state;
        checkedArr1.forEach( one=>{one.value = e.target.checked });
        checkedArr2.forEach( one=>{one.value = e.target.checked });

        this.setState({ checkedArr1, checkedArr2, checkedAll: e.target.checked });
    }


    handleClick=(e)=>{
        let { name, subjectList, checkedArr1, checkedArr2 } = this.state;
        const checkedArr = checkedArr1.concat(checkedArr2);
        const haveOne = subjectList.find(one=> one.group_name === name);
        if(name === ''){
            alert(`Please enter a group name.`);
        }
        else if(haveOne){
            alert(`The group name has been used. Please try again.`);
        }
        else{
            axios.post(apiRoot + "users/roles/add", { name, checkedArr })
                .then(res => {
                    alert("A group was added!");
                    axios.get(apiRoot + "users/permissions")
                    .then((res) => {
                        let checkedArr2=[];
                        const allSecondLevel = res.data.filter(one=>+one.parent_id !== 0);
                        allSecondLevel.forEach(one=>{
                            checkedArr2.push( {id: one.id, pid: one.parent_id, value: false} )
                        });

                        let checkedArr1=[];
                        const allFirstLevel = res.data.filter(one=>+one.parent_id === 0);
                        allFirstLevel.forEach(one=>{
                            checkedArr1.push( {id: one.id,  pid: one.parent_id, value: false} )
                        });

                        this.setState({ 
                            checkedArr2, 
                            allSecondLevel,
                            checkedArr1,
                            allFirstLevel,
                            name: '',
                            checkedAll: false
                        });
                    })
                })
                .catch(err=>{
                    console.log("Adding a group error in AddRole component!");
            });
        }
        e.preventDefault();
    }

    componentDidMount(){
        axios.get(apiRoot + "users/roles")
            .then((res) => {
                this.setState({ subjectList: res.data });
            })
            .catch((err) => {            
                console.log("Getting roles error in AddRole component!");            
        });

        axios.get(apiRoot + "users/permissions")
            .then((res) => {
                let checkedArr2=[];
                const allSecondLevel = res.data.filter(one=>+one.parent_id !== 0);
                allSecondLevel.forEach(one=>{
                    checkedArr2.push( {id: one.id, pid: one.parent_id, value: false} )
                });

                let checkedArr1=[];
                const allFirstLevel = res.data.filter(one=>+one.parent_id === 0);
                allFirstLevel.forEach(one=>{
                    checkedArr1.push( {id: one.id,  pid: one.parent_id, value: false} )
                });

                this.setState({ 
                    checkedArr2, 
                    allSecondLevel,
                    checkedArr1,
                    allFirstLevel
                });
            })
            .catch((err) => {            
                console.log("Getting permissions error in AddRole component!");            
        });
    }

    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.AddRole.cn;
        else lang=LANGUAGE.AddRole.en;

        const {allFirstLevel, allSecondLevel, checkedArr1, checkedArr2, searchContent } = this.state;
        const row=[];
        let count = 0;
        allFirstLevel.forEach((one1, index1)=>{
            row.push( 
                    <tr key={count++} className="table-active">
                        <th className="text-center">{one1.id}</th>
                        <th>{one1.permission_name}</th>
                        <td className="text-center"><input type="checkbox" name="checkbox" checked={checkedArr1.find(one=> one.id === one1.id).value} onChange={(e)=>this.handleCheckedFirstLevel(e, one1.id)}/></td>        
                    </tr>
            );
            allSecondLevel.filter((one2, index2)=> one2.parent_id === one1.id ).forEach((one3, index3)=>{
                if( (one3.permission_name.toUpperCase().indexOf(searchContent.toUpperCase())===-1)){
                    return;
                }
                row.push(
                    <tr key={count++} >
                        <th className="text-center">{one3.id}</th>
                        <td>{one3.permission_name}</td>
                        <td className="text-center"><input type="checkbox" name="checkbox" checked={checkedArr2.find(one=> one.id === one3.id).value} onChange={(e)=>this.handleCheckedSecondLevel(e, one3.id)}/></td>        
                    </tr>
                );
            })
        });
        
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
                                <Link to='/users/roles'>
                                    <div className="btn-group-sm mr-2" role="group" aria-label="Second group">
                                        <button type="button" className="btn btn-primary" title={lang[2]}><i className="fas fa-arrow-alt-circle-right"></i></button>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="card-body" style={{fontWeight: 'bold'}}>
                        <div className="row mb-3">
                            <div className="col col-sm-2 text-right input-group-sm">
                                <label htmlFor="name" className="col-form-label">{lang[3]}</label>
                            </div>
                            <div className="col col-sm-10 input-group-sm">
                                <div className="col col-sm-12 input-group-sm">
                                    <input name="name" type="text" className="form-control" id="name" value={this.state.name} onChange={this.handleChange} required/>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col col-sm-2 text-right input-group-sm">
                                <label htmlFor="name" className="col-form-label">{lang[4]}</label>
                            </div>
                            <div className="col col-sm-10 input-group-sm">
                                <div className="col col-sm-6 input-group-sm">
                                    <SearchBar 
                                        langState={this.props.langState}
                                        searchContent={this.handleSearchContent}
                                        searchSubmit={this.handleSearchSubmit} />   
                                    <div className="table-responsive">
                                        <table className="table table-hover table-bordered rounded">
                                            <thead>
                                                <tr className="table-primary">
                                                    <th scope="col" style={{width: "5%"}} className="text-center">#</th>
                                                    <th scope="col" style={{width: "45%"}}>Name</th>
                                                    <th scope="col" style={{width: "5%"}} className="text-center"><input checked={this.state.checkedAll} type="checkbox" onChange={this.handleCheckedAll}/></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {row}
                                            </tbody>
                                        </table>
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

export default AddRole;