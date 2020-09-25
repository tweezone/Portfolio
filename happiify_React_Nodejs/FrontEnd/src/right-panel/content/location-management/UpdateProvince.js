import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {Link} from 'react-router-dom';
import LANGUAGE from '../../../service/Language-data';
import apiRoot from '../../../config.api';

class UpdateProvince extends Component{
    state={
        countries: [],
        name: '',
        post_code: '',
        country_id: 44 
    }

    static propTypes={
        langState: PropTypes.string.isRequired,
        logInName: PropTypes.string.isRequired,
        provinceId: PropTypes.number.isRequired
    };

    handleChange=(e)=>{
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleClick=(e)=>{
        const { name, post_code, country_id } = this.state;
        const { provinceId } = this.props;
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
                    axios.put(apiRoot + "location/province/" + provinceId, { 
                            name, post_code, country_id
                        })
                        .then(res => {
                            alert("A province was updated!");
                            this.setState({
                                name: '',
                                post_code: '',
                                country_id: 44
                            });
                        })
                        .catch(err=>{
                            console.log("[Error] - PUT /location/provinces/update - at UpdateProvince component!");
                            console.log(err);
                    });
                }
            })
            .catch((err) => { 
                console.log("[Error] - GET /location/province - at UpdateProvince component!");
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
                console.log("[Error] - GET /location/countries - at UpdateProvince component!");
                console.log(err);            
        });
        const { provinceId } = this.props;
        axios.get(apiRoot + "location/province/" + provinceId)
            .then((res) => {
                if(res.data.length === 1){
                    this.setState({ 
                        name: res.data[0].value,
                        post_code: res.data[0].zone_code,
                        country_id: res.data[0].pid 
                    });
                }
            })
            .catch((err) => { 
                console.log("[Error] - GET /location/provinces/:provinceId - at UpdateProvince component!");
                console.log(err);            
        });
    }

    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.UpdateProvince.cn;
        else lang=LANGUAGE.UpdateProvince.en;

        const { countries, name, post_code, country_id } = this.state;
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
                                <select name="country_id" className="custom-select mr-sm-2" id="country_id" value={country_id} onChange={this.handleChange}>
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

export default UpdateProvince;