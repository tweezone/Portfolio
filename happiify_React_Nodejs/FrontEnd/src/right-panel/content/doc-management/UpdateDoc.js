import React, { Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import LANGUAGE from '../../../service/Language-data';
import apiRoot from '../../../config.api';

import EmbeddedEditor from '../../../service/components/EmbeddedEditor';

class UpdateDoc extends Component{
    state={
        allCategories:[],
        category:   '',
        titleImage: '',
        title:      '',
        content: ''
        }

    static propTypes={
        langState: PropTypes.string.isRequired,
        docId: PropTypes.number.isRequired,
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
        formData.append('id', this.props.docId);
        formData.append('username', this.props.logInName);
        formData.append('category', this.state.category);
        formData.append('feature_image_url', this.state.titleImage);
        formData.append('post_title', this.state.title);
        formData.append('post_content', this.state.content);

        const image = document.getElementById('doc_image_update');
        formData.append('image', image.files[0]);

        axios.put(apiRoot + "documents/update", formData, {
                headers:{'Content-Type':'multipart/form-data'}
            })
            .then(res => {
                alert("A document was updated!");
                this.setState({
                    category:'0',
                    titleImage:'',
                    title: '',
                    content: ''
                });
            })
            .catch(err=>{
                console.log("Error: " + err);
        });
        e.preventDefault();
    }

    componentDidMount(){
        const { docId } = this.props;
        axios.get(apiRoot + "documents")
            .then((res) => {
                const currentOne = res.data.find(one=> +one.id === docId);
                this.setState({
                    category:   currentOne.categories_name,
                    titleImage: currentOne.feature_image_url,
                    title:      currentOne.post_title,
                    content:    currentOne.post_content
                })
            })
            .catch((err) => {            
                console.log("Getting document error in UpdateDoc component!");            
            });

        axios.get(apiRoot + "documents/categories")
            .then((res) => {            
                this.setState({ 
                    allCategories: res.data 
                });
            })
            .catch((err) => {            
                console.log("Getting categories error in UpdateDoc component!");            
            });
    }

    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.UpdateDoc.cn;
        else lang=LANGUAGE.UpdateDoc.en;
        
        const {allCategories} = this.state;
       
        return(
            <div className="container">
            <div className="card rounded">
                <div className="card-header"> 
                    <h5>{lang[0]}</h5>
                </div>
                <div className="card-body">
                    <br/>    
                    <form onSubmit={this.handleSubmit} >
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="category">{lang[1]}</label>
                                <select name="category" className="custom-select mr-sm-2" id="category" value={this.state.category} onChange={this.handleChange}>
                                        {allCategories.map((one, index)=><option key={index} value={one.name}>{one.name}</option>)}
                                </select>
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="doc_image_update">{lang[2]}</label>
                                <input name="titleImage" type="file" className="form-control" id="doc_image_update"  onChange={this.handleChange}/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="title">{lang[3]}</label>
                            <input name="title" type="text" className="form-control" id="title" value={this.state.title} onChange={this.handleChange}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="content">{lang[4]}</label>
                            <EmbeddedEditor 
                                    content={this.state.content}
                                    getContent={this.getEditorContent}/>
                        </div>
                        <div className="btn-group">
                            <button type="submit" className="btn btn-success btn-sm mr-2 rounded" title={lang[5]}><i className="fas fa-save"></i></button>
                            <Link to="/documents" className="btn btn-primary btn-sm rounded" title={lang[6]}><i className="fas fa-arrow-alt-circle-right"></i></Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        );        
    }
}

export default UpdateDoc;