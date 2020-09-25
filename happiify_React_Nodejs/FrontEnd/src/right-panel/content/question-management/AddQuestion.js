import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {Link} from 'react-router-dom';
import LANGUAGE from '../../../service/Language-data';
import apiRoot from '../../../config.api';

import EmbeddedEditor from '../../../service/components/EmbeddedEditor';

class AddQuestion extends Component{
    state={
            allTags: [],
            allCurrencies: [],
            title: '',
            cover_image: '',
            tag_name: '',
            payable: '',
            currency: '',
            question: '',
            uploadFiles: []
        };
    
    static propTypes={
        langState: PropTypes.string.isRequired,
        logInName: PropTypes.string.isRequired
    }

    handleChange=(e)=>{
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleUploadFiles=(e)=>{
        let files = [];
        for(let i=0; i<e.target.files.length; i++){
            files.push(e.target.files[i]);
        }
        this.setState({ uploadFiles: files });
    }

    getEditorContent=(content)=>{
        this.setState({ question: content });
    }

    handleSubmit=(e)=>{
        const { allTags, allCurrencies, title, cover_image, tag_name, currency, question, uploadFiles } = this.state;
        const { logInName } = this.props;
        const formData = new FormData();
        formData.append('user', logInName);
        formData.append('title', title);
        formData.append('cover_image', cover_image);
        formData.append('tag_name', tag_name);
        let { payable } = this.state;
        if(payable === '' || payable === undefined) payable = 0;
        formData.append('payable', payable);
        formData.append('currency', currency);
        formData.append('question', question);

        const image = document.getElementById('question_image_add');
        formData.append('image', image.files[0]);

        uploadFiles.forEach(one=>formData.append('files', one));
        
        axios.post(apiRoot + "questions/add", formData, {
                headers:{'Content-Type':'multipart/form-data'}
            })
            .then(res => {
                alert("One question was added!");
                this.setState({
                    title: '',
                    cover_image: '',
                    tag_name: allTags[0].name,
                    payable: '',
                    currency: allCurrencies[0].name,
                    question: '',
                    uploadFiles: []
                });
            })
            .catch(err=>{
                console.log("Adding a question error in AddQuestion component!");
        });
        e.preventDefault();
    }

    componentDidMount(){
        axios.get(apiRoot + "questions/categories")
            .then((res) => {          
                this.setState({ 
                    allTags: res.data,
                    tag_name: res.data[0].name
                });
            })
            .catch((err) => {            
                console.log("Getting categories error in AddQuestion component!");            
        });

        axios.get(apiRoot + "currencies")
            .then((res) => {            
                this.setState({ 
                    allCurrencies: res.data,
                    currency: res.data[0].name
                });
            })
            .catch((err) => {            
                console.log("Getting currencies error in AddQuestion component!");            
        });
    }

    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.AddQuestion.cn;
        else lang=LANGUAGE.AddQuestion.en;

        const {allTags, allCurrencies}=this.state;

        return(
            <div className="container">
                <div className="card rounded">
                    <div className="card-header"> 
                        <h5>{lang[0]}</h5>
                    </div>
                    <div className="card-body">
                        <div className="text-right">
                            <Link to="/questions" className="btn btn-primary btn-sm rounded" title={lang[1]}><i className="fas fa-arrow-alt-circle-right"></i></Link>
                            <br/>
                        </div>
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-row">          
                                <div className="form-group col-md-4">
                                    <label htmlFor="title">{lang[2]}</label>
                                    <input name="title" type="text" className="form-control" id="title" value={this.state.title}  onChange={this.handleChange} required/>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="question_image_add">{lang[3]}</label>
                                    <input name="cover_image" type="file" className="form-control" id="question_image_add" value={this.state.cover_image} onChange={this.handleChange}/>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="tags">{lang[4]}</label>
                                    <select name="tag_name" className="custom-select mr-sm-2" id="tags" value={this.state.tag_name} onChange={this.handleChange}>
                                            {allTags.map((one, index) => <option key={index} value={one.name}>{one.name}</option> )}
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group col-md-4">
                                    <label htmlFor="reward">{lang[5]}</label>
                                    <input name="payable" type="text" className="form-control" id="reward" value={this.state.payable}  onChange={this.handleChange}/>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="currency">{lang[6]}</label>
                                    <select name="currency" className="custom-select mr-sm-2" id="currency" value={this.state.currency} onChange={this.handleChange}>
                                            {allCurrencies.map((one, index) => <option key={index} value={one.name}>{one.name}</option> )}
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="question_upload_image">{lang[7]}</label>
                                    <input name="upload" multiple type="file" className="form-control" id="question_upload_image" onChange={this.handleUploadFiles}/>
                                </div>
                            </div>
                            
                            <div className="form-group">
                                <label>{lang[8]}</label>
                                <EmbeddedEditor 
                                    content={this.state.question}
                                    getContent={this.getEditorContent}/>
                            </div>
                            <div className="btn-group">
                                <button type="submit" className="btn btn-success btn-sm mr-2 rounded" title={lang[9]}><i className="fas fa-save"></i></button>
                                <button type="reset" className="btn btn-danger btn-sm rounded" title={lang[10]} onClick={this.handleClickReset}><i className="fas fa-undo-alt"></i></button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );        
    }
}

export default AddQuestion;