import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {Link} from 'react-router-dom';
import LANGUAGE from '../../../service/Language-data';
import apiRoot from '../../../config.api';

import EmbeddedEditor from '../../../service/components/EmbeddedEditor';
import SelectLocation from '../../../service/components/SelectLocation';

class UpdateDoctor extends Component{
    state={
        allCategories: [],
        allUsers: [],
        langList: [],
        language: '',
        quizCategoryId: 0,
        user_name: '',
        real_name: '',
        city_id: 0,
        title: '',
        category: '',
        desc: ''
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

    getCityId=(id)=>{
        this.setState({ city_id: id});
    }

    getEditorContent=(content)=>{
        this.setState({ desc: content });
    }

    handleClick=(e)=>{
        const { language, quizCategoryId, user_name, real_name, title, desc, category, city_id, allUsers, allCategories} = this.state;
        const { doctorId } = this.props;
        const one = allUsers.find(one=>one.username === user_name);
        if(one === undefined){
            alert(`The username you input dose NOT exist! Try again, please!`)
        }
        else{
            axios.put(apiRoot + "health/doctors/update", { doctorId, language, quizCategoryId, user_name, real_name, title, desc, category, city_id })
            .then(res => {
                alert("A doctor was updated!");
                this.setState({
                    user_name: '',
                    real_name: '',
                    city_id: 0,
                    title: '',
                    category: allCategories[0].name,
                    desc: ''
                });
            })
            .catch(err=>{ 
                console.log("[Error] - GET /health/doctors/update - at UpdateDoctor component!");
                console.log(err);
            });
            e.preventDefault();
        }
    }

    componentDidMount(){
        const { doctorId } = this.props;
        axios.get(apiRoot + "health/doctors")
            .then((res) => {
                const currentOne = res.data.find(one=> one.id === +doctorId);
                this.setState({ 
                    language: currentOne.languages_name,
                    quizCategoryId: currentOne.quiz_categories_id,
                    user_name: currentOne.username,
                    real_name: currentOne.name,
                    city_id: currentOne.city_id,
                    title: currentOne.title,
                    category: currentOne.categories_name,
                    desc: currentOne.descriptions
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

        axios.get(apiRoot + "users")
            .then((res) => { 
                this.setState({ allUsers: res.data });
            })
            .catch((err) => { 
                console.log("[Error] - GET /users - at UpdateDoctor component!");
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

        const { allCategories, langList } = this.state;
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
                                        <input name="user_name" type="text" className="form-control" id="user_name" value={this.state.user_name} onChange={this.handleChange}/>
                                    </div>
                                </div>
                                <hr/>
                                <div className="row">
                                    <div className="col col-sm-2 text-right input-group-sm">
                                        <label htmlFor="real_name" className="col-form-label">{lang[5]}</label>
                                    </div>
                                    <div className="col col-sm-10 input-group-sm">
                                        <input name="real_name" type="text" className="form-control" id="real_name" value={this.state.real_name} onChange={this.handleChange}/>
                                    </div>
                                </div>
                                <hr/>
                                <div className="row">
                                    <div className="col col-sm-2 text-right input-group-sm">
                                        <label htmlFor="city" className="col-form-label">{lang[6]}</label>
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
                                        <label htmlFor="title" className="col-form-label">{lang[7]}</label>
                                    </div>
                                    <div className="col col-sm-10 input-group-sm">
                                        <input name="title" type="text" className="form-control" id="title" value={this.state.title} onChange={this.handleChange}/>
                                    </div>
                                </div>
                                <hr/>
                                <div className="row">
                                    <div className="col col-sm-2 text-right input-group-sm">
                                        <label htmlFor="category" className="col-form-label">{lang[8]}</label>
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
                                        <label htmlFor="lang" className="col-form-label">{lang[9]}</label>
                                    </div>
                                    <div className="col col-sm-10 input-group-sm">
                                        <select name="language" className="custom-select mr-sm-2" id="lang" value={this.state.language} onChange={this.handleChange}>
                                            {langList.map((one, index) => <option key={index} value={one.name}>{one.name}</option> )}
                                        </select>
                                    </div>
                                </div>
                                <hr/>
                                <div className="row">
                                    <div className="col col-sm-2 text-right input-group-sm">
                                        <label className="col-form-label">{lang[10]}</label>
                                    </div>
                                    <div className="col col-sm-10">
                                        <EmbeddedEditor 
                                            content={this.state.desc}
                                            getContent={this.getEditorContent}/>
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