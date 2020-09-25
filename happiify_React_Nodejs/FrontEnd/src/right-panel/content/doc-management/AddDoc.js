import React, { Component } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import LANGUAGE from '../../../service/Language-data';
import apiRoot from '../../../config.api';

import EmbeddedEditor from '../../../service/components/EmbeddedEditor';

class AddDoc extends Component{
    state={
        allCategories:[],
        category:'',
        titleImage:'',
        title: '',
        content: ''
    }

    static propTypes={
        langState: PropTypes.string.isRequired,
        logInName: PropTypes.string.isRequired
    }
    
    handleChange=(e)=>{
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    getEditorContent=(content)=>{
        this.setState({ content });
    }

    handleSubmit=(e)=>{
        const formData = new FormData();
        formData.append('username', this.props.logInName);
        formData.append('category', this.state.category);
        formData.append('feature_image_url', this.state.titleImage);
        formData.append('post_title', this.state.title);
        formData.append('post_content', this.state.content);

        const image = document.getElementById('doc_image_add');
        formData.append('image', image.files[0]);

        axios.post(apiRoot + "documents/add", formData, {
                headers:{'Content-Type':'multipart/form-data'}
            })
            .then(res => {
                alert("A document was added!");
                this.setState({
                    category: this.state.allCategories[0].name,
                    titleImage:'',
                    title: '',
                    content: ''
                });
            })
            .catch(err=>{
                console.log("[Error] - POST /documents/add - at AddDoc component!");
                console.log(err);
                alert("Sorry！ The system is very busy now. The data cannot be saved. Please try it later.");
        });
        e.preventDefault();
    }

    handleClickReset=()=>{
        this.setState({
            category: this.state.allCategories[0].name,
            titleImage:'',
            title: '',
            content: ''
        });
    }

    componentDidMount(){
        axios.get(apiRoot + "documents/categories")
            .then((res) => {            
                this.setState({ 
                    allCategories: res.data,
                    category: res.data[0].name
                });
            })
            .catch((err) => {
                console.log("[Error] - GET /documents/categories - at AddDoc component!");
                console.log(err);            
        });
    }

    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.AddDoc.cn;
        else lang=LANGUAGE.AddDoc.en;

        const {allCategories} = this.state;
        return(
            <div className="container">
                <div className="card rounded">
                    <div className="card-header"> 
                        <h5>{lang[0]}</h5>
                    </div>
                    <div className="card-body">
                        <div className="text-right mb-2">
                            <Link to="/documents" className="btn btn-primary btn-sm rounded" title={lang[1]}><i className="fas fa-arrow-alt-circle-right"></i></Link>
                        </div>                   
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-row">          
                                <div className="form-group col-md-6">
                                    <label htmlFor="category">{lang[2]}</label>
                                    <select name="category" className="custom-select mr-sm-2" id="category" value={this.state.category} onChange={this.handleChange} required>
                                             {allCategories.map((one, index) => <option key={index} value={one.name}>{one.name}</option> )}
                                    </select>
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="doc_image_add">{lang[3]}</label>
                                    <input name="titleImage" type="file" className="form-control" id="doc_image_add" value={this.state.titleImage}  onChange={this.handleChange} required/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="title">{lang[4]}</label>
                                <input name="title" type="text" className="form-control" id="title" value={this.state.title} onChange={this.handleChange} required/>
                            </div>
                            <div className="form-group">
                                <label>{lang[5]}</label>
                                <EmbeddedEditor 
                                    content={this.state.content}
                                    getContent={this.getEditorContent}/>
                            </div>
                            <div className="btn-group">
                                <button type="submit" className="btn btn-success btn-sm mr-2 rounded" title={lang[7]}><i className="fas fa-save"></i></button>
                                <button type="reset" className="btn btn-danger btn-sm rounded" title={lang[8]} onClick={this.handleClickReset}><i className="fas fa-undo-alt"></i></button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );        
    }
}

export default AddDoc;