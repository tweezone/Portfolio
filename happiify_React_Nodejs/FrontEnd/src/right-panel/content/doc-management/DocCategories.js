import React, { Component } from 'react';
import axios from 'axios';
import LANGUAGE from '../../../service/Language-data';
import apiRoot from '../../../config.api';
import CategoriesTree from '../../../service/components/CategoriesTree';

class DocCategories extends Component{
    constructor(props){
        super(props);
        this.state={
            allCategories: [],
            docList: [],
            id_pid: "",
            name: "",
            image: ""
        }
    }

    componentDidMount(){
        axios.get(apiRoot + "documents/categories")
            .then((res) => {            
                this.setState({ allCategories: res.data });
            })
            .catch((err) => {            
                console.log("Getting categories error in DocCategories component!");            
            });
        axios.get(apiRoot + "documents")
            .then((res) => {
                this.setState({ docList: res.data });  
            })
            .catch((err) => {            
                console.log("Getting documents error in DocCategories component!");            
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
                axios.post(apiRoot + "documents/categories/add", {
                    pid: this.state.id_pid,
                    name: this.state.name,
                    image: this.state.image
                })
                .then(res => {
                    axios.get(apiRoot + "documents/categories")
                        .then((res) => {            
                            this.setState({ allCategories: res.data });
                        })
                        .catch((err) => {            
                            console.log("Getting categories error in Categories component!");            
                    });
                })
                .catch(err=>{
                    console.log("Adding a category error in Category component!!");
                });                
                this.setState({
                    id_pid: "",
                    name: "",
                    image: ""
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
                axios.put(apiRoot + "documents/categories/update", {
                    id: this.state.id_pid,
                    name: this.state.name,
                    image: this.state.image
                    })
                    .then(res => {
                        axios.get(apiRoot + "documents/categories")
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
                    name: "",
                    image: ""
                });
                e.preventDefault();
            }
        }
    }

    handleDeleteClick=(e)=>{
        const idOk=this.state.allCategories.filter(category=>category.categories_id === +this.state.id_pid);
        const isParentId=this.state.allCategories.filter(category=>category.parent_id === +this.state.id_pid);
        const hasOneOnId=this.state.docList.filter(one=>(one.categories_id === +this.state.id_pid && one.categories_name === this.state.name));

        if(idOk.length===0){
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
                            alert("There are documents on this category. If delete this category, you have to delete all of the documents on it.");
                            e.preventDefault(); 
                        }
                        else{
                            axios.put(apiRoot + "documents/categories/delete", {
                                id: this.state.id_pid
                                })
                                .then(res => {
                                    axios.get(apiRoot + "documents/categories")
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
                                name: "",
                                image: ""
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
        if(this.props.langState ==='cn') lang=LANGUAGE.DocCategories.cn;
        else lang=LANGUAGE.DocCategories.en;

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
                                    <input id="input2" name="name" type="text" className="form-control" value={this.state.name} onChange={this.handleChange}/>
                                </div>
                                <div className="form-group col-md-4">
                                    <label htmlFor="input3" >{lang[3]}</label>
                                    <input id="input3" name="image" type="url" className="form-control" placeholder="http//123.com" onChange={this.handleChange}/>
                                </div>                                
                            </div>
                            <div className="form-group ">
                                    <button className="btn btn-outline-success mr-2  rounded" onClick={this.handleAddClick}>&nbsp;&nbsp;{lang[4]}&nbsp;&nbsp;</button>
                                    <button className="btn btn-outline-warning mr-2  rounded" onClick={this.handleUpdateClick}>{lang[5]}</button>
                                    <button className="btn btn-outline-danger  rounded" onClick={this.handleDeleteClick}>{lang[6]}</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>            
        );        
    }
}

export default DocCategories;