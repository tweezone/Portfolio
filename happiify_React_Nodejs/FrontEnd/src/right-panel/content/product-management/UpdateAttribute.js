import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {Link} from 'react-router-dom';
import LANGUAGE from '../../../service/Language-data';
import apiRoot from '../../../config.api';

class UpdateAttribute extends Component{
    state={
        objectsList: [],     // Store attribute groups
        langList: [],
        name: '',
        group: '',
        language: '' 
    }

    static propTypes={
        langState: PropTypes.string.isRequired,
        attributeId: PropTypes.number.isRequired
    };

    handleChange=(e)=>{
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleClick=(e)=>{
        const id = this.props.attributeId;
        const { name, group, language } = this.state;
        axios.get(apiRoot + "products/attributes")
            .then((res) => {
                const one = res.data.find(one=>one.products_options_values_name === name);
                const previous_name = res.data.find(one=>one.products_options_values_to_products_options_id === id).products_options_values_name;
                const previous_language = res.data.find(one=>one.products_options_values_to_products_options_id === id).languages_name;
                const previous_group = res.data.find(one=>one.products_options_values_to_products_options_id === id).products_options_name;
                if(name === previous_name && language === previous_language && group === previous_group){
                    alert(`Nothing changed! You may choose quit or make some changes!`);
                }
                else if(name !== previous_name && one !== undefined){
                    alert(`The attribute you input has existed! Try another one, please!`);
                }
                else{
                    axios.put(apiRoot + "products/attributes/update", {
                            id, name, group, language
                        })
                        .then(res => {
                            alert("An attribute was updated!");
                            this.setState({
                                name: '',
                                group: '',
                                language: ''
                            });
                        })
                        .catch(err=>{
                            console.log("[Error] - PUT /products/attributes/update - at UpdateAttribute component!");
                            console.log(err);
                    });
                    e.preventDefault();
                }
            })
            .catch((err) => { 
                console.log("[Error] - GET /products/attributes - at UpdateAttribute component!");
                console.log(err);            
        });
    }

    componentDidMount(){
        const { attributeId } = this.props;
        axios.get(apiRoot + "products/attributes")
            .then((res) => {
                const currentOne = res.data.find((one)=> one.products_options_values_to_products_options_id === +attributeId)
                this.setState({ 
                    name:       currentOne.products_options_values_name,
                    group:      currentOne.products_options_name,
                    language:   currentOne.languages_name
                });
            })
            .catch((err) => { 
                console.log("[Error] - GET /products/attributes - at UpdateAttribute component!");
                console.log(err);            
        });
        axios.get(apiRoot + "products/attribute_groups")
            .then((res) => {          
                this.setState({ 
                    objectsList: res.data
                });
            })
            .catch((err) => {
                console.log("[Error] - GET /products/attribute_groups - at UpdateAttribute component!");
                console.log(err);           
            });
        axios.get(apiRoot + "languages")
            .then((res) => {          
                this.setState({ 
                    langList: res.data
                });
            })
            .catch((err) => {
                console.log("[Error] - GET /languages - at UpdateAttribute component!");
                console.log(err);            
            });
    }

    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.UpdateAttribute.cn;
        else lang=LANGUAGE.UpdateAttribute.en;

        const {objectsList, langList} = this.state;
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
                                <Link to='/products/attributes'>
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
                                <label htmlFor="group" className="col-form-label">{lang[4]}</label>
                            </div>
                            <div className="col col-sm-10 input-group-sm">
                                <select name="group" className="custom-select mr-sm-2" id="group" value={this.state.group} onChange={this.handleChange}>
                                    {objectsList.map((one, index) => <option key={index} value={one.products_options_name}>{one.products_options_name}</option> )}
                                </select>
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

export default UpdateAttribute;