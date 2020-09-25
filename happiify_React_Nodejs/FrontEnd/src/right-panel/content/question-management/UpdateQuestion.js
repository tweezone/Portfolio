import React, { Component} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {Link} from 'react-router-dom';
import LANGUAGE from '../../../service/Language-data';
import apiRoot from '../../../config.api';

import QuestionImageModal from './QuestionImage-Modal';
import EmbeddedEditor from '../../../service/components/EmbeddedEditor';

class UpdateQuestion extends Component{
    state={
        allTags: [],
        allCurrencies: [],
        title: '',
        cover_image: '',
        tag_name: '',
        payable: '',
        currency: '',
        question: ''
    };
    
    static propTypes={
        langState: PropTypes.string.isRequired,
        logInName: PropTypes.string.isRequired,
        questionId: PropTypes.number.isRequired
    }

    handleChange=(e)=>{
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    getEditorContent=(content)=>{
        this.setState({ question: content });
    }

    handleSubmit=(e)=>{
        const { title, cover_image, tag_name, payable, currency, question } = this.state;
        const { questionId, logInName } = this.props;

        const formData = new FormData();
        formData.append('id', questionId);
        formData.append('user', logInName);
        formData.append('title', title);
        formData.append('cover_image', cover_image);
        formData.append('tag_name', tag_name);
        formData.append('payable', payable);
        formData.append('currency', currency);
        formData.append('question', question);

        const image = document.getElementById('question_image_update');
        formData.append('image', image.files[0]);

        axios.put(apiRoot + "questions/update", formData, {
                headers:{'Content-Type':'multipart/form-data'}
            })
            .then(res => {
                alert("One question was updated!");
                this.setState({
                    title: '',
                    cover_image: '',
                    tag_name: '',
                    payable: '',
                    currency: '',
                    question: ''
                });
            })
            .catch(err=>{
                console.log("Updating a question error in UpdateQuestion component!");
        });
        e.preventDefault();
    }

    componentDidMount(){
        axios.get(apiRoot + "questions")
            .then((res) => {
                const { questionId } = this.props;
                const currentOne = res.data.find(one=> one.id === +questionId);
                this.setState({
                    title: currentOne.title,
                    cover_image: currentOne.cover_image,
                    tag_name: currentOne.tags_name,
                    payable: currentOne.payable,
                    currency: currentOne.currency,
                    question: currentOne.questions
                })
            })
            .catch((err) => {            
                console.log("Getting questions error in UpdateQuestion component!");            
            });

        axios.get(apiRoot + "questions/categories")
            .then((res) => {            
                this.setState({ allTags: res.data });
            })
            .catch((err) => {            
                console.log("Getting categories error in UpdateQuestion component!");            
            });

        axios.get(apiRoot + "currencies")
            .then((res) => {            
                this.setState({ allCurrencies: res.data });
            })
            .catch((err) => {            
                console.log("Getting currencies error in UpdateQuestion component!");            
            });
    }

    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.UpdateQuestion.cn;
        else lang=LANGUAGE.UpdateQuestion.en;
        
        const {allTags, allCurrencies}=this.state;

        return(
            <div className="container">
                <div className="card rounded">
                    <div className="card-header"> 
                        <h5>{lang[0]}</h5>
                    </div>
                    <div className="card-body">
                        <br/>
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-row">          
                                <div className="form-group col-md-4">
                                    <label htmlFor="title">{lang[1]}</label>
                                    <input name="title" type="text" className="form-control" id="title" value={this.state.title}  onChange={this.handleChange} required/>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="question_image_update">{lang[2]}</label>
                                    <input name="cover_image" type="file" className="form-control" id="question_image_update" onChange={this.handleChange}/>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="tags">{lang[3]}</label>
                                    <select name="tag_name" className="custom-select mr-sm-2" id="tags" value={this.state.tag_name} onChange={this.handleChange}>
                                            {allTags.map((one, index) => <option key={index} value={one.name}>{one.name}</option> )}
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group col-md-4">
                                    <label htmlFor="reward">{lang[4]}</label>
                                    <input name="payable" type="text" className="form-control" id="reward" value={this.state.payable}  onChange={this.handleChange}/>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="currency">{lang[5]}</label>
                                    <select name="currency" className="custom-select mr-sm-2" id="currency" value={this.state.currency} onChange={this.handleChange}>
                                            {allCurrencies.map((one, index) => <option key={index} value={one.name}>{one.name}</option> )}
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="question_upload_image">&nbsp;</label>
                                    <input data-toggle="modal" data-target="#happyModal" 
                                        name="upload" type="button" className="form-control btn btn-outline-secondary btn-sm rounded" id="question_upload_image" value={lang[6]} />
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label>{lang[7]}</label>
                                <EmbeddedEditor 
                                    content={this.state.question}
                                    getContent={this.getEditorContent}/>
                            </div>
                            <div className="btn-group">
                                <button type="submit" className="btn btn-success btn-sm mr-2 rounded" title={lang[8]}><i className="fas fa-save"></i></button>
                                <Link to="/questions" className="btn btn-primary btn-sm rounded" title={lang[9]}><i className="fas fa-arrow-alt-circle-right"></i></Link>
                            </div>
                        </form>
                        <QuestionImageModal langState={this.props.langState} currentId={Number(this.props.questionId)} currentTitle={this.state.title}/>
                    </div>
                </div>
            </div>
        );        
    }
}


export default UpdateQuestion;