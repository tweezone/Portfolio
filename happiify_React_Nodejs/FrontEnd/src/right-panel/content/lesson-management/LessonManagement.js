import React, {Component} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {Link} from 'react-router-dom';
import LANGUAGE from '../../../service/Language-data';
import apiRoot from '../../../config.api';

import LessonTable from './LessonTable';
import SearchBar from '../../../service/components/SearchBar';
import PagingBar from '../../../service/components/PagingBar';

class LessonManagement extends Component{
    state={
            subjectList:[],
            searchContent:'',     // Accept the value of "change"; Used for search after the button is clicked.
            searchChange:'',      // Accept the value changed in "input".
            currentPage: 1
        };
    
    static propTypes = {
        langState: PropTypes.string.isRequired,
        clickUpdate: PropTypes.func.isRequired
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
        if(window.confirm(`Do you really want to delete No. ${id} lesson?`)){
            axios.put(apiRoot + "lessons/delete", {id})
                .then(res => {
                    alert("You have deleted it.");
                    axios.get(apiRoot + "lessons")
                    .then((res) => {                   
                        this.setState({ subjectList: res.data });  
                    })
                    .catch((err) => {            
                        console.log("Getting lessons error in LessonManagement component!");            
                    });
                })
                .catch(err=>{
                    console.log("Deleting lessons error in LessonManagement component!");
            });
            e.preventDefault();
        }
    }

    handleClickUpdate=(id)=>{
        this.props.clickUpdate(id);        
    }

    componentDidMount(){
        axios.get(apiRoot + "lessons")
            .then((res) => {            
                this.setState({ subjectList: res.data });  
            })
            .catch((err) => {            
                console.log("Getting lessons error in LessonManagement component!");            
            });
    }
    
    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.LessonManagement.cn;
        else lang=LANGUAGE.LessonManagement.en;

        const { permissions } = this.props;

        const {subjectList, searchContent, currentPage} = this.state;
        const row=[];
        let key=0;
        subjectList.forEach((one)=>{
            if( (one.username.toUpperCase().indexOf(searchContent.toUpperCase())===-1)&&
                (one.categories_name.toUpperCase().indexOf(searchContent.toUpperCase())===-1)&&
                (one.title.toUpperCase().indexOf(searchContent.toUpperCase())===-1)&&
                (one.short_description.toUpperCase().indexOf(searchContent.toUpperCase())===-1)){
                return;
            }
            row.push(
                <tr key={key}>
                    <th scope="row">{one.id}</th>
                    <td>{one.categories_name}</td>
                    <td>{one.username}</td>
                    <td>{one.title}</td>
                    <td>{one.lessons_count}</td>
                    <td>{one.short_description}</td>
                    <td>{one.speaker}</td>
                    <td>{one.price}</td>
                    <td>{one.special_price}</td>
                    <td>{one.payment_type===1? '付费':'免费'}</td>
                    <td>{one.currencies_name}</td>
                    {
                        permissions[4][3].value || permissions[4][4].value?
                        <td style={{verticalAlign: 'middle'}} >
                            <div className="btn-group">
                                { 
                                    permissions[4][3].value? 
                                    <Link to="/lessons/update" className="btn btn-success btn-sm mr-2 rounded" onClick={()=>this.handleClickUpdate(one.id)} title={lang[2]}><i className="fas fa-pencil-alt"></i></Link>
                                    : null
                                }
                                {
                                    permissions[4][4].value?
                                    <button type="button" className="btn btn-danger btn-sm rounded" onClick={(e)=>this.handleClickDelete(e, one.id)} title={lang[3]}><i className="fas fa-trash-alt"></i></button>
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
        const onePage=row.reverse().slice((currentPage*10-10), (currentPage*10));

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
                                permissions[4][2].value?
                                <div className="col">
                                    <div className="float-right">
                                        <Link to='/lessons/add' className="btn btn-primary btn-sm float-right rounded" title={lang[1]}><i className="fas fa-plus-square"></i></Link> 
                                    </div>
                                </div>: null
                            }
                        </div>               
                        <LessonTable
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

export default LessonManagement;