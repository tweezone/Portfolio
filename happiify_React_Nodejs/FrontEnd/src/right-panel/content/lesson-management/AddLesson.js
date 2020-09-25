import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {Link} from 'react-router-dom';
import LANGUAGE from '../../../service/Language-data';
import apiRoot from '../../../config.api';

import EmbeddedEditor from '../../../service/components/EmbeddedEditor';
import UploadLessonVideosModal from './UploadLessonVideos-Modal';

class AddLesson extends Component{
    constructor(props){
        super(props);
        this.filesArray=[]; //Accept all of files form component-UploadLessonsModal.
        this.titleArray=[];
        this.descArray=[];
        this.duraArray=[];
        this.state={
            allCategories: [],
            allCurrencies: [],
            title: '',
            category: '',
            lecturer: '',
            price: '',
            special: '',
            type: '1',
            currency: 0,
            image: '',
            sections: '',
            short_desc: '',
            full_desc: ''
        };
    }
    
    static propTypes={
        langState: PropTypes.string.isRequired,
        logInName: PropTypes.string.isRequired
    }

    handleChange=(e)=>{
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    // For accepting the final values.NOTE: accept the FINAL values, bacause someone maybe changes the files in the element <input>, we have to get the final files only when click the button - Confirm.
    confirmFiles=(e)=>{
        for(let j=1; j<6; j++){
            //RULES: The lesson's video has to be filled, others have not to be filled. If there are not values for other three item, the default value is a blank ' '.
            if(document.getElementById('file'+j).value){
                this.filesArray.push(document.getElementById('file'+j).files[0]);
                document.getElementById('title'+j).value? this.titleArray.push(document.getElementById('title'+j).value) : this.titleArray.push(' ') ;
                document.getElementById('desc'+j).value? this.descArray.push(document.getElementById('desc'+j).value) : this.descArray.push(' ');
                document.getElementById('dura'+j).value? this.duraArray.push(document.getElementById('dura'+j).value) : this.duraArray.push(' ');
            }
        }
    }

    getEditorContent=(content)=>{
        this.setState({ full_desc: content });
    }

    handleSubmit=(e)=>{
        const { logInName } = this.props;
        const { allCategories, allCurrencies, title, category, lecturer, price, special, type, currency, image, sections, short_desc, full_desc } = this.state;
        const regex = RegExp(/^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/);
        if(!regex.test(price)){
            alert(`Please enter a number in the "price" option.`);
        }
        else if(!regex.test(special)){
            alert(`Please enter a number in the "special price" option.`);
        }
        else if(+special >= +price){
            alert(`The special price should be less than the price. Please try again!`);
        }
        else{
            const formData = new FormData();
            formData.append('user', logInName);
            formData.append('title', title);
            formData.append('category', category);
            formData.append('lecturer', lecturer);
            formData.append('price', price);
            formData.append('special', special);
            formData.append('type', type);
            formData.append('currency', currency);
            formData.append('image', image);
            sections !== ''? formData.append('sections', sections) : formData.append('sections', 1);
            formData.append('short_desc', short_desc);
            formData.append('full_desc', full_desc);

            const imageAdd = document.getElementById('lesson_image_add');
            formData.append('image', imageAdd.files[0]);
            this.filesArray.forEach(one=> formData.append('uploadFiles', one));
            this.filesArray=[];
            formData.append('titleArray', this.titleArray);
            this.titleArray=[];
            formData.append('descArray', this.descArray);        
            this.descArray=[];
            formData.append('duraArray', this.duraArray);        
            this.duraArray=[];

            axios.post(apiRoot + "lessons/add", formData, {
                    headers:{'Content-Type':'multipart/form-data'}
                })
                .then(res => {
                    alert("One lesson was added!");
                    this.setState({
                        title: '',
                        category: allCategories[0].name,
                        lecturer: '',
                        price: '',
                        special: '',
                        type: '1',
                        currency: allCurrencies[0].currencies_id,
                        image: '',
                        sections: '',
                        short_desc: '',
                        full_desc: ''
                    });
                })
                .catch(err=>{ 
                    console.log("[Error] - GET /lessons/add - at AddLesson component!");
                    console.log(err);
            });
        }        
        e.preventDefault();
    }

    handleClickReset=()=>{
        const { allCategories, allCurrencies } = this.state;
        this.setState({
            title: '',
            category: allCategories[0].name,
            lecturer: '',
            price: '',
            special: '',
            type: '1',
            currency: allCurrencies[0].currencies_id,
            image: '',
            sections: '',
            short_desc: '',
            full_desc: ''
        });
    }

    componentDidMount(){
        axios.get(apiRoot + "lessons/categories")
            .then((res) => {            
                this.setState({ 
                    allCategories: res.data,
                    category: res.data[0].name
                });
            })
            .catch((err) => { 
                console.log("[Error] - GET /lessons/categories - at AddLesson component!");
                console.log(err);        
        });
        axios.get(apiRoot + "currencies")
            .then((res) => {            
                this.setState({ 
                    allCurrencies: res.data,
                    currency: res.data[0].currencies_id
                });
            })
            .catch((err) => { 
                console.log("[Error] - GET /currencies - at AddLesson component!");
                console.log(err);            
        });
    }

    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.AddLesson.cn;
        else lang=LANGUAGE.AddLesson.en;

        const { allCategories, allCurrencies }=this.state;
        
        return(
            <div className="container">
                <div className="card rounded">
                    <div className="card-header"> 
                        <h5>{lang[0]}</h5>
                    </div>
                    <div className="card-body">
                        <div className="text-right mb-2">
                            <Link to="/lessons" className="btn btn-primary btn-sm rounded" title={lang[1]}><i className="fas fa-arrow-alt-circle-right"></i></Link>
                        </div>
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-row">          
                                <div className="form-group col-md-4">
                                    <label htmlFor="title">{lang[2]}</label>
                                    <input name="title" type="text" className="form-control" id="title" value={this.state.title}  onChange={this.handleChange} required/>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="cate">{lang[3]}</label>
                                    <select name="category" className="custom-select mr-sm-2" id="cate" value={this.state.category} onChange={this.handleChange}>
                                            {allCategories.map((one,index) => <option key={index} value={one.name}>{one.name}</option>)}
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="lect">{lang[4]}</label>
                                    <input name="lecturer" type="text" className="form-control" id="lect" value={this.state.lecturer} onChange={this.handleChange} required/>
                                </div>
                            </div>

                            <div className="form-row">          
                                <div className="form-group col-md-6">
                                    <label htmlFor="pric">{lang[5]}</label>
                                    <input name="price" type="text" className="form-control" id="pric" value={this.state.price}  onChange={this.handleChange} required/>
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="spec">{lang[6]}</label>
                                    <input name="special" type="text" className="form-control" id="spec" value={this.state.special}  onChange={this.handleChange} required/>
                                </div>
                            </div>    
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label htmlFor="ty">{lang[7]}</label>
                                    <select name="type" className="custom-select mr-sm-2" id="ty" value={this.state.type} onChange={this.handleChange} required>
                                            <option value="1">付费</option>
                                            <option value="2">免费</option>
                                    </select>
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="currency">{lang[8]}</label>
                                    <select name="currency" className="custom-select mr-sm-2" id="currency" value={this.state.currency} onChange={this.handleChange}>
                                            {allCurrencies.map((one, index) => <option key={index} value={one.currencies_id}>{one.name}</option> )}
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">          
                                <div className="form-group col-md-6">
                                    <label htmlFor="lesson_image_add">{lang[9]}</label>
                                    <input name="image" type="file" className="form-control" id="lesson_image_add" value={this.state.image}  onChange={this.handleChange} required/>
                                </div>
                                <div className="form-group col-md-3">
                                    <label htmlFor="sect">{lang[10]}</label>
                                    <input name="sections" type="text" className="form-control" id="lect" value={this.state.sections} onChange={this.handleChange}/>
                                </div>
                                <div className="form-group col-md-3">
                                    <label htmlFor="upload">&nbsp;</label>
                                    <input data-toggle="modal" data-target=".bd-example-modal-lg"
                                        name="upload" type="button" className="form-control btn btn-secondary rounded" id="upload" value={lang[11]} onClick={this.handleUpload} required/>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="short">{lang[13]}</label>
                                <input name="short_desc" type="text" className="form-control" id="short" value={this.state.short_desc} onChange={this.handleChange} required/>
                            </div>
                            <div className="form-group">
                                <label>{lang[14]}</label>                                
                                <EmbeddedEditor 
                                    content={this.state.full_desc}
                                    getContent={this.getEditorContent}/>
                            </div>
                            <UploadLessonVideosModal langState={this.props.langState} confirmFiles={this.confirmFiles}/>
                            <div className="btn-group">
                                <button type="submit" className="btn btn-success btn-sm mr-2 rounded" title={lang[15]}><i className="fas fa-save"></i></button>
                                <button type="reset" className="btn btn-danger btn-sm rounded" title={lang[16]} onClick={this.handleClickReset}><i className="fas fa-undo-alt"></i></button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );        
    }
}

export default AddLesson;