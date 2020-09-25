import React, {Component} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {Link} from 'react-router-dom';
import LANGUAGE from '../../../service/Language-data';
import apiRoot from '../../../config.api';

import QuestionTable from './QuestionTable';
import SearchBar from '../../../service/components/SearchBar';
import PagingBar from '../../../service/components/PagingBar';

class QuestionManagement extends Component{
    state={
            subjectList:[],
            searchContent:'',     // Accept the value of "change"; Used for search after the button is clicked.
            searchChange:'',      // Accept the value changed in "input".
            currentPage: 1,
            currentId: '',
            currentTitle: '',
            currentTotal_answers: ''
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
        if(window.confirm(`Do you really want to delete No. ${id} question?`)){
            axios.put(apiRoot + "questions/delete", {id})
                .then(res => {
                    alert("You have deleted it.");
                    axios.get(apiRoot + "questions")
                    .then((res) => {                   
                        this.setState({ subjectList: res.data });  
                    })
                    .catch((err) => {            
                        console.log("Getting questions error in QuestionManagement component!");            
                    });
                })
                .catch(err=>{
                    console.log("Deleting questions error in QuestionManagement component!");
            });
            e.preventDefault();
        }
    }
    
    handleClickUpdate=(id, total_answers)=>{
        this.props.clickUpdate(id, total_answers);        
    }

    handleModal=(id, title, total)=>{
        this.setState({
            currentId: id.toString(),
            currentTitle: title,
            currentTotal_answers: total.toString()
        })
    }

    handleAnswerDelete=()=>{
        axios.get(apiRoot + "questions")
            .then((res) => { 
                this.setState({ subjectList: res.data });  
            })
            .catch((err) => {            
                console.log("Getting questions error in QuestionManagement component!");            
        });
    }

    componentDidMount(){
        axios.get(apiRoot + "questions")
            .then((res) => { 
                this.setState({ subjectList: res.data });  
            })
            .catch((err) => {            
                console.log("Getting questions error in QuestionManagement component!");            
        });
    }
    
    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.QuestionManagement.cn;
        else lang=LANGUAGE.QuestionManagement.en;

        const {subjectList, searchContent, currentPage} = this.state;
        const { permissions } = this.props;

        const row=[];
        subjectList.forEach((one, index)=>{            
            if( (one.username.toUpperCase().indexOf(searchContent.toUpperCase())===-1)&&
                (one.tags_name.toUpperCase().indexOf(searchContent.toUpperCase())===-1)&&
                (one.title.toUpperCase().indexOf(searchContent.toUpperCase())===-1)&&
                (one.questions.toUpperCase().indexOf(searchContent.toUpperCase())===-1)){
                return;
            }
            
            row.push(
                <tr key={index}>
                    <th style={{verticalAlign: 'middle'}} scope="row">{one.id}</th>
                    <td style={{verticalAlign: 'middle'}} >{one.tags_name}</td>
                    <td style={{verticalAlign: 'middle'}} >{one.username}</td>
                    <td style={{verticalAlign: 'middle'}} >{one.title}</td>
                    <td style={{verticalAlign: 'middle'}} >
                        {(()=>{
                            switch(one.cover_image.slice(0,4)){
                                case '':        return (<span>{'No Image'}</span>);
                                case 'http':    return (<img src={one.cover_image} style={{height: '50px'}} alt={index}/>);
                                default:        return (<a href={apiRoot + 'display/image/file?file=' + one.cover_image}>
                                                            <img src={apiRoot + 'display/image/file?file=' + one.cover_image} style={{height: '50px'}} alt={index}/>
                                                        </a>)
                            }
                        })()}
                    </td>
                    {
                        permissions[5][4].value || permissions[5][5].value?
                        <td style={{verticalAlign: 'middle'}} >
                            <div className="btn-group">
                                { 
                                    permissions[5][4].value? 
                                    <Link to="/questions/update" className="btn btn-success btn-sm mr-2 rounded" onClick={()=>this.handleClickUpdate(one.id, one.total_answers)} title={lang[2]}><i className="fas fa-pencil-alt"></i></Link>
                                    : null
                                }
                                {
                                    permissions[5][5].value?
                                    <button type="button" className="btn btn-danger btn-sm rounded" onClick={(e)=>this.handleClickDelete(e, one.id)} title={lang[3]}><i className="fas fa-trash-alt"></i></button>
                                    : null
                                }
                            </div>
                        </td> : null
                    }
                    <td style={{verticalAlign: 'middle'}} >{one.total_answers}</td>
                    {
                        permissions[5][2].value?
                        <td style={{verticalAlign: 'middle'}} >
                            <Link to="/questions/answers" className="btn btn-warning btn-sm mr-2 rounded" onClick={()=>this.handleClickUpdate(one.id, one.total_answers)} title={lang[4]}><i className="fas fa-pencil-alt"></i></Link>
                        </td>:null
                    }
                </tr>
            );
        });

        const totalPages=Math.ceil(row.length/10);
        const onePage=row.reverse().slice((currentPage*10-10), (currentPage*10));
        const a=this.state.visibility;
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
                                permissions[5][3].value?
                                <div className="col">
                                    <div className="float-right">
                                        <Link to='/questions/add' className="btn btn-primary btn-sm float-right rounded" title={lang[1]}><i className="fas fa-plus-square"></i></Link> 
                                    </div>
                                </div>:null
                            }
                        </div>                
                        <QuestionTable
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

export default QuestionManagement;