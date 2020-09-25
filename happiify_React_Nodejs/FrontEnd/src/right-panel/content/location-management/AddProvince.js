import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {Link} from 'react-router-dom';
import LANGUAGE from '../../../service/Language-data';
import apiRoot from '../../../config.api';

class AddProvince extends Component{
    state={
        countries: [],
        name: '',
        post_code: '',
        country_id: 44 
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
        const { name, post_code, country_id } = this.state;
        axios.get(apiRoot + "location/provinces")
            .then((res) => {
                const provinces = res.data.filter(one=>one.pid === country_id);
                const sameName = provinces.find(one=>one.value === name)
                const samePCode = provinces.find(one=>one.zone_code === post_code)
                if(sameName){
                    alert(`The province/state you input has existed! Try another one, please!`);
                }
                else if(samePCode){
                    alert(`The post code you input has existed! Please check it!`);
                }
                else{
                    axios.post(apiRoot + "location/provinces/add", { 
                            name, post_code, country_id
                        })
                        .then(res => {
                            alert("A province was added!");
                            this.setState({
                                name: '',
                                post_code: '',
                                country_id: 44
                            });
                        })
                        .catch(err=>{
                            console.log("[Error] - POST /location/provinces/add - at AddProvince component!");
                            console.log(err);
                    });
                }
            })
            .catch((err) => { 
                console.log("[Error] - GET /location/province - at AddProvince component!");
                console.log(err);            
        });
        e.preventDefault();
    }

    componentDidMount(){
        axios.get(apiRoot + "location/countries/enable")
            .then((res) => {          
                this.setState({ countries: res.data });
            })
            .catch((err) => { 
                console.log("[Error] - GET /location/countries/enable - at AddProvince component!");
                console.log(err);            
        });
    }

    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.AddProvince.cn;
        else lang=LANGUAGE.AddProvince.en;

        const { countries } = this.state;
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
                                <Link to='/location/provinces'>
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
                                <label htmlFor="country_id" className="col-form-label">{lang[5]}</label>
                            </div>
                            <div className="col col-sm-10 input-group-sm">
                                <select name="country_id" className="custom-select mr-sm-2" id="country_id" value={this.state.country_id} onChange={this.handleChange}>
                                    { countries.map((one, index) => <option key={index} value={one.id}>{one.value}</option> ) }
                                </select>
                            </div>
                        </div>
                        <hr/>
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
                                <label htmlFor="post_code" className="col-form-label">{lang[4]}</label>
                            </div>
                            <div className="col col-sm-10 input-group-sm">
                                <input name="post_code" type="text" className="form-control" id="post_code" value={this.state.post_code} onChange={this.handleChange} required/>
                            </div>
                        </div>
                    </div>
                </div>            
            </div>
        );
    }
}

export default AddProvince;