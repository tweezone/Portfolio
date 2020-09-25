import React, { Component } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import LANGUAGE from '../../../service/Language-data';
import apiRoot from '../../../config.api';

//import EmbeddedEditor from '../EmbeddedEditor';

class AddVideo extends Component{
    state={
            allCategories:[],
            category:'',
            title: '',
            desc:'',
            coverImage: '',
            videoPath: '',
            timeLength: ''
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
/*
    getEditorContent=(content)=>{
        this.setState({ desc: content });
    }
*/   
   handleSubmit=(e)=>{
        const { logInName } = this.props;
        const { category, title, desc, coverImage, videoPath, timeLength} = this.state;
        const formData = new FormData();
        formData.append('username', logInName);
        formData.append('category', category);
        formData.append('title', title);
        formData.append('desc', desc);
        formData.append('coverImage', coverImage);
        formData.append('videoPath', videoPath);
        formData.append('timeLength', timeLength);

        const image = document.getElementById('video_image_add');
        formData.append('image', image.files[0]);
        const video = document.getElementById('video_video_add');
        formData.append('video', video.files[0]);

        const format = videoPath.slice(-(videoPath.length-videoPath.lastIndexOf('.')-1));
        if(format !== 'mp4'){
            alert(`The video format must be "mp4". Please try again! `)
        }
        else{
            axios.post(apiRoot + "videos/add", formData, {
                    headers:{'Content-Type':'multipart/form-data'}
                })
                .then(res => {
                    alert("One video was added!");
                    this.setState({
                        category: this.state.allCategories[0].name,
                        title: '',
                        desc:'',
                        coverImage: '',
                        videoPath: '',
                        timeLength: ''
                    });
                })
                .catch(err=>{
                    console.log("Adding a video error in AddVideo component!");
            });
        }
        e.preventDefault();
    }

    handleClickReset=()=>{
        this.setState({
            category: this.state.allCategories[0].name,
            title: '',
            desc:'',
            coverImage: '',
            videoPath: '',
            timeLength: ''
        });
    }

    componentDidMount(){
        axios.get(apiRoot + "videos/categories")
            .then((res) => {            
                this.setState({ 
                    allCategories: res.data,
                    category: res.data[0].name
                });
            })
            .catch((err) => {            
                console.log("Getting categories error in AddVideo component!");            
            });
    }

    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.AddVideo.cn;
        else lang=LANGUAGE.AddVideo.en;
        
        const Categories=this.state.allCategories;
        let count=0;
        const options=[];
        for (let i=0; i<Categories.length; i++){            
            options.push(
                <option key={count} value={Categories[i].name}>{Categories[i].name}</option>
            );
            count++;
        }       

        return(
            <div className="container">
                <div className="card rounded">
                    <div className="card-header"> 
                        <h5>{lang[0]}</h5>
                    </div>
                    <div className="card-body">
                        <div className="text-right">
                            <div className="text-right mb-2">
                                <Link to="/videos" className="btn btn-primary btn-sm rounded" title={lang[1]}><i className="fas fa-arrow-alt-circle-right"></i></Link>
                            </div>
                        </div>                    
                        <form onSubmit={this.handleSubmit} encType="multipart/form-data">
                            <div className="form-row">
                                <div className="form-group col-md-4">
                                    <label htmlFor="category">{lang[2]}</label>
                                    <select name="category" className="custom-select mr-sm-2" id="category" value={this.state.category} onChange={this.handleChange} required>
                                            {options}
                                    </select>
                                </div>                                
                                <div className="form-group col-md-4">
                                    <label htmlFor="title" >{lang[3]}</label>
                                    <input name="title" type="text" className="form-control" id="title" value={this.state.title} onChange={this.handleChange} required/>
                                </div>                                
                                <div className="form-group col-md-4">
                                    <label htmlFor="length">{lang[7]}</label>
                                    <input name="timeLength" type="text" className="form-control" id="length" value={this.state.timeLength} onChange={this.handleChange} placeholder="00:00"/>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label htmlFor="video_image_add" >{lang[5]}</label>
                                    <input name="coverImage" type="file" className="form-control" id="video_image_add" value={this.state.coverImage}  onChange={this.handleChange}/>
                                    
                                </div>                    
                                <div className="form-group col-md-6">
                                    <label htmlFor="video_video_add">{lang[6]}</label>
                                    <input name="videoPath" type="file" className="form-control" id="video_video_add" value={this.state.videoPath} onChange={this.handleChange} required/>
                                </div>
                                
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-12">
                                    <label htmlFor="desc">{lang[4]}</label>
                                    <textarea name="desc" className="form-control" id="desc" rows="15" value={this.state.desc} onChange={this.handleChange}/>
                                    {/*<EmbeddedEditor 
                                        content={this.state.desc}
                                        getContent={this.getEditorContent}/>*/}
                                </div>
                            </div>
                            <div className="btn-group">
                                <button type="submit" className="btn btn-success btn-sm mr-2 rounded" title={lang[8]}><i className="fas fa-save"></i></button>
                                <button type="reset" className="btn btn-danger btn-sm rounded" title={lang[9]} onClick={this.handleClickReset}><i className="fas fa-undo-alt"></i></button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );        
    }
}

export default AddVideo;