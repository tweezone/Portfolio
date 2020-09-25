import React, { Component } from 'react';
import axios from 'axios';
import apiRoot from '../../../config.api';
import LANGUAGE from '../../../service/Language-data';

import CategoriesTree from '../../../service/components/CategoriesTree';

class VideoCategories extends Component{
    constructor(props){
        super(props);
        this.state={
            allCategories: [],
            videoList: [],
            id_pid: "",
            name: ""
        }
    }

    componentDidMount(){
        axios.get(apiRoot + "videos/categories")
            .then((res) => {            
                this.setState({ allCategories: res.data });
            })
            .catch((err) => {            
                console.log("Getting categories error in VideoCategories component!");            
            });
        axios.get(apiRoot + "videos")
            .then((res) => {
               this.setState({ videoList: res.data }); 
            })
            .catch((err) => {            
                console.log("Getting videos error in VideoCategories component!");            
         });
    }

    handleChange=(e)=>{
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleAddClick=(e)=>{
        const idOk=this.state.allCategories.filter(category=>category.categories_id === +this.state.id_pid);
        if(idOk.length===0 && this.state.id_pid !== "0"){
            alert("You input a wrong pid. Please try again.");
            e.preventDefault();
        }        
        else{
            if(this.state.name === ""){
                alert("You have to input a category name. Please try again.");
                e.preventDefault();
            }
            else{
                axios.post(apiRoot + "videos/categories/add", {
                    pid: this.state.id_pid,
                    name: this.state.name
                })
                .then(res => {
                    axios.get(apiRoot + "videos/categories")
                        .then((res) => {            
                            this.setState({ allCategories: res.data });
                        })
                        .catch((err) => {            
                            console.log("Getting categories error in Categories component!");            
                    });
                })
                .catch(err=>{
                    console.log("Adding a category error in VideoCategories component!!");
                });                
                this.setState({
                    id_pid: "",
                    name: ""
                });
                e.preventDefault();
            }
        }        
    }

    handleUpdateClick=(e)=>{
        const idOk=this.state.allCategories.filter(category=>category.categories_id === +this.state.id_pid);
        if(idOk.length===0 && this.state.id_pid !== "0"){
            alert("You input a wrong id. Please try again.");
            e.preventDefault();
        }
        else{
            if(this.state.name === ""){
                alert("You have to input a category name. Please try again.");
                e.preventDefault();
            }
            else{
                axios.put(apiRoot + "videos/categories/update", {
                    id: this.state.id_pid,
                    name: this.state.name
                    })
                    .then(res => {
                        axios.get(apiRoot + "videos/categories")
                            .then((res) => {            
                                this.setState({ allCategories: res.data });
                            })
                            .catch((err) => {            
                                console.log("Getting categories error in Categories component!");            
                        });
                    })
                    .catch(err=>{
                        console.log("Updating a category error in Category component!!");
                });
                this.setState({
                    id_pid: "",
                    name: ""
                });
                e.preventDefault();
            }
        }
    }

    handleDeleteClick=(e)=>{
        const idOk=this.state.allCategories.filter(category=>category.categories_id === +this.state.id_pid);
        const isParentId=this.state.allCategories.filter(category=>category.parent_id === +this.state.id_pid);
        const hasOneOnId=this.state.videoList.filter(one=>(one.video_category_id === +this.state.id_pid && one.category_name === this.state.name));
        
        if(idOk.length===0 && this.state.id_pid !== "0"){
            alert("You input a wrong id. Please try again.");
            e.preventDefault();
        }
        else{
            if(isParentId.length !== 0){
                alert("You can NOT delete this category, because it has child categories. For deleting it, you have to delete all of its child categories. Please try again.");
                e.preventDefault();
            }
            else{
                if(this.state.name === ""){
                    alert("You have to input a category name. Please try again.");
                    e.preventDefault();
                }
                else{
                    if(idOk[0].name !== this.state.name){
                        alert("The id you input does NOT match its category name. Please try again.");
                        e.preventDefault();
                    }
                    else{
                        if(hasOneOnId.length !== 0){
                            alert("There are videos on this category. If delete this category, you have to delete all of the videos on it.");
                            e.preventDefault(); 
                        }
                        else{
                            axios.put(apiRoot + "videos/categories/delete", {
                                id: this.state.id_pid
                                })
                                .then(res => {
                                    axios.get(apiRoot + "videos/categories")
                                        .then((res) => {            
                                            this.setState({ allCategories: res.data });
                                        })
                                        .catch((err) => {            
                                            console.log("Getting categories error in VideoCategories component!");            
                                    });
                                })
                                .catch(err=>{
                                    console.log("Deleting a category error in VideoCategories component!!");
                            });
                            this.setState({
                                id_pid: "",
                                name: ""
                            });
                            e.preventDefault();
                        }
                    }
                }
            }    
        }   
    }

    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.VideoCategories.cn;
        else lang=LANGUAGE.VideoCategories.en;

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
                                <div className="form-group col-md-6">
                                    <label htmlFor="input1" >{lang[1]}</label>
                                    <input id="input1" name="id_pid" type="text" className="form-control" value={this.state.id_pid} onChange={this.handleChange}/>
                                </div>                                
                                <div className="form-group col-md-6">
                                    <label htmlFor="input2" >{lang[2]}</label>
                                    <input id="input2" name="name" type="text" className="form-control" value={this.state.name} onChange={this.handleChange}/>
                                </div>                         
                            </div>
                            <div className="form-group ">
                                    <button className="btn btn-outline-success mr-2  rounded" onClick={this.handleAddClick}>&nbsp;&nbsp;{lang[3]}&nbsp;&nbsp;</button>
                                    <button className="btn btn-outline-warning mr-2  rounded" onClick={this.handleUpdateClick}>{lang[4]}</button>
                                    <button className="btn btn-outline-danger  rounded" onClick={this.handleDeleteClick}>{lang[5]}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>            
        );        
    }
}

export default VideoCategories;