import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import apiRoot from '../../../config.api';
import LANGUAGE from '../../../service/Language-data';

export default class UpdateLessonVideosModal extends Component{
    state={
        lessonSectionsList: []
    }

    static propTypes = {
        langState: PropTypes.string.isRequired,
        currentId: PropTypes.number.isRequired,
        currentTitle: PropTypes.string.isRequired,
        currentSections: PropTypes.string.isRequired
    }

    handleClickDelete=(e)=>{
        if(window.confirm(`Do you really want to delete No. ${e.target.value} section?`)){
            axios.put(apiRoot + "lessons/sections/delete", { id: e.target.value,
                                                             lesson_id: this.props.currentId,
                                                             sections: this.props.currentSections
            })
                .then(res => {
                    alert("You have deleted the section.");
                    axios.get(apiRoot + "lessons/sections")
                    .then((res) => {                   
                        this.setState({ lessonSectionsList: res.data }); 
                        this.props.handleSectionDelete();
                    })
                    .catch((err) => {            
                        console.log("Getting lesson sections error in UpdateLessonVideosModal component!");            
                    });
                })
                .catch(err=>{
                    console.log("Deleting lesson sections error in UpdateLessonVideosModal component!");
            });
        }
        e.preventDefault();
    }

    componentDidMount(){
        axios.get(apiRoot + "lessons/sections")
            .then((res) => {
                this.setState({ lessonSectionsList: res.data});  
            })
            .catch((err) => {            
                console.log("Getting lesson sections error in UpdateLessonVideosModal component!");            
            });
    }

    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.UpdateLessonVideosModal.cn;
        else lang=LANGUAGE.UpdateLessonVideosModal.en;

        const {lessonSectionsList} = this.state;
        const currentLessonSections = lessonSectionsList.filter(one=> one.lesson_id === +this.props.currentId);
        const row=[];
        currentLessonSections.forEach((one, index)=>{
            row.push(
                <tr key={index}>
                    <th scope="row">{ one.id }</th>
                    <td>{ one.title }</td>
                    <td>{ one.sub_title }</td>
                    <td><a href={apiRoot + 'display/video/file?file=' + one.media_file_url} >{one.media_file_url}</a></td>
                    <td>{ one.media_info }</td>
                    <td className="text-right">
                        <button className="btn btn-outline-danger btn-sm rounded" value={one.id} onClick={this.handleClickDelete}>{lang[8]}</button>
                    </td>
                </tr>
            );
        });

        return(
            <div className="modal fade bd-example-modal-lg" tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{lang[0]}{this.props.currentId}&nbsp;&nbsp;&nbsp;{lang[1]}{this.props.currentTitle}</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <table className="table table-hover ">
                                <thead>
                                    <tr>
                                        <th scope="col" style={{width:"10%"}}>{lang[2]}</th>
                                        <th scope="col" style={{width:"20%"}}>{lang[3]}</th>
                                        <th scope="col" style={{width:"30%"}}>{lang[4]}</th>
                                        <th scope="col" style={{width:"10%"}}>{lang[5]}</th>
                                        <th scope="col" style={{width:"10%"}}>{lang[6]}</th>
                                        <th scope="col" className="text-center" style={{width:"20%"}}>{lang[7]}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {row.reverse()}
                                </tbody>
                            </table>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary rounded" data-dismiss="modal">{lang[9]}</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}