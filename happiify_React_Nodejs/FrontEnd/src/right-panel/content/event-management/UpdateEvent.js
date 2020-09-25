import React, { Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

import LANGUAGE from '../../../service/Language-data';
import apiRoot from '../../../config.api';
import EmbeddedEditor from '../../../service/components/EmbeddedEditor';
import SelectLocation from '../../../service/components/SelectLocation';
import { isP0_number, isP0_integer } from '../../../service/validation';
import { getUTCTimeString } from '../../../service/func-service';

class UpdateEvent extends Component{
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
    
    static propTypes={
        langState: PropTypes.string.isRequired,
        eventId: PropTypes.number.isRequired,
        logInName: PropTypes.string.isRequired
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
        const { eventId, logInName } = this.props;
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
            formData.append('id', eventId);
            formData.append('username', logInName);
            formData.append('title', title);
            formData.append('image', image);

            const image_update = document.getElementById('event_image_update');
            formData.append('image_update', image_update.files[0]);

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

            axios.put(apiRoot + "events/update", formData, {
                    headers:{'Content-Type':'multipart/form-data'}
                })
                .then(res => {
                    alert("One event was updated!");
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
                    console.log("[Error] - GET /events/update - at UpdteEvent component!");
                    console.log(err);
            });
        }
        e.preventDefault();
    }

    componentDidMount(){
        const { eventId } = this.props;
        axios.get(apiRoot + "event/" + eventId)
            .then((res) => {
                const currentOne = res.data[0];
                axios.get(apiRoot + "currencies")
                    .then((res) => {
                        const allCurrencies = res.data;
                        axios.get(apiRoot + "events/categories")
                            .then((res) => {
                                const allTypes = res.data;
                                const start = currentOne.start_date.includes('1970')? '': getUTCTimeString(currentOne.start_date).replace('Z', '');
                                const end = currentOne.end_date.includes('1970')? '': getUTCTimeString(currentOne.end_date).replace('Z', '');
                                this.setState({ 
                                    allCurrencies,
                                    allTypes,
                                    title:          currentOne.events_title,
                                    type_id:        currentOne.events_type,
                                    costs:          currentOne.events_costs,
                                    currency_id:    currentOne.currencies_id,
                                    start,
                                    end,
                                    image:          currentOne.cover_image,
                                    limit:          currentOne.member_limit,
                                    location:       currentOne.events_location,
                                    content:        currentOne.events_description,
                                    city_id:        currentOne.city_id
                                });
                            })
                            .catch((err) => { 
                                console.log("[Error] - GET /events/categories - at UpdteEvent component!");
                                console.log(err);            
                        });
                    })
                    .catch((err) => { 
                        console.log("[Error] - GET /currencies - at UpdteEvent component!");
                        console.log(err);           
                });
            })
            .catch((err) => { 
                console.log("[Error] - GET /events - at UpdteEvent component!");
                console.log(err);          
        });
    }

    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.UpdateEvent.cn;
        else lang=LANGUAGE.UpdateEvent.en;
        
        const { allTypes, allCurrencies } = this.state;

        return(
            <div className="container">
                <div className="card rounded">
                    <div className="card-header"> 
                        <h5>{lang[0]}</h5>
                    </div>
                    <br/>
                    <div className="card-body">
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-row">          
                                <div className="form-group col-md-4">
                                    <label htmlFor="title">{lang[1]}</label>
                                    <input name="title" type="text" className="form-control" id="title" value={this.state.title}  onChange={this.handleChange} required/>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="event_image_update">{lang[2]}</label>
                                    <input name="image" type="file" className="form-control" id="event_image_update"  onChange={this.handleChange}/>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="type">{lang[3]}</label>
                                    <select name="type" className="custom-select mr-sm-2" id="type" value={this.state.type} onChange={this.handleChange} required>
                                        {allTypes.map((one, index) => <option key={index} value={one.categories_id}>{one.name}</option> )}
                                    </select>
                                </div>
                            </div>
                            <div className="form-row">          
                            <div className="form-group col-md-4">
                                    <label htmlFor="costs">{lang[4]}</label>
                                    <input name="costs" type="text" className="form-control" id="costs" value={this.state.costs} onChange={this.handleChange}/>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="currency">{lang[5]}</label>
                                    <select name="currency" className="custom-select mr-sm-2" id="currency" value={this.state.currency} onChange={this.handleChange}>
                                            {allCurrencies.map((one, index) => <option key={index} value={one.currencies_id}>{one.name}</option> )}
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="limit">{lang[6]}</label>
                                    <input name="limit" type="text" className="form-control" id="limit" value={this.state.limit} onChange={this.handleChange}/>
                                </div>
                            </div>
                            <div className="form-row">          
                                <div className="form-group col-md-6">
                                    <label htmlFor="start">{lang[7]}</label>
                                    <input name="start" type="datetime-local" className="form-control" id="start" value={this.state.start}  onChange={this.handleChange} title="Format:2018-08-18 18:18:18.000"/>
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="end">{lang[8]}</label>
                                    <input name="end" type="datetime-local" className="form-control" id="end" value={this.state.end} onChange={this.handleChange} title="Format:2018-08-18 18:18:18.000"/>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label htmlFor="location">{lang[9]}</label>
                                    <input name="location" type="text" className="form-control" id="location" value={this.state.location} onChange={this.handleChange} required/>
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="city">{lang[10]}</label>
                                    <SelectLocation
                                        cityId={this.state.city_id}
                                        getCityId={this.getCityId}
                                    />
                                </div>
                            </div>   
                            <div className="form-group">
                                <label>{lang[11]}</label>
                                <EmbeddedEditor 
                                    content={this.state.content}
                                    getContent={this.getEditorContent}/>
                            </div>
                            <div className="btn-group">
                                <button type="submit" className="btn btn-success btn-sm mr-2 rounded" title={lang[12]}><i className="fas fa-save"></i></button>
                                <Link to="/events" className="btn btn-primary btn-sm rounded" title={lang[13]}><i className="fas fa-arrow-alt-circle-right"></i></Link>
                            </div>    
                        </form>
                    </div>
                </div>
            </div>
        );        
    }
}

export default UpdateEvent;