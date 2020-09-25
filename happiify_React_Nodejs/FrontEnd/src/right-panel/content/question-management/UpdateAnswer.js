import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {Link} from 'react-router-dom';
import LANGUAGE from '../../../service/Language-data';
import apiRoot from '../../../config.api';

import EmbeddedEditor from '../../../service/components/EmbeddedEditor';

class UpdateAnswer extends Component{
    state={
        images:'',
        uploadFiles: [],
        answer:'',
        isChanged: false //For answer change, if there is not changes, it's false
    }

    static propTypes={
        langState: PropTypes.string.isRequired,
        questionId: PropTypes.number.isRequired,
        total_answers: PropTypes.number.isRequired,
        answerId: PropTypes.number.isRequired
    }
    
    getEditorContent=(content)=>{
        this.setState({ 
            answer: content,
            isChanged: true
         });
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
        const { images, uploadFiles, answer, isChanged } = this.state;
        const { answerId } = this.props
        const formData = new FormData();
        formData.append('answerId', answerId);
        formData.append('images', images);
        formData.append('answer', answer);

        uploadFiles.forEach(one=> formData.append('uploadFiles', one));

        if((!isChanged) && uploadFiles.length === 0){
            alert(`You did Not enter anything or add any images. Please try again, or return to answers list. `);
        }
        else{
            axios.put(apiRoot + "questions/answers/update", formData, {
                headers:{'Content-Type':'multipart/form-data'}
            })
            .then(res => {
                alert("An answer was updated!");
                this.setState({
                    images:'',
                    uploadFiles: [],
                    answer:'',
                    isChanged: false
                });
            })
            .catch(err=>{
                console.log("Updating an answer error in UpdateAnswer component!");
            });
        }
        e.preventDefault();
    }

    handleClickReset=()=>{
        this.setState({
            images:'',
            uploadFiles: [],
            answer:'',
            isChanged: false
        });
    }

    componentDidMount(){
        const { questionId, answerId } = this.props;
        axios.get(apiRoot + "questions/answers")
            .then((res) => {
                const currentAnswers = res.data.filter(one=> one.quizs_id === +questionId);
                const currentAnswer = currentAnswers.find(one=> one.id === +answerId);
                this.setState({ answer: currentAnswer.answers });
            })
            .catch((err) => {            
                console.log("Getting answers error in UpdateAnswer component!");            
        });
    }
    
    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.UpdateAnswer.cn;
        else lang=LANGUAGE.UpdateAnswer.en;

        const { answer } = this.state
        
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
                                    content={ answer }
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

export default UpdateAnswer;