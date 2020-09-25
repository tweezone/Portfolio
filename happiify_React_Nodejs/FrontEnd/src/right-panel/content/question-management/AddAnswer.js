import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {Link} from 'react-router-dom';
import LANGUAGE from '../../../service/Language-data';
import apiRoot from '../../../config.api';

import EmbeddedEditor from '../../../service/components/EmbeddedEditor';

class AddAnswer extends Component{
    state={
        images:'',
        uploadFiles: [],
        content:''
    }

    static propTypes={
        langState: PropTypes.string.isRequired,
        questionId: PropTypes.number.isRequired,
        total_answers: PropTypes.number.isRequired,
        logInName: PropTypes.string.isRequired
    }
    
    getEditorContent=(content)=>{
        this.setState({ content });
    }

    handleUploadChange=(e)=>{        
        let uploadFiles = [];
        for(let i=0; i<e.target.files.length; i++){
            uploadFiles.push(e.target.files[i]);
        }
        this.setState({ 
            images: e.target.value,
            uploadFiles
        });
    }
    
    handleSubmit=(e)=>{
        const { images, uploadFiles, content } = this.state;
        const { questionId, logInName, total_answers } = this.props
        const formData = new FormData();
        formData.append('questionId', questionId);
        formData.append('username', logInName);
        formData.append('total_answers', total_answers);
        formData.append('images', images);
        formData.append('content', content);

        uploadFiles.forEach(one=> formData.append('uploadFiles', one));

        if(content === '' && uploadFiles.length === 0){
            alert(`You did Not enter or upload anything. Please try again, or return to answers list. `);
        }
        else{
            axios.post(apiRoot + "questions/answers/add", formData, {
                headers:{'Content-Type':'multipart/form-data'}
            })
            .then(res => {
                alert("An answer was added!");
                this.setState({
                    images:'',
                    uploadFiles: [],
                    content:''
                });
            })
            .catch(err=>{
                console.log("Adding an answer error in AddAnswer component!");
            });
        }
        e.preventDefault();
    }

    handleClickReset=()=>{
        this.setState({
            images:'',
            uploadFiles: [],
            content:''
        });
    }
    
    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.AddAnswer.cn;
        else lang=LANGUAGE.AddAnswer.en;
        
        return(
            <div className="container">
                <div className="card rounded">
                    <div className="card-header"> 
                        <h5>{lang[0]}</h5>
                    </div>
                    <div className="card-body">
                        <div className="text-right">
                            <Link to="/questions/answers" className="btn btn-primary btn-sm rounded" title={lang[1]}><i className="fas fa-arrow-alt-circle-right"></i></Link>
                            <br/>
                        </div>                   
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="answer_images_add">{lang[2]}</label>
                                <input name="images" type="file" multiple className="form-control" id="answer_images_add" value={this.state.images} onChange={this.handleUploadChange}/>
                            </div>
                            <div className="form-group">
                                <label>{lang[3]}</label>
                                <EmbeddedEditor 
                                    content={this.state.content}
                                    getContent={this.getEditorContent}/>
                            </div>
                            <div className="btn-group">
                                <button type="submit" className="btn btn-success btn-sm mr-2 rounded" title={lang[4]}><i className="fas fa-save"></i></button>
                                <button type="reset" className="btn btn-danger btn-sm rounded" title={lang[5]} onClick={this.handleClickReset}><i className="fas fa-undo-alt"></i></button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );        
    }
}

export default AddAnswer;