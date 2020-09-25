import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {Link} from 'react-router-dom';
import LANGUAGE from '../../../service/Language-data';
import apiRoot from '../../../config.api';

class AddDoctorCategory extends Component{
    state={
        langList: [],
        allCategories: [],
        name: '',
        image: '',
        language: '' 
    }

    static propTypes={
        langState: PropTypes.string.isRequired
    };

    handleChange=(e)=>{
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleClick=(e)=>{
        const {name, image, language, allCategories} = this.state;

        const formData = new FormData();
        formData.append('name', name);
        formData.append('image', image);
        formData.append('language', language);

        const uploadImage = document.getElementById('doctor_cate_image_add');
        formData.append('uploadImage', uploadImage.files[0]);

        const one = allCategories.find(one=>one.name === name);
        if(one){
            alert(`The category has already existed. Please try again!`);
        }
        else{
           axios.post(apiRoot + "health/doctors/categories/add", formData, { 
                    headers:{'Content-Type':'multipart/form-data'}
                })
                .then(res => {
                    alert("A category was added!");
                    const language = this.props.langState==='cn'? '简体中文':'English';
                    this.setState({
                        name: '',
                        image: '',
                        language: language
                    });
                })
                .catch(err=>{
                    console.log("Adding a category error in AddDoctorCategory component!");
            });
            e.preventDefault(); 
        }
    }

    componentDidMount(){
        const language = this.props.langState==='cn'? '简体中文':'English';
        axios.get(apiRoot + "languages")
            .then((res) => {          
                this.setState({ 
                    langList: res.data,
                    language: language
                });
            })
            .catch((err) => {            
                console.log("Getting languages error in AddDoctorCategory component!");            
            });

        axios.get(apiRoot + "health/doctors/categories")
            .then((res) => {            
                this.setState({ 
                    allCategories: res.data
                });
            })
            .catch((err) => {            
                console.log("Getting categories error in AddDoctor component!");            
            });    
            
    }

    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.AddDoctorCategory.cn;
        else lang=LANGUAGE.AddDoctorCategory.en;

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
                                <label htmlFor="name" className="col-form-label">{lang[3]}</label>
                            </div>
                            <div className="col col-sm-10 input-group-sm">
                                <input name="name" type="text" className="form-control" id="name" value={this.state.name} onChange={this.handleChange} required/>
                            </div>
                        </div>
                        <hr/>
                        <div className="row">
                            <div className="col col-sm-2 text-right input-group-sm">
                                <label htmlFor="doctor_cate_image_add" className="col-form-label">{lang[4]}</label>
                            </div>
                            <div className="col col-sm-10 input-group-sm">
                                <input name="image" type="file" className="form-control" id="doctor_cate_image_add" value={this.state.image}  onChange={this.handleChange}/>
                            </div>
                        </div>
                        <hr/>
                        <div className="row">
                            <div className="col col-sm-2 text-right input-group-sm">
                                <label htmlFor="lang" className="col-form-label">{lang[5]}</label>
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

export default AddDoctorCategory;