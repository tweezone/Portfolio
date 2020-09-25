import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {Link} from 'react-router-dom';
import LANGUAGE from '../../../service/Language-data';
import apiRoot from '../../../config.api';

//import EmbeddedEditor from '../../../service/components/EmbeddedEditor';
import SelectLocation from '../../../service/components/SelectLocation';

class UpdateDoctor extends Component{
    state={
        allCategories: [],
        langList: [],
        language: '',
        quizCategoryId: 0,
        prev_user: '',
        user_name: '',
        real_name: '',
        image: '',
        uploadImage: '',
        imageUrl: '',
        city_id: 0,
        title: '',
        edu: '',
        quali: '', 
        category: '',
        major: '',
        achiev: ''
    }

    static propTypes={
        langState: PropTypes.string.isRequired,
        logInName: PropTypes.string.isRequired,
        doctorId: PropTypes.number.isRequired
    };

    handleChange=(e)=>{
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleUploadImage=(e)=>{
        const imageUrl = window.URL.createObjectURL(e.target.files[0]);
        this.setState({
            image: e.target.value,
            uploadImage: e.target.files[0],
            imageUrl
        });
    }

    getCityId=(id)=>{
        this.setState({ city_id: id});
    }

    /*
    getEditorContent=(content)=>{
        this.setState({ desc: content });
    }
    */

    handleClick=(e)=>{
        const { allCategories, langList, language, quizCategoryId, prev_user, user_name, real_name, image, uploadImage, city_id, title, edu, quali, category, major, achiev } = this.state;
        const { doctorId } = this.props;
        axios.get(apiRoot + "users")
            .then((res) => {
                const one1 = res.data.find(one=>one.username === user_name);
                axios.get(apiRoot + "health/doctors")
                    .then((res) => {
                        const one2 = res.data.find(one=>one.username === user_name);
                        if(user_name === ''){
                            alert(`The username cannot be empty! Try again, please!`);
                        }
                        else if(one1 === undefined){
                            alert(`The username you input dose NOT exist! Try again, please!`);
                        }
                        else if(one2 !== undefined && one2.username !== prev_user){
                            alert(`There is a doctor who is using this username. Please check and try again!`);
                        }
                        else if(city_id === 0){
                            alert(`You have to select a city!`);
                        }
                        else if(real_name===''){
                            alert(`The real name cannot be empty. Please try again!`);
                        }
                        else{
                            const formData = new FormData();
                            formData.append('doctorId', doctorId);
                            formData.append('quizCategoryId', quizCategoryId);
                            formData.append('language', language);
                            formData.append('user_name', user_name);
                            formData.append('real_name', real_name);
                            formData.append('image', image);
                            formData.append('uploadImage', uploadImage);
                            formData.append('city_id', city_id);
                            formData.append('title', title);
                            formData.append('edu', edu);
                            formData.append('quali', quali);
                            formData.append('category', category);
                            formData.append('major', major);
                            formData.append('achiev', achiev);

                            axios.put(apiRoot + "health/doctors/update", formData, { 
                                headers:{'Content-Type':'multipart/form-data'}
                            })
                            .then(res => {
                                alert("A doctor was updated!");
                                this.setState({
                                    language: langList[0].languages_name,
                                    quizCategoryId: 0,
                                    user_name: '',
                                    real_name: '',
                                    image: '',
                                    uploadImage: '',
                                    imageUrl: '',
                                    city_id: 0,
                                    title: '',
                                    edu: '',
                                    quali: '',        
                                    category: allCategories[0].name,
                                    major: '',
                                    achiev: ''
                                });
                            })
                            .catch(err=>{ 
                                console.log("[Error] - PUT /health/doctors/update - at UpdateDoctor component!");
                                console.log(err);
                            });
                        }
                    })
                    .catch((err) => { 
                        console.log("[Error] - GET /health/doctors - at UpdateDoctor component!");
                        console.log(err);           
                });
            })
            .catch((err) => { 
                console.log("[Error] - GET /users - at UpdateDoctor component!");
                console.log(err);            
        });
        e.preventDefault();
    }

    componentDidMount(){
        const { doctorId } = this.props;
        axios.get(apiRoot + "health/doctors")
            .then((res) => {
                const currentOne = res.data.find(one=> one.id === +doctorId);
                this.setState({ 
                    language: currentOne.languages_name,
                    quizCategoryId: currentOne.quiz_categories_id,
                    prev_user: currentOne.username,
                    user_name: currentOne.username,
                    real_name: currentOne.name,
                    image: currentOne.image,
                    city_id: currentOne.city_id,
                    title: currentOne.title,
                    edu: currentOne.education,
                    quali: currentOne.qualification, 
                    category: currentOne.categories_name,
                    major: currentOne.major,
                    achiev: currentOne.achievement
                });
            })
            .catch((err) => { 
                console.log("[Error] - GET /health/doctors - at UpdateDoctor component!");
                console.log(err);            
        });
        axios.get(apiRoot + "health/doctors/categories")
            .then((res) => {            
                this.setState({ allCategories: res.data });
            })
            .catch((err) => { 
                console.log("[Error] - GET /health/doctors/categories - at UpdateDoctor component!");
                console.log(err);            
            });
        axios.get(apiRoot + "languages")
            .then((res) => {          
                this.setState({ langList: res.data });
            })
            .catch((err) => {  
                console.log("[Error] - GET /languages - at UpdateDoctor component!");
                console.log(err);           
        });
    }

    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.UpdateDoctor.cn;
        else lang=LANGUAGE.UpdateDoctor.en;

        const { allCategories, langList, image, imageUrl } = this.state;
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
                                <Link to='/health/doctors'>
                                    <div className="btn-group-sm mr-2" role="group" aria-label="Second group">
                                        <button type="button" className="btn btn-primary" title={lang[2]}><i className="fas fa-arrow-alt-circle-right"></i></button>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="card-body" style={{fontWeight: 'bold'}}>
                        <div className="row justify-content-end">
                            <div className="col-10">
                                <div>{lang[3]}</div>
                                <hr/>
                                <div className="row">
                                    <div className="col col-sm-2 text-right input-group-sm">
                                        <label htmlFor="user_name" className="col-form-label">{lang[4]}</label>
                                    </div>
                                    <div className="col col-sm-10 input-group-sm">
                                        <input name="user_name" type="text" className="form-control" id="user_name" value={this.state.user_name} onChange={this.handleChange} required/>
                                    </div>
                                </div>
                                <hr/>
                                <div className="row">
                                    <div className="col col-sm-2 text-right input-group-sm">
                                        <label htmlFor="real_name" className="col-form-label">{lang[5]}</label>
                                    </div>
                                    <div className="col col-sm-10 input-group-sm">
                                        <input name="real_name" type="text" className="form-control" id="real_name" value={this.state.real_name} onChange={this.handleChange} required/>
                                    </div>
                                </div>
                                <hr/>
                                <div className="row">
                                    <div className="col col-sm-2 text-right input-group-sm">
                                        <label htmlFor="image" className="col-form-label">{lang[6]}</label>
                                    </div>
                                    <div className="col col-sm-10 input-group-sm">
                                        <div className="row">
                                            <div className="col col-sm-10">
                                                <input name="image" type="file" className="form-control align-middle" id="image" onChange={this.handleUploadImage}/>
                                            </div>
                                            <div className="col col-sm-2 ">
                                                <div className="card border-secondary float-right">
                                                    { 
                                                        (()=>{
                                                            if(imageUrl !== ''){
                                                                return <img className="card-img-top" style={{width: '130px'}} src={imageUrl} alt={'user icon'}/> 
                                                            }
                                                            else if(image === ''){
                                                                return <img className="card-img-top" style={{width: '130px'}} src="../../../images/default_user.png"  alt={'user icon'}/>
                                                            }
                                                            else{
                                                                return <img src={apiRoot + 'display/image/file?file=' + image} style={{width: '130px'}} alt={'user icon'}/>
                                                            }
                                                        })()
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr/>
                                <div className="row">
                                    <div className="col col-sm-2 text-right input-group-sm">
                                        <label htmlFor="city" className="col-form-label">{lang[7]}</label>
                                    </div>
                                    <div className="col col-sm-10 input-group-sm">
                                        <SelectLocation
                                            cityId={this.state.city_id}
                                            getCityId={this.getCityId}
                                        />
                                    </div>
                                </div>
                                <hr/>
                                <div className="row">
                                    <div className="col col-sm-2 text-right input-group-sm">
                                        <label htmlFor="title" className="col-form-label">{lang[8]}</label>
                                    </div>
                                    <div className="col col-sm-10 input-group-sm">
                                        <input name="title" className="form-control" id="title" rows="5" value={this.state.title} onChange={this.handleChange}/>
                                    </div>
                                </div>
                                <hr/>
                                <div className="row">
                                    <div className="col col-sm-2 text-right input-group-sm">
                                        <label htmlFor="edu" className="col-form-label">{lang[9]}</label>
                                    </div>
                                    <div className="col col-sm-10 input-group-sm">
                                        <input name="edu" type="text" className="form-control" id="edu" value={this.state.edu} onChange={this.handleChange}/>
                                    </div>
                                </div>
                                <hr/>
                                <div className="row">
                                    <div className="col col-sm-2 text-right input-group-sm">
                                        <label htmlFor="quali" className="col-form-label">{lang[10]}</label>
                                    </div>
                                    <div className="col col-sm-10">
                                        <textarea name="quali" className="form-control" id="quali" rows="5" value={this.state.quali} onChange={this.handleChange}/>
                                    </div>
                                </div>
                                <hr/>                                
                                <div className="row">
                                    <div className="col col-sm-2 text-right input-group-sm">
                                        <label htmlFor="category" className="col-form-label">{lang[11]}</label>
                                    </div>
                                    <div className="col col-sm-10 input-group-sm">
                                        <select name="category" className="custom-select mr-sm-2" id="category" value={this.state.category} onChange={this.handleChange}>
                                            {allCategories.map((one, index) => <option key={index} value={one.name}>{one.name}</option> )}
                                        </select>
                                    </div>
                                </div>
                                <hr/>
                                <div className="row">
                                    <div className="col col-sm-2 text-right input-group-sm">
                                        <label htmlFor="major" className="col-form-label">{lang[12]}</label>
                                    </div>
                                    <div className="col col-sm-10">
                                        <textarea name="major" className="form-control" id="major" rows="5" value={this.state.major} onChange={this.handleChange}/>
                                    </div>
                                </div>
                                <hr/>
                                <div className="row">
                                    <div className="col col-sm-2 text-right input-group-sm">
                                        <label htmlFor="achiev" className="col-form-label">{lang[13]}</label>
                                    </div>
                                    <div className="col col-sm-10">
                                        <textarea name="achiev" className="form-control" id="achiev" rows="5" value={this.state.achiev} onChange={this.handleChange}/>
                                    </div>
                                    
                                    {/*<div className="col col-sm-10">
                                        <EmbeddedEditor 
                                            content={this.state.desc}
                                            getContent={this.getEditorContent}/>
                                        </div>*/}
                                </div>
                                <hr/>
                                <div className="row">
                                    <div className="col col-sm-2 text-right input-group-sm">
                                        <label htmlFor="lang" className="col-form-label">{lang[14]}</label>
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
                </div>            
            </div>
        );
    }
}

export default UpdateDoctor;