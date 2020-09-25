import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import LANGUAGE from '../../../service/Language-data';
import apiRoot from '../../../config.api';

import EventTable from './EventTable';
import SearchBar from '../../../service/components/SearchBar';
import PagingBar from '../../../service/components/PagingBar';

class EventManagement extends Component{
    state={
            eventList:[],
            categories: [],
            currencies: [],
            searchContent:'',     // Accept the value of "change"; Used for search after the button is clicked.
            searchChange:'',      // Accept the value changed in "input".
            currentPage: 1
    }
    
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

    handleClickDelete=(e, id)=>{
        if(window.confirm(`Do you really want to delete No. ${id} event?`)){
            axios.put(apiRoot + "events/delete", {id})
                .then(res => {
                    alert("You have deleted an event.");
                    axios.get(apiRoot + "events")
                    .then((res) => {     
                        this.setState({ eventList: res.data });
                    })
                    .catch((err) => { 
                        console.log("[Error] - GET /events - at EventManagement component!");
                        console.log(err);            
                    });
                })
                .catch(err=>{ 
                    console.log("[Error] - PUT /events/delete - at EventManagement component!");
                    console.log(err);
            });
            e.preventDefault();
        }
    }

    handleClickUpdate=(id)=>{
        this.props.clickUpdate(id);        
    }
    
    componentDidMount(){
        axios.get(apiRoot + "events")
            .then((res) => {
                const eventList = res.data;
                axios.get(apiRoot + "currencies")
                    .then((res) => {
                        const currencies = res.data;
                        axios.get(apiRoot + "events/categories")
                            .then((res) => {
                                const categories = res.data;           
                                this.setState({ eventList, currencies, categories });
                            })
                            .catch((err) => {  
                                console.log("[Error] - GET /events/categories - at EventManagement component!");
                                console.log(err);          
                        });
                    })
                    .catch((err) => {  
                        console.log("[Error] - GET /currencies - at EventManagement component!");
                        console.log(err);           
                });
            })
            .catch((err) => { 
                console.log("[Error] - GET /events - at EventManagement component!");
                console.log(err);      
        });
    }
    
    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.EventManagement.cn;
        else lang=LANGUAGE.EventManagement.en;
        
        const { permissions } = this.props;
        const { categories, currencies, eventList } = this.state;

        const row=[];
        let key=0;
        eventList.forEach((eve, index)=>{
            //const events_type_name = categories.length !==0? categories.find(one=>one.categories_id === eve.events_type).name:'';
            //const currency =currencies!==0? currencies.find(one=>one.currencies_id === eve.currencies_id).name:'';
            const events_type_name = categories.find(one=>one.categories_id === eve.events_type).name;
            const currency =currencies.find(one=>one.currencies_id === eve.currencies_id).name;
            //debugger
            if( (eve.username.toUpperCase().indexOf(this.state.searchContent.toUpperCase())===-1)&&
                (eve.events_title.toUpperCase().indexOf(this.state.searchContent.toUpperCase())===-1)&&
                (events_type_name.toUpperCase().indexOf(this.state.searchContent.toUpperCase())===-1)){
                return;
            }
            row.push(
                <tr key={key}>
                    <th style={{verticalAlign: 'middle'}} scope="row">{eve.id}</th>
                    <td style={{verticalAlign: 'middle'}}>{eve.username}</td>
                    <td style={{verticalAlign: 'middle'}}>{eve.events_title}</td>
                    <td style={{verticalAlign: 'middle'}}>{events_type_name}</td>
                    <td style={{verticalAlign: 'middle'}}>
                        {(()=>{
                            switch(eve.cover_image.slice(0,4)){
                                case '':        return (<span>{'No Image'}</span>);
                                case 'http':    return (<img src={eve.cover_image} style={{height: '50px'}} alt={index}/>);
                                default:        return (<a href={apiRoot + 'display/image/file?file=' + eve.cover_image}>
                                                            <img src={apiRoot + 'display/image/file?file=' + eve.cover_image} style={{height: '50px'}} alt={index}/>
                                                        </a>)
                            }
                        })()}
                    </td>
                    <td style={{verticalAlign: 'middle'}}>{eve.events_costs}</td>
                    <td style={{verticalAlign: 'middle'}}>{currency}</td>
                    <td style={{verticalAlign: 'middle'}}>{eve.create_time}</td>
                    {
                        permissions[3][3].value || permissions[3][4].value?
                        <td style={{verticalAlign: 'middle'}} >
                            <div className="btn-group">
                                { 
                                    permissions[3][3].value? 
                                    <Link to="/events/update" className="btn btn-success btn-sm mr-2 rounded" onClick={()=>this.handleClickUpdate(eve.id)} title={lang[2]}><i className="fas fa-pencil-alt"></i></Link>
                                    : null
                                }
                                {
                                    permissions[3][4].value?
                                    <button type="button" className="btn btn-danger btn-sm rounded" onClick={(e)=>this.handleClickDelete(e, eve.id)} title={lang[3]}><i className="fas fa-trash-alt"></i></button>
                                    : null
                                }
                            </div>
                        </td> : null
                    }
                </tr>
            );
            key++;
        });

        const totalPages=Math.ceil(row.length/10);
        const onePage=row.reverse().slice((this.state.currentPage*10-10), (this.state.currentPage*10));

        return(  
            <div className="container-fluid">
                <div className="card rounded">
                    <div className="card-header">
                        <h5>{lang[0]}</h5>
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
                                permissions[3][2].value?
                                <div className="col">
                                    <div className="float-right">
                                        <Link to='/events/add' className="btn btn-primary btn-sm float-right rounded" title={lang[1]}><i className="fas fa-plus-square"></i></Link> 
                                    </div>
                                </div>: null
                            }
                        </div>
                        <EventTable
                            langState={this.props.langState}
                            onePage={onePage}
                            permissions={this.props.permissions}/>
                        <PagingBar 
                            totalPages={totalPages}                     
                            currentPage={this.state.currentPage}
                            pageChange={this.handlePageChange}/>
                    </div>
                </div>                
            </div>
        );
    }
}

export default EventManagement;