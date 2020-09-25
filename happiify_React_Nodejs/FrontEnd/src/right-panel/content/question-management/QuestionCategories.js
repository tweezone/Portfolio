import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import apiRoot from '../../../config.api';
import LANGUAGE from '../../../service/Language-data';

import CategoriesTree from '../../../service/components/CategoriesTree';

class QuestionTags extends Component{
    state={
            allCategories: [],
            subjectList: [],
            id_pid: "",
            categories_name: ""
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
        const {id_pid, categories_name} = this.state;

        if(id_pid !== ""){
            alert("When adding a tag, DO NOT input a Tag id. Please try again.");
            e.preventDefault();
        }        
        else{
            if(categories_name === ""){
                alert("You have to input a tag name. Please try again.");
                e.preventDefault();
            }
            else{
                axios.post(apiRoot + "questions/categories/add", {
                    pid: id_pid,
                    name: categories_name
                })
                .then(res => {
                    axios.get(apiRoot + "questions/tags")
                        .then((res) => {
                            this.setState({ allCategories: this.processData(res.data)});
                        })
                        .catch((err) => {            
                            console.log("Getting tags error in QuestionCategories component!");            
                    });
                })
                .catch(err=>{
                    console.log("Adding a tag error in QuestionCategories component!!");
                });                
                this.setState({
                    id_pid: "",
                    categories_name: ""
                });
                e.preventDefault();
            }
        }        
    }

    handleUpdateClick=(e)=>{
        const {allCategories, id_pid, categories_name}=this.state;
        const idOk=allCategories.filter(one=>one.categories_id === +id_pid);

        if(idOk.length===0){
            alert("You input a wrong id. Please try again.");
            e.preventDefault();
        }
        else{
            if(categories_name === ""){
                alert("You have to input a tag name. Please try again.");
                e.preventDefault();
            }
            else{
                axios.put(apiRoot + "questions/categories/update", {
                    id: id_pid,
                    name: categories_name
                    })
                    .then(res => {
                        axios.get(apiRoot + "questions/categories")
                            .then((res) => {
                                this.setState({ allCategories: this.processData(res.data)});
                            })
                            .catch((err) => {            
                                console.log("Getting tags error in QuestionCategories component!");            
                        });
                    })
                    .catch(err=>{
                        console.log("Updating a tag error in QuestionCategories component!!");
                });
                this.setState({
                    id_pid: "",
                    categories_name: ""
                });
                e.preventDefault();
            }
        }
    }

    handleDeleteClick=(e)=>{
        const {allCategories, id_pid, categories_name, subjectList}=this.state;
        const idOk=allCategories.filter(one=>one.categories_id === +id_pid);
        const hasOneOnId=subjectList.filter(one=>(one.tag_id === +id_pid));
        
        if(idOk.length===0){
            alert("You input a wrong id. Please try again.");
            e.preventDefault();
        }
        else{
            if(categories_name === ""){
                alert("You have to input a tag name. Please try again.");
                e.preventDefault();
            }
            else{
                if(idOk[0].name !== categories_name){
                    alert("The id you input does NOT match its tag name. Please try again.");
                    e.preventDefault();
                }
                else{
                    if(hasOneOnId.length !== 0){
                        alert("There are questions on this tag. If delete this tag, you have to delete all of the questions on it.");
                        this.setState({
                            id_pid: "",
                            categories_name: ""
                        });
                        e.preventDefault(); 
                    }
                    else{
                        if(window.confirm(`Do you really want to delete the tag: ${categories_name}, id: ${id_pid}?`)){
                            axios.put(apiRoot + "questions/categories/delete", {
                                id: id_pid
                                })
                                .then(res => {
                                    axios.get(apiRoot + "questions/categories")
                                        .then((res) => {
                                            this.setState({ allCategories: this.processData(res.data)});
                                        })
                                        .catch((err) => {            
                                            console.log("Getting tags error in QuestionCategories component!");            
                                    });
                                })
                                .catch(err=>{
                                    console.log("Deleting a tag error in QuestionCategories component!!");
                            });
                            this.setState({
                                id_pid: "",
                                categories_name: ""
                            });
                            e.preventDefault();
                        }
                        this.setState({
                            id_pid: "",
                            categories_name: ""
                        });
                        e.preventDefault();
                    }
                }
            }
        }   
    }

    componentDidMount(){
        axios.get(apiRoot + "questions/categories")
            .then((res) => {
                this.setState({ allCategories: res.data});
            })
            .catch((err) => {            
                console.log("Getting tags error in QuestionCategories component!");            
            });
        axios.get(apiRoot + "questions")
            .then((res) => {
               this.setState({ subjectList: res.data }); 
            })
            .catch((err) => {            
                console.log("Getting questions error in QuestionCategories component!");            
         });
    }

    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.QuestionTags.cn;
        else lang=LANGUAGE.QuestionTags.en;

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
                                    <input id="input2" name="categories_name" type="text" className="form-control" value={this.state.categories_name} onChange={this.handleChange}/>
                                </div>     
                            </div>
                            <div className="form-row">
                                    <div className="form-group col-md-12">
                                        {lang[3]}
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

export default QuestionTags;