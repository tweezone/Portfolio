import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {Link} from 'react-router-dom';
import LANGUAGE from '../../../service/Language-data';
import apiRoot from '../../../config.api';

import SearchBar from '../../../service/components/SearchBar';
import PagingBar from '../../../service/components/PagingBar';

class UserManagement extends Component{
    state = {
        subjectList:[],
        searchContent:'',     // Accept the value of "change"; Used for search after the button is clicked.
        searchChange:'',      // Accept the value changed in "input".
        currentPage: 1,
        checkedArr: [],
        checkedIds: [],
        checkedAll: false
        };

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

    handlePageChange=(e)=>{
        this.setState({
            currentPage: +e.target.value
        });
    }

    handleChecked=(e,i)=>{
        let {checkedArr} = this.state;
        checkedArr[i] = !checkedArr[i];

        let id = e.target.value;
        let ids = this.state.checkedIds;
        let index = ids.indexOf(+id);
        e.target.checked === true? ids.push(+id) : ids.splice(index,1);
        this.setState({ 
            checkedIds: ids,
            checkedArr 
        });
    }

    handleCheckedAll=(e)=>{
        const { checkedArr,subjectList } = this.state;
        let tempArr=[];
        let ids = [];
        if(e.target.checked){
            checkedArr.forEach(one=> tempArr.push(!one));
            subjectList.forEach((one, index) => { if(tempArr[index]) ids.push(+one.id)});
        }
        else{
            checkedArr.forEach(one=> tempArr.push(false));
        }
        this.setState({
            checkedArr : tempArr,
            checkedIds : ids,
            checkedAll : e.target.checked
        });
    }

    handleClickDelete=(e)=>{
        const {checkedIds} = this.state;
        const idsString=checkedIds.toString();
        if(checkedIds.length===0){
            alert(`You did NOT select any item!`);
        }
        else{
            if(window.confirm(`Do you really want to delete No. ${idsString} ${checkedIds.length>1? 'users':'user'}?`)){
                axios.put(apiRoot + "users/delete", {checkedIds})
                    .then(res => {
                        alert(`You have deleted ${checkedIds.length>1? checkedIds.length +' users':'a user'}.`);
                        axios.get(apiRoot + "users")
                        .then((res) => {                   
                            this.setState({ subjectList: res.data });  
                        })
                        .catch((err) => {            
                            console.log("Getting users error in UserManagement component!");            
                        });
                    })
                    .catch(err=>{
                        console.log("Deleting users error in UserManagement component!");
                });
                let tempArr = [];
                this.state.checkedArr.forEach(()=> tempArr.push(false));
                this.setState({
                    checkedArr: tempArr,
                    checkedIds: [],
                    checkedAll: false
                });
                e.preventDefault();
            }
        }
    }

    handleClickUpdate=(id)=>{
        this.props.clickUpdate(id);        
    }

    componentDidMount(){
        axios.get(apiRoot + "users")
            .then((res) => {
                let checkedArr=[];
                res.data.forEach(one=>{
                    checkedArr.push( false )
                });
                this.setState({ checkedArr, subjectList: res.data });
            })
            .catch((err) => {            
                console.log("Getting users error in UserManagement component!");            
        });
    }

    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.UserManagement.cn;
        else lang=LANGUAGE.UserManagement.en;

        const {subjectList, searchContent, currentPage} = this.state;
        const { permissions } = this.props;

        const row=[];
        subjectList.forEach((one, index)=>{            
            if( (String(one.id).toUpperCase().indexOf(searchContent.toUpperCase())===-1)&&
                (one.username.toUpperCase().indexOf(searchContent.toUpperCase())===-1)&&
                (one.email.toUpperCase().indexOf(searchContent.toUpperCase())===-1)&&
                (one.group_name.toUpperCase().indexOf(searchContent.toUpperCase())===-1)&&
                (one.create_time.slice(0, one.create_time.indexOf('T')).toUpperCase().indexOf(searchContent.toUpperCase())===-1)&&
                (one.last_login_time.slice(0, one.create_time.indexOf('T')).toUpperCase().indexOf(searchContent.toUpperCase())===-1)){
                return;
            }
            row.push(
                <tr key={index} >
                    <td style={{verticalAlign: 'middle'}} className="text-center"><input type="checkbox" name="checkbox" checked={this.state.checkedArr[index]} value={one.id} onChange={(e)=>this.handleChecked(e, index)}/></td>
                    <td style={{verticalAlign: 'middle'}} className="text-center">{one.id}</td>
                    <td style={{verticalAlign: 'middle'}} className="text-center">
                        {(()=>{
                            switch(one.portrait.slice(0,4)){
                                case '':        return (<img src="../../../../public/images/default_user.png" style={{height: '30px'}} alt={index}/>);
                                case 'http':    return (<img src={one.portrait} style={{height: '30px'}} alt={index}/>);
                                default:        return (<a href={apiRoot + 'display/image/file?file=' + one.portrait}>
                                                            <img src={apiRoot + 'display/image/file?file=' + one.portrait} style={{height: '30px'}} alt={index}/>
                                                        </a>)
                            }
                        })()}
                    </td>
                    <td style={{verticalAlign: 'middle'}} >{one.username}</td>
                    <td style={{verticalAlign: 'middle'}} >{one.email}</td>
                    <td style={{verticalAlign: 'middle'}} >{one.group_name}</td>
                    <td style={{verticalAlign: 'middle'}} >{one.create_time.slice(0, one.create_time.indexOf('T'))}</td>
                    <td style={{verticalAlign: 'middle'}} >{one.last_login_time.slice(0, one.create_time.indexOf('T'))}</td>
                    {
                        permissions[7][3].value || permissions[7][5].value?
                        <td style={{verticalAlign: 'middle'}} className="text-center">
                            <div className="btn-group">
                                {
                                    permissions[7][3].value?
                                    <Link to="/users/update" className="btn btn-success btn-sm rounded mr-2" onClick={()=>this.handleClickUpdate(one.id)} title={lang[3]}><i className="fas fa-pencil-alt"></i></Link>:null
                                }
                                {
                                    permissions[7][5].value?
                                    <Link to="/users/view" className="btn btn-info btn-sm rounded" onClick={()=>this.handleClickUpdate(one.id)} title={lang[4]}><i className="far fa-eye"></i></Link>:null
                                }
                            </div>
                        </td>:null
                    }
                </tr>
            );
        });

        const totalPages=Math.ceil(row.length/10);
        const onePage=row.reverse().slice((currentPage*10-10), (currentPage*10));

        return(
            <div className="container-fluid">
                <div className="card rounded">
                    <div className="card-header">
                        <span style={{fontSize: "1.4em"}}>{lang[0]}</span>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col">
                                <div className="float-left">
                                    <SearchBar 
                                        langState={this.props.langState}
                                        searchContent={this.handleSearchContent}
                                        searchSubmit={this.handleSearchSubmit} />
                                </div>
                            </div>
                            {
                                permissions[7][2].value || permissions[7][4].value?
                                <div className="col">
                                    <div className="btn-group float-right">
                                        {
                                            permissions[7][2].value?
                                            <Link to='/users/add' className="btn btn-primary btn-sm rounded mr-2" title={lang[1]}><i className="fas fa-plus-square"></i></Link>:null
                                        }
                                        {
                                            permissions[7][4].value?
                                            <button type="button" className="btn btn-danger btn-sm rounded" onClick={this.handleClickDelete} title={lang[2]}><i className="fas fa-trash-alt"></i></button>:null
                                        } 
                                    </div>
                                </div>:null
                            }
                            
                        </div>
                        
                        <div className="table-responsive rounded">
                            <table className="table table-hover table-bordered text-center">
                                <thead>
                                    <tr className="table-primary">
                                        <th scope="col" style={{width: "5%"}} className="text-center"><input checked={this.state.checkedAll} type="checkbox" onChange={this.handleCheckedAll}/></th>
                                        <th scope="col" style={{width:"5%"}}>{lang[5]}</th>
                                        <th scope="col" style={{width:"10%"}}>{lang[6]}</th>
                                        <th scope="col" style={{width:"15%"}}>{lang[7]}</th>
                                        <th scope="col" style={{width:"25%"}}>{lang[8]}</th>
                                        <th scope="col" style={{width:"10%"}}>{lang[9]}</th>
                                        <th scope="col" style={{width:"10%"}}>{lang[10]}</th>
                                        <th scope="col" style={{width:"10%"}}>{lang[11]}</th>
                                        {
                                            permissions[7][3].value || permissions[7][5].value?
                                            <th scope="col" style={{width:"10%"}}>{lang[12]}</th>:null
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {onePage}
                                </tbody>
                            </table>                
                        </div>

                        <PagingBar 
                            totalPages={totalPages}                     
                            currentPage={this.state.currentPage}
                            pageChange={this.handlePageChange} 
                            />
                    </div>
                </div>            
            </div>
        );
    }
}

export default UserManagement;