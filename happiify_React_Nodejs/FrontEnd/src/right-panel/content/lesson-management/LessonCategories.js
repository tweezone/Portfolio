import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import apiRoot from '../../../config.api';
import LANGUAGE from '../../../service/Language-data';

import CategoriesTree from '../../../service/components/CategoriesTree';

class LessonCategories extends Component{
    state={
            allCategories: [],
            subjectList: [],
            id_pid: "",
            category_name: "",
            category_image: ""
        };

    static propTypes={
        langState: PropTypes.string.isRequired
    };
    
    handleChange=(e)=>{
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleAddClick=(e)=>{
        const {allCategories, id_pid, category_name, category_image} = this.state;

        const idOk=allCategories.filter(one=>one.categories_id === +id_pid);
        if(idOk.length===0 && id_pid !== "0"){
            alert("You input a wrong pid. Please try again.");
            e.preventDefault();
        }        
        else{
            if(category_name === ""){
                alert("You have to input a category name. Please try again.");
                e.preventDefault();
            }
            else{
                axios.post(apiRoot + "lessons/categories/add", {
                    pid: id_pid,
                    name: category_name,
                    image: category_image
                })
                .then(res => {
                    axios.get(apiRoot + "lessons/categories")
                        .then((res) => {            
                            this.setState({ allCategories: res.data });
                        })
                        .catch((err) => {            
                            console.log("Getting categories error in LessonCategories component!");            
                    });
                })
                .catch(err=>{
                    console.log("Adding a category error in LessonCategories component!!");
                });                
                this.setState({
                    id_pid: "",
                    category_name: "",
                    category_image: ""
                });
                e.preventDefault();
            }
        }        
    }

    handleUpdateClick=(e)=>{
        const {allCategories, id_pid, category_name, category_image}=this.state;

        const idOk=allCategories.filter(one=>one.categories_id === +id_pid);
        if(idOk.length===0 && id_pid !== "0"){
            alert("You input a wrong id. Please try again.");
            e.preventDefault();
        }
        else{
            if(category_name === ""){
                alert("You have to input a category name. Please try again.");
                e.preventDefault();
            }
            else{
                axios.put(apiRoot + "lessons/categories/update", {
                    id: id_pid,
                    name: category_name,
                    image: category_image
                    })
                    .then(res => {
                        axios.get(apiRoot + "lessons/categories")
                            .then((res) => {            
                                this.setState({ allCategories: res.data });
                            })
                            .catch((err) => {            
                                console.log("Getting categories error in LessonCategories component!");            
                        });
                    })
                    .catch(err=>{
                        console.log("Updating a category error in LessonCategory component!!");
                });
                this.setState({
                    id_pid: "",
                    category_name: "",
                    category_image: ""
                });
                e.preventDefault();
            }
        }
    }

    handleDeleteClick=(e)=>{
        const {allCategories, id_pid, category_name, subjectList }=this.state;

        const idOk=allCategories.filter(one=>one.categories_id === +id_pid);
        const isParentId=allCategories.filter(one=>one.parent_id === +id_pid);
        const hasOneOnId=subjectList.filter(one=>(one.categories_id === +id_pid && one.categories_name === category_name));
        
        if(idOk.length===0 && id_pid !== "0"){
            alert("You input a wrong id. Please try again.");
            e.preventDefault();
        }
        else{
            if(isParentId.length !== 0){
                alert("You can NOT delete this category, because it has child categories. For deleting it, you have to delete all of its child categories. Please try again.");
                e.preventDefault();
            }
            else{
                if(category_name === ""){
                    alert("You have to input a category name. Please try again.");
                    e.preventDefault();
                }
                else{
                    if(idOk[0].name !== category_name){
                        alert("The id you input does NOT match its category name. Please try again.");
                        e.preventDefault();
                    }
                    else{
                        if(hasOneOnId.length !== 0){
                            alert("There are lessons on this category. If delete this category, you have to delete all of the lessons on it.");
                            e.preventDefault(); 
                        }
                        else{
                            if(window.confirm(`Do you really want to delete the category: ${category_name}, id: ${id_pid}?`)){
                                axios.put(apiRoot + "lessons/categories/delete", {
                                    id: id_pid
                                    })
                                    .then(res => {
                                        axios.get(apiRoot + "lessons/categories")
                                            .then((res) => {            
                                                this.setState({ allCategories: res.data });
                                            })
                                            .catch((err) => {            
                                                console.log("Getting categories error in LessonCategories component!");            
                                        });
                                    })
                                    .catch(err=>{
                                        console.log("Deleting a category error in LessonCategories component!!");
                                });
                                this.setState({
                                    id_pid: "",
                                    category_name: "",
                                    category_image: ""
                                });
                                e.preventDefault();
                            }
                            this.setState({
                                    id_pid: "",
                                    category_name: "",
                                    category_image: ""
                                });
                            e.preventDefault();
                        }
                    }
                }
            }    
        }   
    }

    componentDidMount(){
        axios.get(apiRoot + "lessons/categories")
            .then((res) => {            
                this.setState({ allCategories: res.data });
            })
            .catch((err) => {            
                console.log("Getting categories error in LessonCategories component!");            
            });
        axios.get(apiRoot + "lessons")
            .then((res) => {
               this.setState({ subjectList: res.data }); 
            })
            .catch((err) => {            
                console.log("Getting events error in LessonCategories component!");            
         });
    }

    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.LessonCategories.cn;
        else lang=LANGUAGE.LessonCategories.en;

        return(
            <div className="container">
                <div className="card rounded">
                    <div className="card-header">
                        <h5>{lang[0]}</h5>
                    </div>
                    <div className="card-body">
                        <CategoriesTree data={this.state.allCategories}/>
                        <br/>
                        <form>
                            <div className="form-row">                                
                                <div className="form-group col-md-4">
                                    <label htmlFor="input1" >{lang[1]}</label>
                                    <input id="input1" name="id_pid" type="text" className="form-control" value={this.state.id_pid} onChange={this.handleChange}/>
                                </div>                                
                                <div className="form-group col-md-4">
                                    <label htmlFor="input2" >{lang[2]}</label>
                                    <input id="input2" name="category_name" type="text" className="form-control" value={this.state.category_name} onChange={this.handleChange}/>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="input3" >{lang[3]}</label>
                                    <input id="input3" name="category_image" type="url" className="form-control" placeholder="http//123.com" value={this.state.category_image} onChange={this.handleChange}/>
                                </div>                 
                            </div>
                            <div className="form-row">
                                    <div className="form-group col-md-12">
                                        {lang[4]}
                                    </div>
                                </div>
                            <div className="form-group ">
                                    <button className="btn btn-outline-success mr-2  rounded" onClick={this.handleAddClick}>&nbsp;&nbsp;{lang[5]}&nbsp;&nbsp;</button>
                                    <button className="btn btn-outline-warning mr-2  rounded" onClick={this.handleUpdateClick}>{lang[6]}</button>
                                    <button className="btn btn-outline-danger  rounded" onClick={this.handleDeleteClick}>{lang[7]}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>            
        );        
    }
}

export default LessonCategories;