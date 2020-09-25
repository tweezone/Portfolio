import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Cascader } from 'antd';
import apiRoot from '../../config.api';

import { objDeepCopy } from '../func-service';

class SelectLocation extends Component{
    state={
        countries: [],
        provinces: [],
        cities: [],
        value: []
    }

    static ptopTypes = {
        cityId: PropTypes.number.isRequired,
        getCityId: PropTypes.func.isRequired
    }

    getOptions=(countries, provinces, cities)=>{
        let t_coun = objDeepCopy(countries);
        let t_prov = objDeepCopy(provinces);
        let t_citi = objDeepCopy(cities);
        t_prov.forEach(p=>{
            let children=[];
            t_citi.forEach(c=>{
                if(c.pid === p.id){
                    children.push(c)
                }
            });
            if(children.length !== 0){
                p.children = children;
            }
        });

        t_coun.forEach(c=>{
            let children=[];
            t_prov.forEach(p=>{
                if(p.pid === c.id){
                    children.push(p)
                }
            });
            if(children.length !== 0){
                c.children = children;
            }
        });
        return t_coun;
    }

    initValue=(cityId, countries, provinces, cities)=>{
        let value=[];
        const city = cities.find(one=>one.id === cityId);
        if(city){
            value.push(city.value);
            const province = provinces.find(one=>one.id === city.pid);
            if(province){
                value.push(province.value);
                const country = countries.find(one=>one.id === province.pid);
                if(country){
                    value.push(country.value);
                }
            }
        }
        if(value.length === 3){
            return value.reverse();
        }
        else{
            return [];
        }
    }

    onChange=(value, selectedOptions)=>{
        let city_id = 0
        if(selectedOptions.length === 3){
            city_id = selectedOptions[2].id;
        }
        this.setState({ value });
        this.props.getCityId(city_id);
    }
    
    filter=(inputValue, path)=>{
        return (path.some(option => (option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1 ));
    }

    componentDidMount(){
        axios.get(apiRoot + "location/countries/enable")
            .then((res) => {            
                this.setState({ countries: res.data });
            })
            .catch((err) => { 
                console.log("[Error] - GET /location/countries - at SelectLocation component!");
                console.log(err);            
        });
        axios.get(apiRoot + "location/provinces")
            .then((res) => {            
                this.setState({ provinces: res.data });
            })
            .catch((err) => { 
                console.log("[Error] - GET /location/provinces - at SelectLocation component!");
                console.log(err);            
        });
        axios.get(apiRoot + "location/cities")
            .then((res) => {            
                this.setState({ cities: res.data });
            })
            .catch((err) => { 
                console.log("[Error] - GET /location/cities - at SelectLocation component!");
                console.log(err);            
        });
    }

    componentDidUpdate(prevProps){
        const { cityId } = this.props;
        const { countries, provinces, cities } = this.state;
        if(cityId !== prevProps.cityId){
            if(cityId === 0){
                this.setState({ value: [] });
            }
            if(prevProps.cityId === 0){
                const value = this.initValue(cityId, countries, provinces, cities)
                this.setState({ value });
            }
        }
    }
    
    render(){
        const { countries, provinces, cities } = this.state;
        return(
            <Cascader
                size="large"
                value={this.state.value}
                allowClear
                options={this.getOptions(countries, provinces, cities)}
                onChange={this.onChange}
                placeholder="Please select"
                showSearch={ this.filter }
                style={{width: '100%'}}
            />
        )
    }
}

export default SelectLocation;


