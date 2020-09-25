import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {Link} from 'react-router-dom';
import LANGUAGE from '../../../service/Language-data';
import apiRoot from '../../../config.api';

import SearchBar from '../../../service/components/SearchBar';
import PagingBar from '../../../service/components/PagingBar';

class Provinces extends Component{
    state={
        countries: [],
        subjectList:[],
        searchContent:'',     // Accept the value of "change"; Used for search after the button is clicked.
        searchChange:'',      // Accept the value changed in "input".
        currentPage: 1,
        checkedArr: [],
        checkedIds: [],
        //checkedGroups: [],
        checkedAll: false
    };

    static propTypes={
        langState: PropTypes.string.isRequired,
        clickUpdate: PropTypes.func.isRequired
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

    handleChecked=(e, i)=>{
        let {checkedArr} = this.state;
        checkedArr[i] = !checkedArr[i];

        let id = e.target.value;
        //let group = name;
        let ids = this.state.checkedIds;
        //let groups = this.state.checkedGroups;
        let index_id = ids.indexOf(+id);
        //let index_group = groups.indexOf(group);
        e.target.checked === true? ids.push(+id) : ids.splice(index_id,1);
        //e.target.checked === true? groups.push(group) : groups.splice(index_group,1);
        this.setState({ 
            checkedIds: ids,
            //checkedGroups: groups,
            checkedArr
        });
    }

    handleCheckedAll=(e)=>{
        let { checkedArr,subjectList } = this.state;
        let tempArr=[];
        let ids = [];
        if(e.target.checked){
            checkedArr.forEach(one=> tempArr.push(!one))
            subjectList.forEach((one, index) => { if(tempArr[index]) ids.push(+one.id)})
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
        const { checkedIds } = this.state;
        const idsString=checkedIds.toString();

        axios.get(apiRoot + "location/cities")
            .then((res) => {
                const hasOneOnit = res.data.filter(one=>checkedIds.includes(one.pid));
                if(checkedIds.length===0){
                    alert(`You did NOT select any item!`);
                }
                else{
                    if(window.confirm(`Do you really want to delete No. ${idsString} ${checkedIds.length>1? 'provinces':'province'}?`)){
                        if(checkedIds.length===1 && hasOneOnit.length!==0){
                            alert(`There is at least one city under this province/state. You can NOT delete it.`);
                        }
                        else if(checkedIds.length>1 && hasOneOnit.length!==0){
                            alert(`There is at least one city under at least one of the provinces/states you checked. You can NOT delete all of them at the same time.`);
                        }
                        else{    
                            axios.put(apiRoot + "location/provinces/delete", {checkedIds: JSON.stringify(checkedIds)})
                                .then(res => {
                                    alert(`You have deleted ${checkedIds.length>1? checkedIds.length +' provinces':'a province'}.`);
                                    axios.get(apiRoot + "location/provinces")
                                    .then((res) => {                   
                                        this.setState({ subjectList: res.data });
                                        let tempArr = [];
                                        this.state.checkedArr.forEach(()=> tempArr.push(false));
                                        this.setState({
                                            checkedArr: tempArr,
                                            checkedIds: [],
                                            checkedAll: false
                                        });
                                    })
                                    .catch((err) => { 
                                        console.log("[Error] - GET /location/provinces - at Provinces component!");
                                        console.log(err);             
                                    });
                                })
                                .catch(err=>{ 
                                    console.log("[Error] - PUT /location/provinces/delete - at Provinces component!");
                                    console.log(err);  
                            });
                            e.preventDefault();
                        }
                    }
                }
            })
            .catch((err) => { 
                console.log("[Error] - GET /location/cities - at Provinces component!");
                console.log(err);            
        });
        
    }

    handleClickUpdate=(id)=>{
        this.props.clickUpdate(id);        
    }

    componentDidMount(){
        axios.get(apiRoot + "location/provinces")
            .then((res) => {
                let checkedArr=[];
                res.data.forEach(one=>{
                    checkedArr.push( false )
                });
                const subjectList = res.data
                axios.get(apiRoot + "location/countries/enable")
                    .then((res) => { 
                        this.setState({ 
                            countries: res.data,
                            checkedArr, 
                            subjectList
                         });
                    })
                    .catch((err) => { 
                        console.log("[Error] - GET /location/countries - at Provinces component!");
                        console.log(err);             
                });
            })
            .catch((err) => { 
                console.log("[Error] - GET /location/provinces - at Provinces component!");
                console.log(err);            
        });
    }

    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.Provinces.cn;
        else lang=LANGUAGE.Provinces.en;

        const {subjectList, countries, searchContent, currentPage} = this.state;
        const { permissions } = this.props;

        const row=[];
        subjectList.forEach((one, index)=>{
            const country = countries.find(coun=>coun.id === one.pid);            
            if( (one.value.toUpperCase().indexOf(searchContent.toUpperCase())===-1) && 
                (country.value.toUpperCase().indexOf(searchContent.toUpperCase())===-1) &&
                (one.id !==+searchContent)){
                return;
            }
            row.push(
                <tr key={index} >
                    <td style={{verticalAlign: 'middle'}} className="text-center"><input type="checkbox" name="checkbox" checked={this.state.checkedArr[index]} value={one.id} onChange={(e)=>this.handleChecked(e, index)}/></td>
                    <td style={{verticalAlign: 'middle'}} className="text-center">{one.id}</td>
                    <td style={{verticalAlign: 'middle'}} >{one.value}</td>
                    <td style={{verticalAlign: 'middle'}} >{one.zone_code}</td>
                    <td style={{verticalAlign: 'middle'}} >{country.value}</td>
                    {
                        permissions[9][5].value?
                        <td style={{verticalAlign: 'middle'}} className="text-center">
                            <Link to="/location/provinces/update" className="btn btn-success mr-2 btn-sm rounded" onClick={()=>this.handleClickUpdate(one.id)} title={lang[5]}><i className="fas fa-pencil-alt"></i></Link>
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
                                permissions[9][4].value || permissions[9][6].value?
                                <div className="col">
                                    <div className="btn-group float-right">
                                    { 
                                        permissions[9][4].value?
                                        <Link to='/location/provinces/add' className="btn btn-primary btn-sm rounded mr-2" title={lang[1]}><i className="fas fa-plus-square"></i></Link>
                                        :null
                                    }
                                    {
                                        permissions[9][6].value?
                                        <button type="button" className="btn btn-danger btn-sm rounded" onClick={this.handleClickDelete} title={lang[2]}><i className="fas fa-trash-alt"></i></button>
                                        :null
                                    }
                                    </div>
                                </div>:null
                            }
                        </div>
                        <div className="table-responsive rounded">
                            <table className="table table-hover table-bordered">
                                <thead>
                                    <tr className="table-primary">
                                        <th scope="col" style={{width: "10%"}} className="text-center"><input checked={this.state.checkedAll} type="checkbox" onChange={this.handleCheckedAll}/></th>
                                        <th scope="col" style={{width: "10%"}} className="text-center">#</th>
                                        <th scope="col" style={{width: "30%"}}>{lang[3]}</th>
                                        <th scope="col" style={{width: "10%"}}>{lang[4]}</th>
                                        <th scope="col" style={{width: "30%"}}>{lang[5]}</th>
                                        {
                                            permissions[9][5].value?
                                            <th scope="col" style={{width: "10%"}} className="text-center">{lang[6]}</th>
                                            :null
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

export default Provinces;