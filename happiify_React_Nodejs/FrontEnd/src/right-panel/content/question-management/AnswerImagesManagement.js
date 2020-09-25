import React, {Component} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {Link} from 'react-router-dom';
import LANGUAGE from '../../../service/Language-data';
import apiRoot from '../../../config.api';

import EmbeddedEditor from '../../../service/components/EmbeddedEditor';

class AnswerImagesManagement extends Component{
    state={
            allImages: [],
            answer: '',
            images:'',
            uploadFiles: [],
    }
    
    static propTypes = {
        langState: PropTypes.string.isRequired,
        questionId: PropTypes.number.isRequired,
        answerId: PropTypes.number.isRequired
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
        const { images, uploadFiles } = this.state;
        const { answerId } = this.props

        const formData = new FormData();
        formData.append('answerId', answerId);
        formData.append('images', images);

        uploadFiles.forEach(one=> formData.append('uploadFiles', one));

        if(uploadFiles.length === 0){
            alert(`You did Not upload anything. Please try again, or return to answers list. `);
        }
        else{
            axios.post(apiRoot + "questions/answers/images/add", formData, {
                headers:{'Content-Type':'multipart/form-data'}
            })
            .then(res => {
                alert("An image was added!");
                axios.get(apiRoot + "questions/answers/images")
                    .then((res) => {
                        const allImages = res.data.filter(one=> one.answers_id === +answerId);
                        this.setState({ allImages });
                    })
                    .catch((err) => {            
                        console.log("Getting answers' images error in AnswerImagesManagement component!");            
                });
                this.setState({
                    images:'',
                    uploadFiles: []
                });
            })
            .catch(err=>{
                console.log("Adding an image error in AnswerImagesManagement component!");
            });
        }
        e.preventDefault();
    }

    handleClickDelete=(e, id)=>{
        const {answerId} = this.props;
        if(window.confirm(`Do you really want to delete the image?`)){
            axios.put(apiRoot + "questions/answers/images/delete", { id })
                .then(res => {
                    alert("You have deleted the image.");
                    axios.get(apiRoot + "questions/answers/images")
                        .then((res) => {
                            const allImages = res.data.filter(one=> one.answers_id === +answerId);
                            this.setState({ allImages });
                        })
                        .catch((err) => {            
                            console.log("Getting answers' images error in AnswerImagesManagement component!");            
                    });
                })
                .catch(err=>{
                    console.log("Deleting answer error in AnswerImagesManagement component!");
            });
            e.preventDefault();
        }
    }

    componentDidMount(){
        const { questionId, answerId} = this.props;
        axios.get(apiRoot + "questions/answers/images")
            .then((res) => {
                const allImages = res.data.filter(one=> one.answers_id === +answerId);
                this.setState({ allImages });
            })
            .catch((err) => {            
                console.log("Getting answers' images error in AnswerImagesManagement component!");            
        });

        
        axios.get(apiRoot + "questions/answers")
            .then((res) => {
                const currentAnswers = res.data.filter(one=> one.quizs_id === +questionId);
                const currentAnswer = currentAnswers.find(one=> one.id === +answerId);
                this.setState({ answer: currentAnswer.answers });
            })
            .catch((err) => {            
                console.log("Getting answers error in AnswerImagesManagement component!");            
        });
    }

    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.AnswerImagesManagement.cn;
        else lang=LANGUAGE.AnswerImagesManagement.en;

        const {answer, allImages} = this.state;
       
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
                                content={ answer }
                                toolbarHidden = { true }
                               />
                        </div>
                        <br/>
                        <div className="row">
                            <div className="col text-left">
                                <label>{lang[2]}</label>
                            </div>
                            <div className="col text-right">
                                <Link to='/questions/answers' className="btn btn-primary btn-sm rounded " title={lang[4]}><i className="fas fa-arrow-alt-circle-right"></i></Link> 
                            </div>
                        </div>
                        <hr/> 
                        <div className="row">                        
                                {allImages.map(one =>
                                    <div className="card-deck border-warning mr-2 mb-3" style={{width: '193px',}} key={one.id}> 
                                        <div className='col'>
                                            <div className="card border-secondary">
                                                {(()=>{
                                                    switch(one.media_url.slice(0,4)){
                                                        case '':        return (<span>{'No Image'}</span>);
                                                        case 'http':    return (<img src={one.media_url} className="card-img-top" alt={one.id}/>);
                                                        default:        return (<a href={apiRoot + 'display/image/file?file=' + one.media_url}>
                                                                                    <img src={apiRoot + 'display/image/file?file=' + one.media_url} className="card-img-top" alt={one.id}/>
                                                                                </a>)
                                                    }
                                                })()}
                                                <button className='btn btn-secondary btn-sm rounded text-right' onClick={(e)=>this.handleClickDelete(e, one.id)}><span className='close'>&times;</span></button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                        </div>
                        <br/>
                        <form className="form-inline" onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="answer_image_add" className='mr-2'>{'Add new image:'}</label>
                                <input name="images" type="file" multiple className="form-control mr-2" id="answer_image_add" value={this.state.images} onChange={this.handleUploadChange}/>
                                <button type="submit" className="btn btn-sm btn-primary rounded" title={'Add new'}><i className="fas fa-plus-square"></i></button>
                            </div>
                        </form>
                    </div>
                </div>                
            </div>
        );
    }
}

export default AnswerImagesManagement;