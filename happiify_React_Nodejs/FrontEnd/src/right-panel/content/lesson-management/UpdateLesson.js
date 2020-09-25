import React, { Component} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {Link} from 'react-router-dom';
import LANGUAGE from '../../../service/Language-data';
import apiRoot from '../../../config.api';

import EmbeddedEditor from '../../../service/components/EmbeddedEditor';
import UpdateLessonVideosModal from './UpdateLessonVideos-Modal';

class UpdateLesson extends Component{
    state={
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
    
    static propTypes={
        langState: PropTypes.string.isRequired,
        logInName: PropTypes.string.isRequired,
        lessonId: PropTypes.number.isRequired
    }

    handleChange=(e)=>{
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    getEditorContent=(content)=>{
        this.setState({ full_desc: content });
    }

    handleSubmit=(e)=>{
        const { lessonId, logInName } = this.props;
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
            formData.append('id', lessonId);
            formData.append('user', logInName);
            formData.append('title', title);
            formData.append('category', category);
            formData.append('lecturer', lecturer);
            formData.append('price', price);
            formData.append('special', special);
            formData.append('type', type);
            formData.append('currency', currency);
            formData.append('image', image);
            formData.append('sections', sections);
            formData.append('short_desc', short_desc);
            formData.append('full_desc', full_desc);
            
            const lessonImage = document.getElementById('lesson_image_update');
            formData.append('lessonImage', lessonImage.files[0]);
            
            axios.put(apiRoot + "lessons/update", formData, {
                    headers:{'Content-Type':'multipart/form-data'}
                })
                .then(res => {
                    alert("One lesson was updated!");
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
                    console.log("[Error] - GET /lessons/update - at UpdateLesson component!");
                    console.log(err);
            });
        }
        e.preventDefault();
    }

    handleSectionDelete=()=>{
        this.setState(prev=>
            ({sections: prev.sections-1})
        )
    }
    
    componentDidMount(){
        const { lessonId } = this.props;
        axios.get(apiRoot + "lessons")
            .then((res) => {
                const currentOne = res.data.find(one=> one.id === +lessonId);
                axios.get(apiRoot + "lessons/categories")
                    .then((res) => {            
                        this.setState({ allCategories: res.data });
                        axios.get(apiRoot + "currencies")
                            .then((res) => {            
                                this.setState({ 
                                    allCurrencies: res.data,
                                    title: currentOne.title,
                                    category: currentOne.categories_name,
                                    lecturer: currentOne.speaker,
                                    price: currentOne.price,
                                    special: currentOne.special_price,
                                    type: currentOne.payment_type,
                                    currency: currentOne.currencies_id,
                                    image: currentOne.cover_image,
                                    sections: currentOne.lessons_count,
                                    short_desc: currentOne.short_description,
                                    full_desc: currentOne.full_description
                                });
                            })
                            .catch((err) => { 
                                console.log("[Error] - GET /currencies - at UpdateLesson component!");
                                console.log(err);           
                        });
                    })
                    .catch((err) => { 
                        console.log("[Error] - GET /lessons/categories - at UpdateLesson component!");
                        console.log(err);             
                })
            })
            .catch((err) => { 
                console.log("[Error] - GET /lessons - at UpdateLesson component!");
                console.log(err);           
        });
    }

    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.UpdateLesson.cn;
        else lang=LANGUAGE.UpdateLesson.en;
        
        const { allCategories, allCurrencies }=this.state;

        return(
            <div className="container">
                <div className="card rounded">
                    <div className="card-header"> 
                        <h5>{lang[0]}</h5>
                    </div>
                    <div className="card-body">
                        <br/>
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-row">          
                                <div className="form-group col-md-4">
                                    <label htmlFor="title">{lang[2]}</label>
                                    <input name="title" type="text" className="form-control" id="title" value={this.state.title}  onChange={this.handleChange} required/>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="cate">{lang[3]}</label>
                                    <select name="category" className="custom-select mr-sm-2" id="cate" value={this.state.category} onChange={this.handleChange} required>
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
                                    <label htmlFor="lesson_image_update">{lang[9]}</label>
                                    <input name="image" type="file" className="form-control" id="lesson_image_update"   onChange={this.handleChange}/>
                                </div>
                                <div className="form-group col-md-3">
                                    <label htmlFor="sect">{lang[10]}</label>
                                    <input name="sections" type="text" className="form-control" id="lect" value={this.state.sections} onChange={this.handleChange} required/>
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
                            <div className="btn-group">
                                <button type="submit" className="btn btn-success btn-sm mr-2 rounded" title={lang[15]}><i className="fas fa-save"></i></button>
                                <Link to="/lessons" className="btn btn-primary btn-sm rounded" title={lang[16]}><i className="fas fa-arrow-alt-circle-right"></i></Link>
                            </div>
                        </form>
                        <UpdateLessonVideosModal langState={this.props.langState} currentId={+this.props.lessonId} currentTitle={this.state.title} currentSections={this.state.sections.toString()} handleSectionDelete={this.handleSectionDelete}/>
                    </div>
                </div>
            </div>
        );        
    }
}

export default UpdateLesson;