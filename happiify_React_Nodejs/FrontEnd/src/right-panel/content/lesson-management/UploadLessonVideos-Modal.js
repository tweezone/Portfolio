import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LANGUAGE from '../../../service/Language-data';

export default class UploadLessonVideosModal extends Component{
    state={
        file1: '',
        file2: '',
        file3: '',
        file4: '',
        file5: '',
        
        title1: '',
        title2: '',
        title3: '',
        title4: '',
        title5: '',

        desc1: '',
        desc2: '',
        desc3: '',
        desc4: '',
        desc5: '',

        dura1: '',
        dura2: '',
        dura3: '',
        dura4: '',
        dura5: ''
    };

    static propTypes={
        langState: PropTypes.string.isRequired,
        confirmFiles: PropTypes.func.isRequired
    }

    handleFileChange=(e)=>{
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleCancel=()=>{
        this.setState({
            file1: '',
            file2: '',
            file3: '',
            file4: '',
            file5: '',

            title1: '',
            title2: '',
            title3: '',
            title4: '',
            title5: '',

            desc1: '',
            desc2: '',
            desc3: '',
            desc4: '',
            desc5: '',

            dura1: '',
            dura2: '',
            dura3: '',
            dura4: '',
            dura5: ''
        });
    }

    confirmFiles=()=>{
        //alert(`The files are attached.`);
        this.props.confirmFiles();
        this.setState({
            file1: '',
            file2: '',
            file3: '',
            file4: '',
            file5: '',

            title1: '',
            title2: '',
            title3: '',
            title4: '',
            title5: '',

            desc1: '',
            desc2: '',
            desc3: '',
            desc4: '',
            desc5: '',

            dura1: '',
            dura2: '',
            dura3: '',
            dura4: '',
            dura5: ''
        });
        alert(`The files are attached.`);
    }

    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.UploadLessonVideosModal.cn;
        else lang=LANGUAGE.UploadLessonVideosModal.en;

        return(
            <div className="modal fade bd-example-modal-lg" tabIndex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{lang[0]}</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true" onClick={this.handleCancel}>&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">

                            <div className="form-row">   
                                <div className="form-group col-md-2">
                                    <input id="title1" name="title1" type="text" className="form-control form-control-sm" placeholder={lang[1]} value={this.state.title1}  onChange={this.handleFileChange}  />
                                </div>
                                <div className="form-group col-md-4">
                                    <input id="desc1" name="desc1" type="text" className="form-control form-control-sm" placeholder={lang[2]} value={this.state.desc1}  onChange={this.handleFileChange} />
                                </div>
                                <div className="form-group col-md-4">
                                    <input id="file1" name="file1" type="file" className="form-control form-control-sm" value={this.state.file1} onChange={this.handleFileChange} style={{fontSize:"80%"}}/>
                                </div>
                                <div className="form-group col-md-2">
                                    <input id="dura1" name="dura1" type="text" className="form-control form-control-sm" placeholder={lang[3]} value={this.state.dura1}  onChange={this.handleFileChange} />
                                </div>
                            </div>

                            <div className="form-row">          
                                <div className="form-group col-md-2">
                                    <input id="title2" name="title2" type="text" className="form-control form-control-sm" placeholder={lang[4]} value={this.state.title2}  onChange={this.handleFileChange} />
                                </div>
                                <div className="form-group col-md-4">
                                    <input id="desc2" name="desc2" type="text" className="form-control form-control-sm" placeholder={lang[5]} value={this.state.desc2}  onChange={this.handleFileChange} />
                                </div>
                                <div className="form-group col-md-4">
                                    <input id="file2" name="file2" type="file" className="form-control form-control-sm" value={this.state.file2} onChange={this.handleFileChange} style={{fontSize:"80%"}}/>
                                </div>
                                <div className="form-group col-md-2">
                                    <input id="dura2" name="dura2" type="text" className="form-control form-control-sm" placeholder={lang[6]} value={this.state.dura2}  onChange={this.handleFileChange} />
                                </div>
                            </div>

                            <div className="form-row">          
                                <div className="form-group col-md-2">
                                    <input id="title3" name="title3" type="text" className="form-control form-control-sm" placeholder={lang[7]} value={this.state.title3}  onChange={this.handleFileChange}  />
                                </div>
                                <div className="form-group col-md-4">
                                    <input id="desc3" name="desc3" type="text" className="form-control form-control-sm" placeholder={lang[8]} value={this.state.desc3}  onChange={this.handleFileChange} />
                                </div>
                                <div className="form-group col-md-4">
                                    <input id="file3" name="file3" type="file" className="form-control form-control-sm" value={this.state.file3} onChange={this.handleFileChange} style={{fontSize:"80%"}}/>
                                </div>
                                <div className="form-group col-md-2">
                                    <input id="dura3" name="dura3" type="text" className="form-control form-control-sm" placeholder={lang[9]} value={this.state.dura3}  onChange={this.handleFileChange} />
                                </div>
                            </div>
                            
                            <div className="form-row">          
                                <div className="form-group col-md-2">
                                    <input id="title4" name="title4" type="text" className="form-control form-control-sm" placeholder={lang[10]} value={this.state.title4}  onChange={this.handleFileChange}  />
                                </div>
                                <div className="form-group col-md-4">
                                    <input id="desc4" name="desc4" type="text" className="form-control form-control-sm" placeholder={lang[11]} value={this.state.desc4}  onChange={this.handleFileChange} />
                                </div>
                                <div className="form-group col-md-4">
                                    <input id="file4" name="file4" type="file" className="form-control form-control-sm" value={this.state.file4} onChange={this.handleFileChange} style={{fontSize:"80%"}}/>
                                </div>
                                <div className="form-group col-md-2">
                                    <input id="dura4" name="dura4" type="text" className="form-control form-control-sm" placeholder={lang[12]} value={this.state.dura4}  onChange={this.handleFileChange} />
                                </div>
                            </div>

                            <div className="form-row">          
                                <div className="form-group col-md-2">
                                    <input id="title5" name="title5" type="text" className="form-control form-control-sm" placeholder={lang[13]} value={this.state.title5} onChange={this.handleFileChange}  />
                                </div>
                                <div className="form-group col-md-4">
                                    <input id="desc5" name="desc5" type="text" className="form-control form-control-sm" placeholder={lang[14]} value={this.state.desc5} onChange={this.handleFileChange} />
                                </div>
                                <div className="form-group col-md-4">
                                    <input id="file5" name="file5" type="file" className="form-control form-control-sm" value={this.state.file5} onChange={this.handleFileChange} style={{fontSize:"80%"}}/>
                                </div>
                                <div className="form-group col-md-2">
                                    <input id="dura5" name="dura5" type="text" className="form-control form-control-sm" placeholder={lang[15]} value={this.state.dura5}  onChange={this.handleFileChange} />
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary btn-sm rounded" data-dismiss="modal" onClick={this.confirmFiles}>{lang[16]}</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}