import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import apiRoot from '../../../config.api';
import LANGUAGE from '../../../service/Language-data';

export default class QuestionImageModal extends Component{
    state={
        questionImagesList: []
    }

    static propTypes = {
        langState: PropTypes.string.isRequired,
        currentId: PropTypes.number.isRequired,
        currentTitle: PropTypes.string.isRequired
    }

    handleClickDelete=(e)=>{
        if(window.confirm(`Do you really want to delete No. ${e.target.value} answer?`)){
            axios.put(apiRoot + "questions/images/delete", { id: e.target.value })
                .then(res => {
                    alert("You have deleted the image.");
                    axios.get(apiRoot + "questions/images")
                    .then((res) => {                   
                        this.setState({ questionImagesList: res.data });  
                    })
                    .catch((err) => {            
                        console.log("Getting question images error in QuestionImageModal component!");            
                    });
                })
                .catch(err=>{
                    console.log("Deleting question image error in QuestionImageModal component!");
            });
        }
        e.preventDefault();
    }

    componentDidMount(){
        axios.get(apiRoot + "questions/images")
            .then((res) => {
                this.setState({ questionImagesList: res.data});  
            })
            .catch((err) => {            
                console.log("Getting question images error in QuestionImageModal component!");            
            });
    }

    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.QuestionImageModal.cn;
        else lang=LANGUAGE.QuestionImageModal.en;

        const {questionImagesList} = this.state;
        const currentQuestionImages = questionImagesList.filter(one=> one.quizs_id === +this.props.currentId);
        const row=[];
        currentQuestionImages.forEach((one, index)=>{
            row.push(
                <tr key={index}>
                    <th style={{verticalAlign: 'middle'}} scope="row">{one.id}</th>
                    <td style={{verticalAlign: 'middle'}} >
                    {(()=>{
                            switch(one.media_url.slice(0,4)){
                                case '':        return (<span>{'No Image'}</span>);
                                case 'http':    return (<img src={one.media_url} style={{height: '50px'}} alt={index}/>);
                                default:        return (<a href={apiRoot + 'display/image/file?file=' + one.media_url}>
                                                            <img src={apiRoot + 'display/image/file?file=' + one.media_url} style={{height: '50px'}} alt={index}/>
                                                        </a>)
                            }
                        })()}
                    </td>
                    <td style={{verticalAlign: 'middle'}} >
                        <button className="btn btn-outline-danger btn-sm rounded" value={one.id} onClick={this.handleClickDelete}>{lang[5]}</button>
                    </td>
                </tr>
            );
        });

        return(
            <div className="modal fade" id="happyModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{fontSize:"0.9em"}}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h6 className="modal-title">{lang[0]}{this.props.currentId}&nbsp;&nbsp;&nbsp;{lang[1]}{this.props.currentTitle}</h6>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <table className="table table-sm table-hover table-bordered text-center">
                                <thead className="thead-dark">
                                    <tr>
                                        <th scope="col" style={{width:"30%"}}>{lang[2]}</th>
                                        <th scope="col" style={{width:"40%"}}>{lang[3]}</th>
                                        <th scope="col" style={{width:"30%"}}>{lang[4]}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {row.reverse()}
                                </tbody>
                            </table>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary btn-sm rounded" data-dismiss="modal">{lang[6]}</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}