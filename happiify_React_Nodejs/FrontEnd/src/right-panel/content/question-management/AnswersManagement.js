import React, {Component} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {Link} from 'react-router-dom';
import LANGUAGE from '../../../service/Language-data';
import apiRoot from '../../../config.api';

import SearchBar from '../../../service/components/SearchBar';
import PagingBar from '../../../service/components/PagingBar';
import EmbeddedEditor from '../../../service/components/EmbeddedEditor';

class AnswersManagement extends Component{
    constructor(props){
        super(props);
        this.state={
            currentAnswers:[],
            question: '',
            images:[],
            searchContent:'',     // Accept the value of "change"; Used for search after the button is clicked.
            searchChange:'',      // Accept the value changed in "input".
            currentPage: 1,
            currentId: '',
            currentTitle: '',
            currentTotal_answers: ''
        };
        this.tag=[];
    }
    
    
    static propTypes = {
        langState: PropTypes.string.isRequired,
        questionId: PropTypes.number.isRequired,
        total_answers: PropTypes.number.isRequired
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
        const { questionId, total_answers } = this.props;
        if(window.confirm(`Do you really want to delete No. ${id} answer?`)){
            axios.put(apiRoot + "questions/answers/delete", {   answer_id:id, 
                                                                question_id: questionId, 
                                                                answers: total_answers })
                .then(res => {
                    alert("You have deleted an answer.");
                    axios.get(apiRoot + "questions/answers")
                        .then((res) => {
                            const currentAnswers = res.data.filter(one=> one.quizs_id === +questionId);
                            this.setState({ currentAnswers });
                        })
                        .catch((err) => {            
                            console.log("Getting answers error in AnswersManagement component!");            
                    });
                })
                .catch(err=>{
                    console.log("Deleting answer error in AnswersManagement component!");
            });
            e.preventDefault();
        }
    }

    handleClickUpdate=(id)=>{
        this.props.clickUpdate(id);        
    }

    handleClickUpdateImage=(id)=>{
        this.props.clickUpdate(id);
    }

    componentDidMount(){
        const { questionId } = this.props;
        axios.get(apiRoot + "questions/answers")
            .then((res) => {
                const currentAnswers = res.data.filter(one=> one.quizs_id === +questionId);
                this.setState({ currentAnswers });
            })
            .catch((err) => {            
                console.log("Getting answers error in AnswersManagement component!");            
        });

        axios.get(apiRoot + "questions")
            .then((res) => { 
                const question = res.data.find(one=> one.id === +questionId).questions;
                this.setState({ question });  
            })
            .catch((err) => {            
                console.log("Getting questions error in AnswersManagement component!");            
        });

        axios.get(apiRoot + "questions/answers/images")
            .then((res) => {
                  this.setState({ images: res.data });
            })
            .catch((err) => {            
                console.log("Getting answers' images error in AnswersManagement component!");            
        });
    }

    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.AnswersManagement.cn;
        else lang=LANGUAGE.AnswersManagement.en;

        const {currentAnswers, question, images, searchContent, currentPage} = this.state;
        
        const row=[];
        currentAnswers.forEach((one, index)=>{            
            if( (one.username.toUpperCase().indexOf(searchContent.toUpperCase())===-1)&&
                (one.answers.toUpperCase().indexOf(searchContent.toUpperCase())===-1)){
                return;
            }
            
            row.push(
                <tr key={index}>
                    <th style={{verticalAlign: 'middle'}} scope="row">{one.id}</th>
                    <td style={{verticalAlign: 'middle'}} >{one.username}</td>
                    <td style={{verticalAlign: 'middle'}} >{one.answers}</td>
                    <td style={{verticalAlign: 'middle'}} ><Link to="/questions/answers/images" className="btn btn-warning btn-sm rounded" onClick={()=>this.handleClickUpdateImage(one.id)}>{(images.filter(a=>a.answers_id === one.id)).length}</Link></td>
                    <td style={{verticalAlign: 'middle'}} >
                        <div className="btn-group">
                            <Link to="/questions/answers/update" className="btn btn-success btn-sm rounded mr-2" onClick={()=>this.handleClickUpdate(one.id)} title={lang[10]}><i className="fas fa-pencil-alt"></i></Link>
                            <button type="button" className="btn btn-danger btn-sm rounded" onClick={(e)=>this.handleClickDelete(e, one.id)} title={lang[11]}><i className="fas fa-trash-alt"></i></button>
                        </div>
                    </td>
                </tr>
            );
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
                        <label>{lang[1]}</label>
                        <hr/>
                        <div className="form-group">
                            <EmbeddedEditor 
                                content={ question }
                                toolbarHidden = { true }
                               />
                        </div>
                        <br/>
                        <label>{lang[2]}</label>
                        <hr/>
                        <div className="row">
                            <div className="col">
                                <div className="float-left">
                                    <SearchBar 
                                            langState={this.props.langState}
                                            searchContent={this.handleSearchContent}
                                            searchSubmit={this.handleSearchSubmit} />
                                </div>
                            </div>
                            <div className="col ">
                                <div className="btn-group float-right">
                                    <Link to='/questions/answers/add' className="btn btn-primary btn-sm mr-2 rounded" title={lang[3]}><i className="fas fa-plus-square"></i></Link>
                                    <Link to='/questions' className="btn btn-primary btn-sm rounded" title={lang[4]}><i className="fas fa-arrow-alt-circle-right"></i></Link>
                                </div>
                            </div>
                        </div>                
                        <div className="table-responsive rounded">
                            <table className="table table-hover table-bordered text-center">
                                <thead className="thead-dark">
                                    <tr>
                                        <th scope="col" style={{width:"5%"}}>{lang[5]}</th>
                                        <th scope="col" style={{width:"15%"}}>{lang[6]}</th>
                                        <th scope="col" style={{width:"60%"}}>{lang[7]}</th>
                                        <th scope="col" style={{width:"10%"}}>{lang[8]}</th>
                                        <th scope="col" style={{width:"10%"}}>{lang[9]}</th>
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
                            pageChange={this.handlePageChange}/>
                    </div>
                </div>                
            </div>
        );
    }
}

export default AnswersManagement;