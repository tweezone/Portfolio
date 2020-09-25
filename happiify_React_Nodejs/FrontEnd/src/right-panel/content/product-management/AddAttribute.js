import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {Link} from 'react-router-dom';
import LANGUAGE from '../../../service/Language-data';
import apiRoot from '../../../config.api';

class AddAttribute extends Component{
    state={
        objectsList: [],     // Store attribute groups
        langList: [],
        name: '',
        group: '',
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
        const { objectsList, name, group, language } = this.state;
        const { langState } = this.props;
        axios.get(apiRoot + "products/attributes")
            .then((res) => {          
                const one = res.data.find(one=>one.products_options_values_name === name);
                if(one !== undefined){
                    alert(`The attribute you input has existed! Try another one, please!`);
                }
                else{
                    axios.post(apiRoot + "products/attributes/add", { 
                            name, group, language
                        })
                        .then(res => {
                            alert("An attribute was added!");
                            const language = langState==='cn'? '简体中文':'English';
                            this.setState({
                                name: '',
                                group: objectsList[0].products_options_name,
                                language: language
                            });
                        })
                        .catch(err=>{
                            console.log("[Error] - POST /products/attributes/add - at AddAttributes component!");
                            console.log(err);
                    });
                    e.preventDefault();
                }
            })
            .catch((err) => { 
                console.log("[Error] - GET /products/attributes - at AddAttributes component!");
                console.log(err);            
        });
    }

    componentDidMount(){
        axios.get(apiRoot + "products/attribute_groups")
            .then((res) => {          
                this.setState({ 
                    objectsList: res.data,
                    group: res.data[0].products_options_name
                });
            })
            .catch((err) => { 
                console.log("[Error] - GET /products/attribute_groups - at AddAttributes component!");
                console.log(err);            
        });
        const language = this.props.langState==='cn'? '简体中文':'English';
        axios.get(apiRoot + "languages")
            .then((res) => {          
                this.setState({ 
                    langList: res.data,
                    language: language
                });
            })
            .catch((err) => {            
                console.log("[Error] - GET /languages - at AddAttributes component!");
                console.log(err);            
        });
    }

    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.AddAttribute.cn;
        else lang=LANGUAGE.AddAttribute.en;

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

export default AddAttribute;