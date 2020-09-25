import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {Link} from 'react-router-dom';
import LANGUAGE from '../../../service/Language-data';
import apiRoot from '../../../config.api';

class UpdateCity extends Component{
    state={
        countries: [],
        provinces: [],
        currentProvinces: [],
        name: '',
        post_code: '',
        province_id: 0,
        country_id: 44 
    }

    static propTypes={
        langState: PropTypes.string.isRequired,
        logInName: PropTypes.string.isRequired,
        cityId: PropTypes.number.isRequired,
    };

    handleChange=(e)=>{
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleCountryChange=(e)=>{
        const currentProvinces = this.state.provinces.filter(one=>one.pid === +e.target.value);
        this.setState({ 
            country_id: e.target.value,
            currentProvinces,
            province_id: currentProvinces[0].id 
        });
    }

    handleClick=(e)=>{
        const { cityId } = this.props;
        const { name, post_code, province_id } = this.state;
        
        axios.get(apiRoot + "location/cities")
            .then((res) => {
                const cities = res.data.filter(one=>one.pid === province_id);
                const sameName = cities.find(one=>one.value === name)
                const samePCode = cities.find(one=>one.code === post_code)
                if(sameName){
                    alert(`The city you input has existed! Try another one, please!`);
                }
                else if(samePCode){
                    alert(`The post code you input has existed! Please check it!`);
                }
                else{
                    axios.put(apiRoot + "location/city/" + cityId, { 
                            name, post_code, province_id
                        })
                        .then(res => {
                            alert("A city was updated!");
                            const country_id = 44;
                            const currentProvinces = this.state.provinces.filter(one=>one.pid === country_id);
                            const province_id = currentProvinces[0].id;
                            this.setState({
                                name: '',
                                post_code: '',
                                province_id,
                                country_id,
                                currentProvinces
                            });
                        })
                        .catch(err=>{
                            console.log("[Error] - PUT /location/cities/:cityId - at UpdateCity component!");
                            console.log(err);
                    });
                }
            })
            .catch((err) => { 
                console.log("[Error] - GET /location/province - at UpdateCity component!");
                console.log(err);            
        });
        e.preventDefault();
    }

    componentDidMount(){
        const { cityId } = this.props;
        axios.get(apiRoot + "location/countries/enable")
            .then((res) => {
                const countries = res.data;
                axios.get(apiRoot + "location/provinces")
                    .then((res) => {
                        const provinces = res.data;
                        axios.get(apiRoot + "location/city/" + cityId)
                            .then((res) => {
                                const country_id = provinces.find(one=>one.id === res.data[0].pid).pid
                                const currentProvinces = provinces.filter(one=>one.pid === country_id);
                                if(res.data.length === 1){
                                    this.setState({
                                        countries, 
                                        provinces, 
                                        currentProvinces, 
                                        name: res.data[0].value,
                                        post_code: res.data[0].code,
                                        province_id: res.data[0].pid,
                                        country_id 
                                    });
                                }
                            })
                            .catch((err) => { 
                                console.log("[Error] - GET /location/cities/:cityId - at UpdateCity component!");
                                console.log(err);            
                        });
                    })
                    .catch((err) => { 
                        console.log("[Error] - GET /location/provinces - at UpdateCity component!");
                        console.log(err);            
                });
            })
            .catch((err) => { 
                console.log("[Error] - GET /location/countries/enable - at UpdateCity component!");
                console.log(err);            
        });
    }

    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.UpdateCity.cn;
        else lang=LANGUAGE.UpdateCity.en;

        const { countries, currentProvinces, country_id, province_id, name, post_code } = this.state;

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
                                <Link to='/location/cities'>
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
                                <label htmlFor="country_id" className="col-form-label">{lang[6]}</label>
                            </div>
                            <div className="col col-sm-10 input-group-sm">
                                <select name="country_id" className="custom-select mr-sm-2" id="country_id" value={country_id} onChange={this.handleCountryChange}>
                                    { countries.map((one, index) => <option key={index} value={one.id}>{one.value}</option> ) }
                                </select>
                            </div>
                        </div>
                        <hr/>
                        <div className="row">
                            <div className="col col-sm-2 text-right input-group-sm">
                                <label htmlFor="province_id" className="col-form-label">{lang[5]}</label>
                            </div>
                            <div className="col col-sm-10 input-group-sm">
                                <select name="province_id" className="custom-select mr-sm-2" id="province_id" value={province_id} onChange={this.handleChange}>
                                    { currentProvinces.map((one, index) => <option key={index} value={one.id}>{one.value}</option> ) }
                                </select>
                            </div>
                        </div>
                        <hr/>
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
                                <label htmlFor="post_code" className="col-form-label">{lang[4]}</label>
                            </div>
                            <div className="col col-sm-10 input-group-sm">
                                <input name="post_code" type="text" className="form-control" id="post_code" value={post_code} onChange={this.handleChange} required/>
                            </div>
                        </div>
                    </div>
                </div>            
            </div>
        );
    }
}

export default UpdateCity;