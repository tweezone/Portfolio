import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {Link} from 'react-router-dom';

import LANGUAGE from '../../../service/Language-data';
import { object_array_compare, propArray } from '../../../service/func-service';
import apiRoot from '../../../config.api';
import { isP0_number, isP0_integer } from '../../../service/validation';
import MultiSelectTree from '../../../service/components/MultiSelectTree_antd';

class AddProduct extends Component{
    constructor(props){
        super(props);
        this.state={
            model:'',
            price: 0,
            taxClass_id: 0,
            taxClassList: [],
            currency_id: 1,
            currencyList: [],
            quantity: 0,
            weight: 0,
            manufacturer_id: 0,
            manufacturerList: [],
            brand_id: 0,
            brandList: [],
            date: '',
            status: 1,
            ordered: 0,
            images: '',
            uploadImages: [],
            imageUrls: [],
            name: '',
            desc: '',
            url: '',
            lang_id: 1,
            langList: [],
            categoryList: [],
            category: [],
            attributeDetail: [],
            attributeList: [],
            attribute: [],
            price_prefix: []
        }
    }    

    static propTypes={
        langState: PropTypes.string.isRequired,
        logInName: PropTypes.string.isRequired
    };

    handleChange=(e)=>{
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    uploadImages=(e)=>{
        let { uploadImages, imageUrls } = this.state;
        for(let i=0; i<e.target.files.length; i++){
            uploadImages.push(e.target.files[i]);
            imageUrls.push(window.URL.createObjectURL(e.target.files[i]));
        }
        this.setState({ uploadImages, imageUrls });
    }

    deleteOneImage=(index)=>{
        let { uploadImages, imageUrls } = this.state;
        uploadImages.splice(index,1);
        imageUrls.splice(index,1);
        this.setState({ uploadImages, imageUrls });
    }

    getCategoryValue=(value)=>{
        const category = value.filter(one=> +one>0)
        this.setState({ category });
    }

    getAttributeValue=(value)=>{
        // NOTE: only attributes can be include, parents-attribute group cannot.
        const attribute = value.filter(one=> +one>0)
        /*
        * Refresh "this.state.price_prefix". Add new element and initialize it, or delete the element which was just 
        * deleted from "this.state.attribute"
        */
        let { price_prefix, attributeList } = this.state;
        const ids = propArray(price_prefix, 'id');
        attribute.forEach(one=>{
            if(!ids.includes(one)){
                const getOne=attributeList.filter(a=>a.p !== 0).find(a=>a.id === one)
                let item = { id:getOne.id, p:getOne.p, ov:getOne.ov, value:0, pre:'+'};
                price_prefix.push(item);
            }
        })
        const refresh = price_prefix.filter(one=>attribute.includes(one.id));
        this.setState({ 
            attribute,
            price_prefix: refresh
         });
    }

    handlePrefix=(id, e)=>{
        const { price_prefix } = this.state;
        const ids = propArray(price_prefix, 'id');
        const index = ids.indexOf(id);
        price_prefix[index].pre = e.target.value;
        this.setState({ price_prefix })
    }

    handleVariation=(id, e)=>{
        const { price_prefix } = this.state;
        const ids = propArray(price_prefix, 'id');
        const index = ids.indexOf(id);
        price_prefix[index].value = e.target.value;
        this.setState({ price_prefix })
    }

    handleClickSave=(e)=>{
        const { model, price, taxClass_id, currency_id, quantity, weight, manufacturer_id, brand_id, date, status, 
                ordered, images, uploadImages, name, desc, url, lang_id, category, price_prefix } = this.state;
        const { logInName } = this.props;
        if(!isP0_number.test(+price)){
            alert(`The price must be a positive number or 0. Try again, please.`);
        }
        else if(!isP0_integer.test(+quantity)){
            alert(`The quantity must be a positive integer or 0. Try again, please.`);
        }
        else if(!isP0_number.test(+weight)){
            alert(`The weight must be a positive number or 0. Try again, please.`);
        }
        else if(!isP0_integer.test(+ordered)){
            alert(`The order number must be a positive integer or 0. Try again, please.`);
        }
        else if(name === ''){
            alert(`The product name cannot be empty. Try again, please.`);
        }
        else{
            const formData = new FormData();
            formData.append('model', model)
            formData.append('price', price)
            formData.append('taxClass_id', taxClass_id)
            formData.append('currency_id', currency_id)
            formData.append('quantity', quantity)
            formData.append('weight', weight)
            formData.append('manufacturer_id', manufacturer_id)
            formData.append('brand_id', brand_id)
            formData.append('status', status)
            formData.append('ordered', ordered)
            formData.append('images', images)
            formData.append('name', name)
            formData.append('desc', desc)
            formData.append('url', url)
            formData.append('lang_id', lang_id)
            formData.append('category', JSON.stringify(category))
            formData.append('price_prefix', JSON.stringify(price_prefix))
            formData.append('user', logInName);
            //If there is not date & time input, set the value with a standard value.
            date===''? formData.append('date', '1900-01-01'):formData.append('date', date); 
            
            uploadImages.forEach(one=> formData.append('uploadImages', one));

            axios.post(apiRoot + "products/add", formData, { 
                    headers:{'Content-Type':'multipart/form-data'}
                })
                .then(res => {
                    alert("A product was added!");
                    this.setState({
                        model:'',
                        price: 0,
                        taxClass_id: -1,
                        currency_id: 1,
                        quantity: 0,
                        weight: 0,
                        manufacturer_id: -1,
                        brand_id: -1,
                        date: '',
                        status: 1,
                        ordered: 0,
                        images: '',
                        imageUrls: [],
                        uploadImages: [],
                        name: '',
                        desc: '',
                        url: '',
                        lang_id: 1,
                        category: [],
                        attribute: []
                    });
                })
                .catch(err=>{
                    console.log("[Error] - POST /products/add - at AddProduct component!");
                    console.log(err);
            });
            e.preventDefault();
        }
    }

    // Process the data coming from axios.get(apiRoot + "products/attributes"), and make it be the style like (id: xxx, title: xxx, pid: xxx).
    // Note: attribute groups must be added into the array above, those ids are like "0, -1, -2", those pid are 0.
    getAttrArray=( data )=>{
        let sortData = object_array_compare(data, "products_options_id");
        let item = {};
        const newData = [];
        if(data.length !== 0){
            let group = sortData[0].products_options_name
            let group_id = sortData[0].products_options_id;
            let group_key = 0;
            item = {
                id: group_id,
                title: group,
                p: 0,
                key: group_key--
            }
            newData.push(item);
            sortData.forEach((one)=>{
                if(one.products_options_name !== group){
                    group = one.products_options_name;
                    group_id = one.products_options_id;
                    item = {
                        id: group_id,
                        title: group,
                        p: 0,
                        key: group_key--
                    }
                    newData.push(item);
                }
                item = {
                    id: one.products_options_values_to_products_options_id,
                    title: one.products_options_values_name,
                    p: one.products_options_id,
                    ov:one.products_options_values_id,
                    key: one.products_options_values_to_products_options_id
                }
                newData.push(item);
            });
        }
        return newData
    } 

    componentDidMount(){
        axios.get(apiRoot + "languages")
            .then((res) => {
                this.setState({ langList: res.data });
            })
            .catch((err) => {
                console.log("[Error] - GET /languages - at AddProduct component!");
                console.log(err);           
        });
        axios.get(apiRoot + "products/tax_class")
            .then((res) => {            
                this.setState({ taxClassList: res.data });
            })
            .catch((err) => {
                console.log("[Error] - GET /products/tax_class - at AddProduct component!");
                console.log(err);            
        });
        axios.get(apiRoot + "currencies")
            .then((res) => {            
                this.setState({ currencyList: res.data });
            })
            .catch((err) => { 
                console.log("[Error] - GET /currencies - at AddProduct component!");
                console.log(err);          
        });
        axios.get(apiRoot + "products/manufacturers")
            .then((res) => {            
                this.setState({ manufacturerList: res.data });
            })
            .catch((err) => { 
                console.log("[Error] - GET /products/manufacturers - at AddProduct component!");
                console.log(err);          
        });
        axios.get(apiRoot + "products/brands")
            .then((res) => {            
                this.setState({ brandList: res.data });
            })
            .catch((err) => { 
                console.log("[Error] - GET /products/manufacturers - at AddProduct component!");
                console.log(err);          
        });
        axios.get(apiRoot + "products/categories")
            .then((res) => {
                this.setState({ categoryList: res.data });
            })
            .catch((err) => {
                console.log("[Error] - GET /products/categories - at AddProduct component!");
                console.log(err);       
        });
        axios.get(apiRoot + "products/attributes")
            .then((res) => {
                this.setState({ 
                    attributeDetail: res.data,
                    attributeList: this.getAttrArray(res.data) });
            })
            .catch((err) => {
                console.log("[Error] - GET /products/attributes - at AddProduct component!");
                console.log(err);    
        });
    }

    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.AddProduct.cn;
        else lang=LANGUAGE.AddProduct.en;

        const { model, price, taxClass_id, taxClassList, currency_id, currencyList, quantity, weight, 
                manufacturer_id, manufacturerList, brand_id, brandList, date, status, ordered, images,  
                imageUrls, langList, categoryList, category, attributeDetail, attributeList, attribute, 
                name, desc, url, lang_id } = this.state;
        
        // Handle images display
        let display=[];
        imageUrls.forEach((one,index)=>{
            display.push(
                <div className="card-deck border-warning mb-3" key={index}> 
                    <div className='col'>
                        <div className="card border-secondary">
                            <a className="text-right mr-1" href="0" onClick={(e)=>{this.deleteOneImage(index); e.preventDefault()}}><span className='close'>&times;</span></a>
                            <img className="card-img-top" src={one} style={{width: '130px'}} alt='one'/>
                        </div>
                    </div>
                </div> 
            );
        });

        // Handle attributes display & modification
        let attribute_table='';
        let rows=[];
        if(attribute.length !== 0){
            attribute.forEach((one, index)=>{
                const item=attributeDetail.find(o=>o.products_options_values_to_products_options_id === +one);
                rows.push(
                    <tr key={index} style={{verticalAlign: 'middle'}}>
                        <th scope="row" style={{verticalAlign: 'middle'}}>{one}</th>
                        <td style={{verticalAlign: 'middle'}}>{item.products_options_values_name}</td>
                        <td style={{verticalAlign: 'middle'}}>
                            <select className="form-control custom-select" style={{width: '60px'}} onChange={(e)=>this.handlePrefix(one, e)}>
                                <option key="1" value="+" >+</option> 
                                <option key="2" value="-">-</option>
                            </select>
                        </td>
                        <td style={{verticalAlign: 'middle'}} className="text-center">
                            <input name="variation" type="number" min="0" max={price} className="form-control" onChange={(e)=>this.handleVariation(one, e)}/>
                        </td>
                    </tr>
                )
            });
            attribute_table=(
                <div className="row mt-2">
                    <div className="col col-sm-2 text-right input-group-sm">
                        <label htmlFor="prefix" className="col-form-label">{lang[26]}</label>
                    </div>
                    <div className="col col-sm-10 input-group-sm" id="prefix">
                        <div className="table-responsive rounded">
                            <table className="table table-hover text-center">
                                <thead>
                                    <tr>
                                        <th scope="col">Id</th>
                                        <th scope="col">Atrribute Name</th>
                                        <th scope="col">+/-</th>
                                        <th scope="col">Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows}                                
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )
        }

        return(
            <div className="container-fluid">
                <div className="card rounded">
                    <div className="card-header">
                        <span style={{fontSize: "1.4em"}}><i className="fas fa-pencil-alt"></i>&nbsp;{lang[0]}</span>
                        <div className="float-right">
                            <div className=" btn-toolbar " >
                                <div className="btn-group-sm mr-2" role="group" aria-label="First group">
                                    <button type="button" className="btn btn-success" onClick={this.handleClickSave}><i className="fas fa-save" title={lang[1]}></i></button>
                                </div>
                                <Link to='/products'>
                                    <div className="btn-group-sm mr-2" role="group" aria-label="Second group">
                                        <button type="button" className="btn btn-primary"><i className="fas fa-arrow-alt-circle-right" title={lang[2]}></i></button>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="form-row">
                            {/*Product Info **********************************************************************/}
                            <div className="form-group col-md-6">
                                <div className="card rounded mb-2">
                                    <div className="card-header"> 
                                        <span>{lang[4]}</span>
                                    </div>
                                    <div className="card-body">
                                        <div className="row mb-2">
                                            <div className="col col-sm-2 text-right input-group-sm">
                                                <label htmlFor="model" className="col-form-label">{lang[5]}</label>
                                            </div>
                                            <div className="col col-sm-10 input-group-sm">
                                                <input name="model" type="text" className="form-control" id="model" value={model} onChange={this.handleChange}/>
                                            </div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col col-sm-2 text-right input-group-sm">
                                                <label htmlFor="price" className="col-form-label">{lang[7]}</label>
                                            </div>
                                            <div className="col col-sm-10 input-group-sm">
                                                <input name="price" type="number" className="form-control" id="price" value={price} onChange={this.handleChange}/>
                                            </div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col col-sm-2 text-right input-group-sm">
                                                <label htmlFor="taxClass_id" className="col-form-label">{lang[8]}</label>
                                            </div>
                                            <div className="col col-sm-10 input-group-sm">
                                                <select name="taxClass_id" className="form-control custom-select" id="taxClass_id" value={taxClass_id} onChange={this.handleChange}>
                                                    {<option key={-1} value={0}>-- Please choose an option --</option> }
                                                    {taxClassList.map((one, index) => <option key={index} value={one.tax_class_id}>{one.tax_class_title}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col col-sm-2 text-right input-group-sm">
                                                <label htmlFor="currency" className="col-form-label">{lang[24]}</label>
                                            </div>
                                            <div className="col col-sm-10 input-group-sm">
                                                <select name="currency_id" className="form-control custom-select" id="currency" value={currency_id} onChange={this.handleChange}>
                                                    {currencyList.map((one, index) => <option key={index} value={one.currencies_id}>{one.name}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col col-sm-2 text-right input-group-sm">
                                                <label htmlFor="quantity" className="col-form-label">{lang[9]}</label>
                                            </div>
                                            <div className="col col-sm-10 input-group-sm">
                                                <input name="quantity" type="text" className="form-control" id="quantity" value={quantity} onChange={this.handleChange}/>
                                            </div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col col-sm-2 text-right input-group-sm">
                                                <label htmlFor="weight" className="col-form-label">{lang[10]}</label>
                                            </div>
                                            <div className="col col-sm-10 input-group-sm">
                                                <input name="weight" type="text" className="form-control" id="weight" value={weight} onChange={this.handleChange}/>
                                            </div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col col-sm-2 text-right input-group-sm">
                                                <label htmlFor="manufacturer_id" className="col-form-label">{lang[11]}</label>
                                            </div>
                                            <div className="col col-sm-10 input-group-sm">
                                                <select name="manufacturer_id" className="form-control custom-select" id="manufacturer_id" value={manufacturer_id} onChange={this.handleChange}>
                                                        {<option key={-1} value={0}>-- Please choose an option --</option> }
                                                        {manufacturerList.map((one, index) => <option key={index} value={one.manufacturers_id}>{one.manufacturers_name}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col col-sm-2 text-right input-group-sm">
                                                <label htmlFor="brand_id" className="col-form-label">{lang[25]}</label>
                                            </div>
                                            <div className="col col-sm-10 input-group-sm">
                                                <select name="brand_id" className="form-control custom-select" id="brand_id" value={brand_id} onChange={this.handleChange}>
                                                    {<option key={-1} value={0}>-- Please choose an option --</option> }
                                                    {brandList.map((one, index) => <option key={index} value={one.id}>{one.brands_name}</option>)}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col col-sm-2 text-right input-group-sm">
                                                <label htmlFor="date" className="col-form-label">{lang[12]}</label>
                                            </div>
                                            <div className="col col-sm-10 input-group-sm">
                                                <input name="date" type="date" className="form-control" id="date" value={date} onChange={this.handleChange}/>
                                            </div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col col-sm-2 text-right input-group-sm">
                                                <label htmlFor="status" className="col-form-label">{lang[13]}</label>
                                            </div>
                                            <div className="col col-sm-10 input-group-sm">
                                                <select name="status" className="form-control custom-select" id="status" value={status} onChange={this.handleChange}>
                                                    <option key="1" value="1" >Enable</option> 
                                                    <option key="2" value="2">Disable</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col col-sm-2 text-right input-group-sm">
                                                <label htmlFor="ordered" className="col-form-label">{lang[14]}</label>
                                            </div>
                                            <div className="col col-sm-10 input-group-sm">
                                                <input name="ordered" type="text" className="form-control" id="ordered" value={ordered} onChange={this.handleChange}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/*Image upload **********************************************************************/}
                                <div className="card rounded">
                                    <div className="card-header"> 
                                        <span>{lang[27]}</span>
                                    </div>
                                    <div className="card-body">
                                        <div className="row mb-3">
                                            <div className="col col-sm-2 text-right input-group-sm">
                                                <label htmlFor="images_add" >{lang[28]}</label>
                                            </div>
                                            <div className="col col-sm-10 input-group-sm">
                                                <input name="images" type="file" multiple className="form-control" id="images_add" value={images} onChange={this.uploadImages}/>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col col-sm-2"></div>
                                            <div className="col col-sm-10">
                                                <div className="row">
                                                    {display}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/*Product description **********************************************************************/}
                            <div className="form-group col-md-6">
                                <div className="card rounded">
                                    <div className="card-header"> 
                                        <span>{lang[15]}</span>
                                    </div>
                                    <div className="card-body">
                                        <div className="row mb-2">
                                            <div className="col col-sm-2 text-right input-group-sm">
                                                <label htmlFor="name" className="col-form-label">{lang[16]}</label>
                                            </div>
                                            <div className="col col-sm-10 input-group-sm">
                                                <input name="name" type="text" className="form-control" id="name" value={name} onChange={this.handleChange}/>
                                            </div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col col-sm-2 text-right input-group-sm">
                                                <label htmlFor="desc" className="col-form-label">{lang[17]}</label>
                                            </div>
                                            <div className="col col-sm-10">
                                                <textarea name="desc" rows="5" className="form-control" id="desc"  value={desc} onChange={this.handleChange}/>
                                            </div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col col-sm-2 text-right input-group-sm">
                                                <label htmlFor="url" className="col-form-label">{lang[18]}</label>
                                            </div>
                                            <div className="col col-sm-10 input-group-sm">
                                                <input name="url" type="text" className="form-control" id="url" value={url} onChange={this.handleChange}/>
                                            </div>
                                        </div>
                                        <div className="row mb-2">
                                            <div className="col col-sm-2 text-right input-group-sm">
                                                <label htmlFor="lang" className="col-form-label">{lang[19]}</label>
                                            </div>
                                            <div className="col col-sm-10 input-group-sm">
                                                <select name="lang_id" className="form-control custom-select" id="lang" value={lang_id} onChange={this.handleChange}>
                                                    {langList.map((one, index) => <option key={index} value={one.id}>{one.name}</option> )}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/*Product Category **********************************************************************/}
                                <div className="card rounded mt-3">
                                    <div className="card-header"> 
                                        <span>{lang[20]}</span>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col col-sm-2 text-right input-group-sm">
                                                <label htmlFor="category" className="col-form-label">{lang[21]}</label>
                                            </div>
                                            <div className="col col-sm-10 input-group-sm" id="category">
                                                <MultiSelectTree
                                                    init={ category }
                                                    data={categoryList}
                                                    property1={'categories_id'}
                                                    property2={'parent_id'}
                                                    property3={'name'}
                                                    getValue={this.getCategoryValue}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/*Product Attribute **********************************************************************/}
                                <div className="card rounded mt-3">
                                    <div className="card-header"> 
                                        <span>{lang[22]}</span>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col col-sm-2 text-right input-group-sm">
                                                <label htmlFor="attribute" className="col-form-label">{lang[23]}</label>
                                            </div>
                                            <div className="col col-sm-10 input-group-sm" id="attribute">
                                                <MultiSelectTree
                                                    init={ attribute } 
                                                    data={attributeList}
                                                    property1={'id'}
                                                    property2={'p'}
                                                    property3={'title'}
                                                    property4={'key'}
                                                    getValue={this.getAttributeValue}
                                                />
                                            </div>
                                        </div>
                                        { attribute_table }
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

export default AddProduct;