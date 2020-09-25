import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {Link} from 'react-router-dom';
import LANGUAGE from '../../../service/Language-data';
import apiRoot from '../../../config.api';

class UpdateDoctorCategory extends Component{
    state={
        langList: [],
        name: '',
        image: '',
        language: '' 
    }

    static propTypes={
        langState: PropTypes.string.isRequired,
        doctorCategoryId: PropTypes.number.isRequired
    };

    handleChange=(e)=>{
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleClick=(e)=>{
        const {name, image, language, langList} = this.state;
        const formData = new FormData();
        formData.append('id', this.props.doctorCategoryId);
        formData.append('name', name);
        formData.append('image', image);
        formData.append('language', language);

        const uploadImage = document.getElementById('doctor_cate_image_update');
        formData.append('uploadImage', uploadImage.files[0]);

        axios.put(apiRoot + "health/doctors/categories/update", formData, {
                headers:{'Content-Type':'multipart/form-data'}
            })
            .then(res => {
                alert("A category was updated!");
                this.setState({
                    name: '',
                    group: '',
                    language: langList[0].name
                });
            })
            .catch(err=>{
                console.log("Updating an attribute error in UpdateDoctorCategory component!");
        });
        e.preventDefault();
    }

    componentDidMount(){
        const { doctorCategoryId } = this.props;
        axios.get(apiRoot + "health/doctors/categories")
            .then((res) => {
                const currentOne = res.data.find((one)=> one.id === +doctorCategoryId);
                this.setState({ 
                    name:       currentOne.name,
                    image:      currentOne.image,
                    language:   currentOne.language
                });
            })
            .catch((err) => {            
                console.log("Getting the category error in UpdateDoctorCategory component!");            
        });
        
        axios.get(apiRoot + "languages")
            .then((res) => {          
                this.setState({ 
                    langList: res.data
                });
            })
            .catch((err) => {            
                console.log("Getting languages error in UpdateDoctorCategory component!");            
        });
    }

    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.UpdateDoctorCategory.cn;
        else lang=LANGUAGE.UpdateDoctorCategory.en;

        const { langList } = this.state;
        return(
            <div className="container-fluid">
                <div className="card rounded">
                    <div className="card-header">
                        <span style={{fontSize: "1.4em"}}><i className="fas fa-pencil-alt"></i>&nbsp;{lang[0]}</span>
                        <div className="float-right">
                            <div className=" btn-toolbar " >
                                <div className="btn-group-sm mr-2" role="group" aria-label="First group">
                                    <button type="button" className="btn btn-success" onClick={this.handleClick} title={lang[1]}><i className="fas fa-save"></i></button>
                                </div>
                                <Link to='/health/doctors/categories'>
                                    <div className="btn-group-sm mr-2" role="group" aria-label="Second group">
                                        <button type="button" className="btn btn-primary" title={lang[2]}><i className="fas fa-arrow-alt-circle-right"></i></button>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="card-body" style={{fontWeight: 'bold'}}>
                        <div className="row">
                            <div className="col col-sm-2 text-right input-group-sm">
                                <label htmlFor="id" className="col-form-label">{lang[3]}</label>
                            </div>
                            <div className="col col-sm-10 input-group-sm">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">{this.props.doctorCategoryId}</span>
                                </div>
                            </div>
                        </div>
                        <hr/>
                        <div className="row">
                            <div className="col col-sm-2 text-right input-group-sm">
                                <label htmlFor="name" className="col-form-label">{lang[4]}</label>
                            </div>
                            <div className="col col-sm-10 input-group-sm">
                                <input name="name" type="text" className="form-control" id="name" value={this.state.name} onChange={this.handleChange} required/>
                            </div>
                        </div>
                        <hr/>
                        <div className="row">
                            <div className="col col-sm-2 text-right input-group-sm">
                                <label htmlFor="doctor_cate_image_update" className="col-form-label">{lang[5]}</label>
                            </div>
                            <div className="col col-sm-10 input-group-sm">
                                <input name="image" type="file" className="form-control" id="doctor_cate_image_update" onChange={this.handleChange}/>
                            </div>
                        </div>
                        <hr/>
                        <div className="row">
                            <div className="col col-sm-2 text-right input-group-sm">
                                <label htmlFor="lang" className="col-form-label">{lang[6]}</label>
                            </div>
                            <div className="col col-sm-10 input-group-sm">
                                <select name="language" className="custom-select mr-sm-2" id="lang" value={this.state.language} onChange={this.handleChange}>
                                    {langList.map((one, index) => <option key={index} value={one.name}>{one.name}</option> )}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>            
            </div>
        );
    }
}

export default UpdateDoctorCategory;