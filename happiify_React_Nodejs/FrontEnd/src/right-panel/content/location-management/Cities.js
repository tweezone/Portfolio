import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {Link} from 'react-router-dom';
import LANGUAGE from '../../../service/Language-data';
import apiRoot from '../../../config.api';

import SearchBar from '../../../service/components/SearchBar';
import PagingBar from '../../../service/components/PagingBar';

class Cities extends Component{
    state={
        countries: [],
        provinces: [],
        subjectList:[],
        searchContent:'',     // Accept the value of "change"; Used for search after the button is clicked.
        searchChange:'',      // Accept the value changed in "input".
        currentPage: 1,
        checkedArr: [],
        checkedIds: [],
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
        let ids = this.state.checkedIds;
        let index_id = ids.indexOf(+id);
        e.target.checked === true? ids.push(+id) : ids.splice(index_id,1);
        this.setState({ 
            checkedIds: ids,
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

        axios.get(apiRoot + "events")
            .then((res) => {
                const hasSomeOnEvents = res.data.filter(one=>checkedIds.includes(one.city_id));
                axios.get(apiRoot + "health/doctors")
                    .then((res) => {
                        const hasSomeOnDoctors = res.data.filter(one=>checkedIds.includes(one.city_id));
                        if(checkedIds.length===0){
                            alert(`You did NOT select any item!`);
                        }
                        else{
                            if(window.confirm(`Do you really want to delete No. ${idsString} ${checkedIds.length>1? 'cities':'city'}?`)){
                                if(checkedIds.length===1 && (hasSomeOnEvents.length!==0 || hasSomeOnDoctors.length!==0)){
                                    alert(`The city was used for other parts. You can NOT delete it.`);
                                }
                                else if(checkedIds.length>1 && (hasSomeOnEvents.length!==0 || hasSomeOnDoctors.length!==0)){
                                    alert(`At least one city of these cities you selected was used for other parts. You can NOT delete it.`);
                                }
                                else{    
                                    axios.put(apiRoot + "location/cities/delete", {checkedIds: JSON.stringify(checkedIds)})
                                        .then(res => {
                                            alert(`You have deleted ${checkedIds.length>1? checkedIds.length +' cities':'a city'}.`);
                                            axios.get(apiRoot + "location/cities")
                                            .then((res) => {
                                                let tempArr = [];
                                                this.state.checkedArr.forEach(()=> tempArr.push(false));
                                                this.setState({
                                                    subjectList: res.data,
                                                    checkedArr: tempArr,
                                                    checkedIds: [],
                                                    checkedAll: false
                                                });
                                            })
                                            .catch((err) => { 
                                                console.log("[Error] - GET /location/provinces - at Cities component!");
                                                console.log(err);             
                                            });
                                        })
                                        .catch(err=>{ 
                                            console.log("[Error] - PUT /location/provinces/delete - at Cities component!");
                                            console.log(err);  
                                    });
                                }
                            }
                        }
                    })
                    .catch((err) => { 
                        console.log("[Error] - GET /health/doctors - at Cities component!");
                        console.log(err);            
                });
            })
            .catch((err) => { 
                console.log("[Error] - GET /events - at Cities component!");
                console.log(err);      
        });
        e.preventDefault();
    }

    handleClickUpdate=(id)=>{
        this.props.clickUpdate(id);        
    }

    componentDidMount(){
        axios.get(apiRoot + "location/cities")
            .then((res) => {
                let checkedArr=[];
                res.data.forEach(one=>{
                    checkedArr.push( false )
                });
                const subjectList = res.data
                axios.get(apiRoot + "location/countries/enable")
                    .then((res) => {
                        const countries = res.data;
                        axios.get(apiRoot + "location/provinces")
                            .then((res) => { 
                                const provinces = res.data;          
                                this.setState({ countries, provinces, subjectList, checkedArr });
                            })
                            .catch((err) => { 
                                console.log("[Error] - GET /location/provinces - at Cities component!");
                                console.log(err);            
                        });
                    })
                    .catch((err) => { 
                        console.log("[Error] - GET /location/countries/enable - at Cities component!");
                        console.log(err);             
                });
            })
            .catch((err) => { 
                console.log("[Error] - GET /location/cities - at Cities component!");
                console.log(err);            
        });
    }

    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.Cities.cn;
        else lang=LANGUAGE.Cities.en;

        const {countries, provinces, subjectList, searchContent, currentPage} = this.state;
        const { permissions } = this.props;

        const row=[];
        subjectList.forEach((one, index)=>{
            let country = undefined;
            const province = provinces.find(prov=>prov.id === one.pid);
            if(province){
                country = countries.find(coun=>coun.id === province.pid);
                if(country){
                    if( (one.value.toUpperCase().indexOf(searchContent.toUpperCase())===-1) &&
                        (province.value.toUpperCase().indexOf(searchContent.toUpperCase())===-1) && 
                        (country.value.toUpperCase().indexOf(searchContent.toUpperCase())===-1) &&
                        (one.id !==+searchContent)){ 
                        return;
                    }
                    row.push(
                        <tr key={index} >
                            <td style={{verticalAlign: 'middle'}} className="text-center"><input type="checkbox" name="checkbox" checked={this.state.checkedArr[index]} value={one.id} onChange={(e)=>this.handleChecked(e, index)}/></td>
                            <td style={{verticalAlign: 'middle'}} className="text-center">{one.id}</td>
                            <td style={{verticalAlign: 'middle'}} >{one.value}</td>
                            <td style={{verticalAlign: 'middle'}} >{one.code}</td>
                            <td style={{verticalAlign: 'middle'}} >{province.value}</td>
                            <td style={{verticalAlign: 'middle'}} >{country.value}</td>
                            {
                                permissions[9][9].value?
                                <td style={{verticalAlign: 'middle'}} className="text-center">
                                    <Link to="/location/cities/update" className="btn btn-success mr-2 btn-sm rounded" onClick={()=>this.handleClickUpdate(one.id)} title={lang[5]}><i className="fas fa-pencil-alt"></i></Link>
                                </td>:null
                            }
                        </tr>
                    );
                }
            }
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
                                permissions[9][8].value || permissions[9][10].value?
                                <div className="col">
                                    <div className="btn-group float-right">
                                    { 
                                        permissions[9][8].value?
                                        <Link to='/location/cities/add' className="btn btn-primary btn-sm rounded mr-2" title={lang[1]}><i className="fas fa-plus-square"></i></Link>
                                        :null
                                    }
                                    { 
                                        permissions[9][10].value?
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
                                        <th scope="col" style={{width: "5%"}} className="text-center"><input checked={this.state.checkedAll} type="checkbox" onChange={this.handleCheckedAll}/></th>
                                        <th scope="col" style={{width: "10%"}} className="text-center">#</th>
                                        <th scope="col" style={{width: "25%"}}>{lang[3]}</th>
                                        <th scope="col" style={{width: "10%"}}>{lang[4]}</th>
                                        <th scope="col" style={{width: "20%"}}>{lang[5]}</th>
                                        <th scope="col" style={{width: "20%"}}>{lang[6]}</th>
                                        {
                                            permissions[9][9].value?
                                            <th scope="col" style={{width: "10%"}} className="text-center">{lang[7]}</th>
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

export default Cities;