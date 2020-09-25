import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {Link} from 'react-router-dom';
import LANGUAGE from '../../../service/Language-data';
import apiRoot from '../../../config.api';

import SearchBar from '../../../service/components/SearchBar';
import PagingBar from '../../../service/components/PagingBar';

///*
class permissionManagement extends Component{
    state={
        subjectList:[],
        searchContent2:'',     // Accept the value of "change"; Used for search after the button is clicked.
        searchChange2:'',      // Accept the value changed in "input".
        currentPage2: 1,
        checkedArr2: [],
        checkedIds2: [],
        checkedGroups2: [],
        checkedAll2: false,

        allFirstLevel: [],
        searchContent1:'',     // Accept the value of "change"; Used for search after the button is clicked.
        searchChange1:'',      // Accept the value changed in "input".
        currentPage1: 1,
        checkedArr1: [],
        checkedIds1: [],
        checkedGroups1: [],
        checkedAll1: false,
    };

    static propTypes={
        langState: PropTypes.string.isRequired,
        clickUpdate2: PropTypes.func.isRequired,
        clickUpdate1: PropTypes.func.isRequired,
        //jumpToPermission1: PropTypes.string.isRequired
    };

    // For Second-Level permission Operations------------------------------------------------------------------------------------
    handleSearchContent2=(e)=>{
        this.setState({
            searchChange2: e.target.value
        });
    };
    
    handleSearchSubmit2=(e)=>{
        this.setState({
            searchContent2: this.state.searchChange2,
            currentPage2: 1,        
        });
        e.preventDefault();
    }

    handlePageChange2=(e)=>{
        this.setState({
            currentPage2: +e.target.value
        });
    }

    handleChecked2=(e, i, name)=>{
        let {checkedArr2} = this.state;
        checkedArr2[i] = !checkedArr2[i];

        let id = e.target.value;
        let group = name;
        let ids = this.state.checkedIds2;
        let groups = this.state.checkedGroups2;
        let index_id = ids.indexOf(+id);
        let index_group = groups.indexOf(group);
        e.target.checked === true? ids.push(+id) : ids.splice(index_id,1);
        e.target.checked === true? groups.push(group) : groups.splice(index_group,1);
        this.setState({ 
            checkedIds2: ids,
            checkedGroups2: groups,
            checkedArr2
        });
    }

    handleCheckedAll2=(e)=>{
        let {checkedArr2,subjectList } = this.state;
        let tempArr=[];
        let ids = [];
        if(e.target.checked){
            checkedArr2.forEach(one=> tempArr.push(!one))
            subjectList.forEach((one, index) => { if(tempArr[index] && one.parent_id !== 0) ids.push(+one.id)})
        }
        else{
            checkedArr2.forEach(one=> tempArr.push(false));
        }
        this.setState({
            checkedArr2 : tempArr,
            checkedIds2 : ids,
            checkedAll2 : e.target.checked
        });
    }

    handleClickDelete2=(e)=>{
        const {checkedIds2} = this.state;
        const idsString=checkedIds2.toString();

        if(checkedIds2.length===0){
            alert(`You did NOT select any item!`);
        }
        else{
            if(window.confirm(`Do you really want to delete No. ${idsString} ${checkedIds2.length>1? 'permissions':'permission'}?`)){
                axios.put(apiRoot + "users/permissions/delete2", { checkedIds2 })
                    .then(res => {
                        alert(`You have deleted ${checkedIds2.length>1? checkedIds2.length +' permissions':'an permission'}.`);
                        axios.get(apiRoot + "users/permissions")
                        .then((res) => {                   
                            let checkedArr2=[];
                            res.data.forEach(one=>{
                                checkedArr2.push( false )
                            });
                            this.setState({
                                subjectList: res.data,
                                checkedArr2,
                                checkedIds2: [],
                                checkedAll2: false
                            });  
                        })
                        .catch((err) => {            
                            console.log("Getting permissions error in RoleManagement component!");            
                        });
                    })
                    .catch(err=>{
                        console.log("Deleting permission error in RoleManagement component!");
                });
                e.preventDefault();
            }
        }
    }

    handleClickUpdate2=(e)=>{
        this.props.clickUpdate2(e);        
    }
    //--------------------------------------------------------------------------------------------------------------------------
    // For First-Level permission Operations------------------------------------------------------------------------------------
    handleSearchContent1=(e)=>{
        this.setState({
            searchChange1: e.target.value
        });
    };

    handleSearchSubmit1=(e)=>{
        this.setState({
            searchContent1: this.state.searchChange1,
            currentPage1: 1,        
        });
        e.preventDefault();
    }

    handlePageChange1=(e)=>{
        this.setState({
            currentPage1: +e.target.value
        });
    }

    handleChecked1=(e, i, name)=>{
        let {checkedArr1} = this.state;
        checkedArr1[i] = !checkedArr1[i];

        let id = e.target.value;
        let group = name;
        let ids = this.state.checkedIds1;
        let groups = this.state.checkedGroups1;
        let index_id = ids.indexOf(+id);
        let index_group = groups.indexOf(group);
        e.target.checked === true? ids.push(+id) : ids.splice(index_id,1);
        e.target.checked === true? groups.push(group) : groups.splice(index_group,1);
        this.setState({ 
            checkedIds1: ids,
            checkedGroups1: groups,
            checkedArr1
        });
    }

    handleCheckedAll1=(e)=>{
        let {checkedArr1,subjectList } = this.state;
        let tempArr=[];
        let ids = [];
        if(e.target.checked){
            checkedArr1.forEach(one=> tempArr.push(!one))
            subjectList.forEach((one, index) => { if(tempArr[index]) ids.push(+one.id)})
        }
        else{
            checkedArr1.forEach(one=> tempArr.push(false));
        }
        this.setState({
            checkedArr1 : tempArr,
            checkedIds1 : ids,
            checkedAll1 : e.target.checked
        });
    }

    handleClickDelete1=(e)=>{
        const {checkedIds1, subjectList} = this.state;
        const idsString=checkedIds1.toString();

        const hasOneOnit = subjectList.filter(one=>checkedIds1.includes(one.parent_id));

        if(checkedIds1.length===0){
            alert(`You did NOT select any item!`);
        }
        else{
            if(window.confirm(`Do you really want to delete No. ${idsString} ${checkedIds1.length>1? 'permissions':'permission'}?`)){
                if(checkedIds1.length===1 && hasOneOnit.length!==0){
                    alert(`There is at least one permission under this first-level permission. You can NOT delete it.`);
                }
                else if(checkedIds1.length>1 && hasOneOnit.length!==0){
                    alert(`There is at least one permission under at least one of the first-level permissions you checked. You can NOT delete all of them.`);
                }
                else{    
                    axios.put(apiRoot + "users/permissions/delete1", { checkedIds1 })
                        .then(res => {
                            alert(`You have deleted ${checkedIds1.length>1? checkedIds1.length +' permissions':'a permission'}.`);
                            axios.get(apiRoot + "users/permissions")
                            .then((res) => {                   
                                let checkedArr1=[];
                                const allFirstLevel = res.data.filter(one=>+one.parent_id === 0);
                                allFirstLevel.forEach(one=>{ checkedArr1.push( false ) });
                                this.setState({
                                    subjectList: res.data,
                                    allFirstLevel,
                                    checkedArr1,                                    
                                    checkedIds1: [],
                                    checkedAll1: false
                                });  
                            })
                            .catch((err) => {            
                                console.log("Getting permissions error in RoleManagement component!");            
                            });
                        })
                        .catch(err=>{
                            console.log("Deleting permission error in RoleManagement component!");
                    });
                    e.preventDefault();
                }
            }
        }
    }

    handleClickUpdate1=(e)=>{
        this.props.clickUpdate1(e);        
    }
    //--------------------------------------------------------------------------------------------------------------------------
    componentDidMount(){
        axios.get(apiRoot + "users/permissions")
            .then((res) => {
                let checkedArr2=[];
                res.data.forEach(one=>{
                    checkedArr2.push( false )
                });

                let checkedArr1=[];
                const allFirstLevel = res.data.filter(one=>+one.parent_id === 0);
                allFirstLevel.forEach(one=>{
                    checkedArr1.push( false )
                });

                this.setState({ 
                    checkedArr2, 
                    subjectList: res.data,
                    checkedArr1,
                    allFirstLevel
                });
            })
            .catch((err) => {            
                console.log("Getting permissions error in permissionManagement component!");            
        });
    }

    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.PermissionManagement.cn;
        else lang=LANGUAGE.PermissionManagement.en;

        const {subjectList, allFirstLevel, searchContent2, currentPage2, searchContent1, currentPage1} = this.state;
        const { logInName } = this.props;

        const row2=[];
        subjectList.forEach((one, index)=>{            
            if( (one.permission_name.toUpperCase().indexOf(searchContent2.toUpperCase())===-1)){ return; }
            else if(one.parent_id === 0){ return; }
            const firstLevel = subjectList.find(item => item.id === one.parent_id)            
            row2.push(
                <tr key={index} >
                    <td style={{verticalAlign: 'middle'}} className="text-center"><input type="checkbox" name="checkbox" checked={this.state.checkedArr2[index]} value={one.id} onChange={(e)=>this.handleChecked2(e, index, one.permission_name)}/></td>
                    <td style={{verticalAlign: 'middle'}} className="text-center">{one.id}</td>
                    <td style={{verticalAlign: 'middle'}} >{one.permission_name}</td>
                    <td style={{verticalAlign: 'middle'}} >{firstLevel? firstLevel.permission_name: ''}</td>
                    {
                        logInName==='Steven'?
                        <td style={{verticalAlign: 'middle'}} className="text-center">
                            <Link to="/users/permissions/update2" className="btn btn-success mr-2 btn-sm rounded" onClick={()=>this.handleClickUpdate2(one.id)} title={lang[8]}><i className="fas fa-pencil-alt"></i></Link>
                        </td>:null
                    }
                    
                </tr>
            );
        });
        const totalPages2=Math.ceil(row2.length/10);
        const onePage2=row2.reverse().slice((currentPage2*10-10), (currentPage2*10));

        const row1=[];
        allFirstLevel.forEach((one, index)=>{            
            if( (one.permission_name.toUpperCase().indexOf(searchContent1.toUpperCase())===-1)){ return; }
            row1.push(
                <tr key={index} >
                    <td style={{verticalAlign: 'middle'}} className="text-center"><input type="checkbox" name="checkbox" checked={this.state.checkedArr1[index]} value={one.id} onChange={(e)=>this.handleChecked1(e, index, one.permission_name)}/></td>
                    <td style={{verticalAlign: 'middle'}} className="text-center">{one.id}</td>
                    <td style={{verticalAlign: 'middle'}} >{one.permission_name}</td>
                    {
                        logInName==='Steven'?
                        <td style={{verticalAlign: 'middle'}} className="text-center">
                            <Link to="/users/permissions/update1" className="btn btn-success mr-2 btn-sm rounded" onClick={()=>this.handleClickUpdate1(one.id)} title={lang[14]}><i className="fas fa-pencil-alt"></i></Link>
                        </td>:null
                    }
                </tr>
            );
        });
        const totalPages1=Math.ceil(row1.length/10);
        const onePage1=row1.reverse().slice((currentPage1*10-10), (currentPage1*10));

        // Ensure that return to the first-level permission tab when click "return" in AddPermission1 or UpdatePermission1 conmponent.
        const { jumpToPermission1 } = this.props;
        let show1 = 'tab-pane fade mt-3';
        let show2 = 'tab-pane fade show active mt-3'
        let show11 = "nav-link"
        let show22 = "nav-link active"
            if (jumpToPermission1 !== '') {
                show1 = 'tab-pane fade show active mt-3';
                show2 = 'tab-pane fade mt-3';
                show11 = "nav-link active";
                show22 = "nav-link";
                sessionStorage.setItem('jumpToPermission1', '')
            }

        return(
            <div className="container-fluid">
                <div className="card rounded">
                    <div className="card-header">
                        <span style={{fontSize: "1.4em"}}>{lang[0]}</span>
                    </div>
                    <div className="card-body">
                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                            <li className="nav-item">
                                <a className={show22} id="general-tab" data-toggle="tab" href="#overview" role="tab" aria-controls="general" aria-selected="true">{lang[1]}</a>
                            </li>
                            <li className="nav-item">
                                <a className={show11} id="category-tab" data-toggle="tab" href="#category" role="tab" aria-controls="category" aria-selected="false">{lang[2]}</a>
                            </li>
                        </ul>
                        <div className="tab-content" id="myTabContent">
                            {/*Second-Level permission----------------------------------------------------------------------------------------------- */}
                            <div className={show2}id="overview" role="tabpanel" aria-labelledby="general-tab">
                                <div className="row">
                                    <div className="col">
                                        <div className="float-left">
                                            <SearchBar 
                                                langState={this.props.langState}
                                                searchContent={this.handleSearchContent2}
                                                searchSubmit={this.handleSearchSubmit2} />
                                        </div>
                                    </div>
                                    {
                                        logInName==='Steven'?
                                        <div className="col">
                                            <div className="btn-group float-right">
                                                <Link to='/users/permissions/add2' className="btn btn-primary btn-sm rounded mr-2" title={lang[3]}><i className="fas fa-plus-square"></i></Link>
                                                <button type="button" className="btn btn-danger btn-sm rounded" onClick={this.handleClickDelete2} title={lang[4]}><i className="fas fa-trash-alt"></i></button>
                                            </div>
                                        </div>:null
                                    }
                                    
                                </div>
                                <div className="table-responsive rounded">
                                    <table className="table table-hover table-bordered" id="table">
                                        <thead>
                                            <tr className="table-primary">
                                                <th scope="col" style={{width: "5%"}} className="text-center"><input checked={this.state.checkedAll2} type="checkbox" onChange={this.handleCheckedAll2}/></th>
                                                <th scope="col" style={{width: "5%"}} className="text-center">#</th>
                                                <th scope="col" style={{width: "40%"}}>{lang[5]}</th>
                                                <th scope="col" style={{width: "45%"}}>{lang[6]}</th>
                                                {
                                                    logInName==='Steven'?
                                                    <th scope="col" style={{width: "5%"}} className="text-center">{lang[7]}</th>:null
                                                }
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {onePage2}
                                        </tbody>
                                    </table>
                                </div>

                                <PagingBar 
                                    totalPages={totalPages2}                     
                                    currentPage={this.state.currentPage2}
                                    pageChange={this.handlePageChange2} 
                                />
                            </div>
                            {/*First-Level permission-----------------------------------------------------------------------------------------------*/}
                            <div className={show1} id="category" role="tabpanel" aria-labelledby="category-tab">
                                <div className="row">
                                    <div className="col">
                                        <div className="float-left">
                                            <SearchBar 
                                                langState={this.props.langState}
                                                searchContent={this.handleSearchContent1}
                                                searchSubmit={this.handleSearchSubmit1} />
                                        </div>
                                    </div>
                                    {
                                        logInName==='Steven'?
                                        <div className="col">
                                            <div className="btn-group float-right">
                                                <Link to='/users/permissions/add1' className="btn btn-primary btn-sm rounded mr-2" title={lang[9]}><i className="fas fa-plus-square"></i></Link>
                                                <button type="button" className="btn btn-danger btn-sm rounded" onClick={this.handleClickDelete1} title={lang[10]}><i className="fas fa-trash-alt"></i></button>
                                            </div>
                                        </div>:null
                                    }
                                </div>
                                <div className="table-responsive rounded">
                                    <table className="table table-hover table-bordered">
                                        <thead>
                                            <tr className="table-primary">
                                                <th scope="col" style={{width: "5%"}} className="text-center"><input checked={this.state.checkedAll1} type="checkbox" onChange={this.handleCheckedAll1}/></th>
                                                <th scope="col" style={{width: "5%"}} className="text-center">{lang[11]}</th>
                                                <th scope="col" style={{width: "85%"}}>{lang[12]}</th>
                                                {
                                                    logInName==='Steven'?
                                                    <th scope="col" style={{width: "5%"}} className="text-center">{lang[13]}</th>:null
                                                }
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {onePage1}
                                        </tbody>
                                    </table>
                                </div>

                                <PagingBar 
                                    totalPages={totalPages1}                     
                                    currentPage={this.state.currentPage1}
                                    pageChange={this.handlePageChange1} 
                                />
                            </div>
                        </div>
                    </div>            
                </div>
            </div>
        );
    }
}

export default permissionManagement;