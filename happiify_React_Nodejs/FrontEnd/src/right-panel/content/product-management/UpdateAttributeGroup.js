import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {Link} from 'react-router-dom';
import LANGUAGE from '../../../service/Language-data';
import apiRoot from '../../../config.api';

class UpdateAttributeGroup extends Component{
    state={
        langList: [],
        name: '',
        language: '' 
    }

    static propTypes={
        langState: PropTypes.string.isRequired,
        attributeGroupId: PropTypes.number.isRequired
    };

    handleChange=(e)=>{
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleClick=(e)=>{
        const id = this.props.attributeGroupId;
        const { langList, name, language } = this.state;
        axios.get(apiRoot + "products/attribute_groups")
            .then((res) => {
                const one = res.data.find(one=>one.products_options_name === name);
                const previous = res.data.find((one)=> one.products_options_id === +id);
                if(previous.products_options_name === name && previous.languages_name === language){
                    alert(`Nothing changed! You may choose quit or make some changes!`);
                }
                else if(previous.products_options_name !== name && one !== undefined){
                    alert(`The attribute group you input has existed! Try another one, please!`);
                }
                else{
                    axios.put(apiRoot + "products/attribute_groups/update", {
                            id, name, language
                        })
                        .then(res => {
                            alert("An attribute group was updated!");
                            this.setState({
                                name: '',
                                language: langList[0].name
                            });                
                        })
                        .catch(err=>{
                            console.log("[Error] - PUT /products/attribute_groups/update - at UpdateAttributeGroup component!");
                            console.log(err);
                    });
                    e.preventDefault();
                }
            })
            .catch((err) => {
                console.log("[Error] - GET /products/attribute_groups - at UpdateAttributeGroup component!");
                console.log(err);          
        });
    }

    componentDidMount(){
        const { attributeGroupId } = this.props;
        axios.get(apiRoot + "products/attribute_groups")
            .then((res) => {
                const currentOne = res.data.find((one)=> one.products_options_id === +attributeGroupId)   
                this.setState({ 
                    name:       currentOne.products_options_name,
                    language:   currentOne.languages_name
                });
            })
            .catch((err) => {
                console.log("[Error] - GET /products/attribute_groups - at UpdateAttributeGroup component!");
                console.log(err);          
        });
        axios.get(apiRoot + "languages")
            .then((res) => {          
                this.setState({ 
                    langList: res.data
                });
            })
            .catch((err) => {
                console.log("[Error] - GET /languages - at UpdateAttributeGroup component!");
                console.log(err);           
        });
    }

    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.UpdateAttributeGroup.cn;
        else lang=LANGUAGE.UpdateAttributeGroup.en;

        const { langList, name, language } = this.state;
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
                                <Link to='/products/attribute_groups'>
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
                                <input name="name" type="text" className="form-control" id="name" value={name} onChange={this.handleChange} required/>
                            </div>
                        </div>
                        <hr/>
                        <div className="row">
                            <div className="col col-sm-2 text-right input-group-sm">
                                <label htmlFor="lang" className="col-form-label">{lang[4]}</label>
                            </div>
                            <div className="col col-sm-10 input-group-sm">
                                <select name="language" className="custom-select mr-sm-2" id="lang" value={language} onChange={this.handleChange}>
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

export default UpdateAttributeGroup;