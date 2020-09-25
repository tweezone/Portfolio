import React, { Component } from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

import LANGUAGE from '../../../service/Language-data';
import apiRoot from '../../../config.api';
import EmbeddedEditor from '../../../service/components/EmbeddedEditor';
import SelectLocation from '../../../service/components/SelectLocation';
import { isP0_number, isP0_integer } from '../../../service/validation';

class AddEvent extends Component{
    state={
            allTypes: [],
            allCurrencies: [],
            title: '',
            image: '',
            type_id: 1,
            costs: '',
            currency_id: 1,
            limit: '',
            start: '',
            end: '',
            location: '',
            city_id: 0,
            content: ''
        }

    handleChange=(e)=>{
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    getCityId=(id)=>{
        this.setState({ city_id: id});
    }

    getEditorContent=(content)=>{
        this.setState({ content });
    }

    handleSubmit=(e)=>{
        const { title, image, type_id, costs, currency_id, limit, start, end, location, city_id, content } = this.state;
        const { logInName } = this.props;
        if(city_id === 0){
            alert(`You must select a city. Try again, please.`);
        }
        else if(!isP0_number.test(+costs)){
            alert(`Please enter a positive number or zero or nothing in the "Cost" option.`);
        }
        else if(!isP0_integer.test(+limit)){
            alert(`Please enter a positive integer or zero or nothing in the "Max members" option.`);
        }
        else{
            const formData = new FormData();
            formData.append('user', logInName);
            formData.append('title', title);
            formData.append('image', image);

            const image_add = document.getElementById('event_image_add');
            formData.append('image_add', image_add.files[0]);

            formData.append('type', type_id);
            //If there is not cost, set the value into '0'.
            this.state.costs===''? formData.append('costs', '0'):formData.append('costs', costs);
            formData.append('currency', currency_id);
            //If there is not limit, set the value into '0'.
            this.state.limit===''? formData.append('limit', '0'):formData.append('limit', limit);
            //If there is not date & time input, set the value with a standard value.
            this.state.start===''? formData.append('start', '1970-01-01'):formData.append('start', start); 
            this.state.end===''? formData.append('end', '1970-01-01'):formData.append('end', end);        
            formData.append('location', location);
            formData.append('city', city_id);
            formData.append('content', content);

            axios.post(apiRoot + "events/add", formData, {
                    headers:{'Content-Type':'multipart/form-data'}
                })
                .then(res => {
                    alert("One event was added!");
                    this.setState({
                        title: '',
                        image: '',
                        type_id: 1,
                        costs: '',
                        currency: 1,
                        limit: '',
                        start: '',
                        end: '',
                        location: '',
                        city_id: 0,
                        content: ''
                    });
                })
                .catch(err=>{ 
                    console.log("[Error] - GET /events/add - at AddEvent component!");
                    console.log(err);  
            });
        }
        e.preventDefault();
    }

    handleClickReset=()=>{
        this.setState({
            title: '',
            image: '',
            type_id: 1,
            costs: '',
            currency: 1,
            limit: '',
            start: '',
            end: '',
            location: '',
            city: 0,
            content: ''
        });
    }

    componentDidMount(){
        axios.get(apiRoot + "events/categories")
            .then((res) => {            
                this.setState({ allTypes: res.data });
            })
            .catch((err) => { 
                console.log("[Error] - GET /events/categories - at AddEvent component!");
                console.log(err);           
        });
        axios.get(apiRoot + "currencies")
            .then((res) => {            
                this.setState({ allCurrencies: res.data });
            })
            .catch((err) => {  
                console.log("[Error] - GET /currencies - at AddEvent component!");
                console.log(err);           
        });
    }

    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.AddEvent.cn;
        else lang=LANGUAGE.AddEvent.en;

        const { allTypes, allCurrencies } = this.state;

        return(
            <div className="container">
                <div className="card rounded">
                    <div className="card-header"> 
                        <h5>{lang[0]}</h5>
                    </div>
                    <div className="card-body">
                        <div className="text-right">
                            <Link to="/events" className="btn btn-primary btn-sm rounded" title={lang[1]}><i className="fas fa-arrow-alt-circle-right"></i></Link>
                            <br/>
                        </div>
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-row">          
                                <div className="form-group col-md-4">
                                    <label htmlFor="title">{lang[2]}</label>
                                    <input name="title" type="text" className="form-control" id="title" value={this.state.title}  onChange={this.handleChange} required/>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="event_image_add">{lang[3]}</label>
                                    <input name="image" type="file" className="form-control" id="event_image_add" value={this.state.image} onChange={this.handleChange} required/>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="type">{lang[4]}</label>
                                    <select name="type" className="custom-select mr-sm-2" id="type" value={this.state.type} onChange={this.handleChange} required>
                                        {allTypes.map((one, index) => <option key={index} value={one.categories_id}>{one.name}</option> )}
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-4">
                                    <label htmlFor="costs">{lang[5]}</label>
                                    <input name="costs" type="text" className="form-control" id="costs" value={this.state.costs} onChange={this.handleChange}/>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="currency">{lang[6]}</label>
                                    <select name="currency" className="custom-select mr-sm-2" id="currency" value={this.state.currency} onChange={this.handleChange}>
                                        {allCurrencies.map((one, index) => <option key={index} value={one.currencies_id}>{one.name}</option> )}
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="limit">{lang[7]}</label>
                                    <input name="limit" type="text" className="form-control" id="limit" value={this.state.limit} onChange={this.handleChange}/>
                                </div>
                            </div>
                            <div className="form-row">          
                                <div className="form-group col-md-6">
                                    <label htmlFor="start">{lang[8]}</label>
                                    <input name="start" type="datetime-local" className="form-control" id="start" value={this.state.start}  onChange={this.handleChange} title="Format:2018-08-18 18:18:18.000"/>
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="end">{lang[9]}</label>
                                    <input name="end" type="datetime-local" className="form-control" id="end" value={this.state.end} onChange={this.handleChange} title="Format:2018-08-18 18:18:18.000"/>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label htmlFor="location">{lang[10]}</label>
                                    <input name="location" type="text" className="form-control" id="location" value={this.state.location} onChange={this.handleChange} required/>
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="city">{lang[11]}</label>
                                    <SelectLocation
                                        cityId={this.state.city_id}
                                        getCityId={this.getCityId}
                                    />
                                </div>
                            </div>   
                            <div className="form-group">
                                    <label>{lang[12]}</label>
                                    <EmbeddedEditor 
                                    content={this.state.content}
                                    getContent={this.getEditorContent}/>
                            </div>
                            <div className="btn-group">
                                <button type="submit" className="btn btn-success btn-sm mr-2 rounded" title={lang[13]}><i className="fas fa-save"></i></button>
                                <button type="reset" className="btn btn-danger btn-sm rounded" title={lang[14]} onClick={this.handleClickReset}><i className="fas fa-undo-alt"></i></button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );        
    }
}

export default AddEvent;