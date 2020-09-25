import React, { Component } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import LANGUAGE from '../../../service/Language-data';
import apiRoot from '../../../config.api';

//import EmbeddedEditor from '../EmbeddedEditor';

class UpdateVideo extends Component{
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
        videoId: PropTypes.number.isRequired,
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
        const formData = new FormData();
        formData.append('id', this.props.videoId);
        formData.append('username', this.props.logInName);
        formData.append('category', this.state.category);
        formData.append('title', this.state.title);
        formData.append('desc', this.state.desc);
        formData.append('coverImage', this.state.coverImage);
        formData.append('videoPath', this.state.videoPath);
        formData.append('timeLength', this.state.timeLength);

        const image = document.getElementById('video_image_update');
        formData.append('image', image.files[0]);
        const video = document.getElementById('video_video_update');
        formData.append('video', video.files[0]);

        axios.put(apiRoot + 'videos/update', formData, {
                headers:{'Content-Type':'multipart/form-data'}
            })
            .then(res => {
                alert("One video was updated!");
                this.setState({
                    category:'',
                    title: '',
                    desc:'',
                    coverImage: '',
                    videoPath: '',
                    timeLength: ''
                }); 
            })
            .catch(err=>{
                console.log("Updating a video error in UpdateVideo component!");
        });
        e.preventDefault();
    }

    componentDidMount(){
        const { videoId } = this.props;
        axios.get(apiRoot + "videos")
            .then((res) => {
                const currentOne = res.data.find(one=> one.id === +videoId);
                this.setState({
                    category:   currentOne.category_name,
                    title:      currentOne.video_title,
                    desc:       currentOne.video_description,
                    coverImage: currentOne.cover_image_path,
                    videoPath:  currentOne.video_path,
                    timeLength: currentOne.time_length
                })
            })
            .catch((err) => {            
                console.log("Getting document error in UpdateVideo component!");            
            });

        axios.get(apiRoot + "videos/categories")
            .then((res) => {            
                this.setState({ allCategories: res.data });
            })
            .catch((err) => {            
                console.log("Getting categories error in UpdateVideo component!");            
            });
    }

    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.UpdateVideo.cn;
        else lang=LANGUAGE.UpdateVideo.en;
        
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
                        <br/>  
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-row">
                                <div className="form-group col-md-4">
                                    <label htmlFor="category">{lang[2]}</label>
                                    <select name="category" className="custom-select mr-sm-2" id="category" value={this.state.category} onChange={this.handleChange} >
                                            {options}
                                    </select>
                                </div>                                
                                <div className="form-group col-md-4">
                                    <label htmlFor="title" >{lang[3]}</label>
                                    <input name="title" type="text" className="form-control" id="title" value={this.state.title} onChange={this.handleChange} />
                                </div>                                
                                <div className="form-group col-md-4">
                                    <label htmlFor="length">{lang[7]}</label>
                                    <input name="timeLength" type="text" className="form-control" id="length" value={this.state.timeLength} onChange={this.handleChange} placeholder="00:00" />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label htmlFor="video_image_update" >{lang[5]}</label>
                                    <input name="coverImage" type="file" className="form-control" id="video_image_update" onChange={this.handleChange}/>
                                    
                                </div>                    
                                <div className="form-group col-md-6">
                                    <label htmlFor="video_video_update">{lang[6]}</label>
                                    <input name="videoPath" type="file" className="form-control" id="video_video_update" onChange={this.handleChange}/>
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
                                <Link to="/videos" className="btn btn-primary btn-sm rounded" title={lang[9]}><i className="fas fa-arrow-alt-circle-right"></i></Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );        
    }
}

export default UpdateVideo;