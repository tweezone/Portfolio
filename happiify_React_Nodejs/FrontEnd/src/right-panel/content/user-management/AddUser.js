import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {Link} from 'react-router-dom';
import LANGUAGE from '../../../service/Language-data';
import apiRoot from '../../../config.api';

import EmbeddedEditor from '../../../service/components/EmbeddedEditor';

class AddUser extends Component{
    state={
        constellation_array: [],
        maritalStatus: [],     // Store attribute groups
        roleList: [],
        username: '',
        email: '',
        mobile: '',
        birthday: '',
        constellation: '',
        marital: '',
        role: '',
        desc: '',
        password: '',
        confirm: '',
        image: '',
        imageUrl: ''  // For displaying the image in Front-End.        
    }

    static propTypes={
        langState: PropTypes.string.isRequired
    };

    handleChange=(e)=>{
        this.setState({
            [e.target.name]: e.target.value
        });
        const imageFile = document.getElementById('image')
        if(imageFile.files[0]){
            const imageUrl = window.URL.createObjectURL(imageFile.files[0]);
            this.setState({ imageUrl });
        }
    }

    getEditorContent=(content)=>{
        this.setState({ desc: content });
    }

    handleClickSave=(e)=>{
        const { constellation_array, maritalStatus, roleList, username, email, mobile, birthday, constellation, marital, role, desc, password, confirm, image } = this.state;
        
        axios.get(apiRoot + "users")
            .then((res) => {
                const haveOneUser = res.data.find(one=> one.username === username);
                const haveOneEmail = res.data.find(one=> one.email === email);
                const haveOneMobile = res.data.find(one=> one.mobile === mobile);
                if(password === ''){
                    alert(`You must enter a password. Try again, please.`);
                }
                else if(password !== confirm){
                    alert(`The password didn't match. Try again, please.`);
                }
                else if(username === ''){
                    alert(`You must enter a username. Try again, please.`);
                }
                else if(email === ''){
                    alert(`You must enter an email address. Try again, please.`);
                }
                else if(mobile === ''){
                    alert(`You must enter an mobile number. Try again, please.`);
                }
                else if(haveOneUser){
                    alert(`The username has been used. Try again, please.`);
                }
                else if(haveOneEmail){
                    alert(`The email address has been used. Try again, please.`);
                }
                else if(haveOneMobile){
                    alert(`The mobile number has been used. Try again, please.`);
                }
                else{
                    const formData = new FormData();
                    formData.append('username', username);
                    formData.append('email', email);
                    formData.append('mobile', mobile);
                    formData.append('birthday', birthday);
                    formData.append('constellation', constellation);
                    formData.append('marital', marital);
                    formData.append('role', role);
                    formData.append('desc', desc);
                    formData.append('password', password);
                    formData.append('image', image);
        
                    const imageFile = document.getElementById('image')
                    formData.append('imageFile', imageFile.files[0]);
        
                    axios.post(apiRoot + "users/add", formData, { 
                            headers:{'Content-Type':'multipart/form-data'}
                        })
                        .then(res => {
                            alert("A user was added!");
                            this.setState({
                                username: '',
                                email: '',
                                mobile: '',
                                birthday: '',
                                constellation: constellation_array[0].id,
                                marital: maritalStatus[2].status_text,
                                role: roleList[0].group_name,
                                desc: '',
                                password: '',
                                confirm: '',
                                image: '',
                                imageUrl: ''
                            });
                        })
                        .catch(err=>{
                            console.log("Adding an attribute error in AddUser component!");
                    });
                    e.preventDefault();
                }
            })
            .catch((err) => {            
                console.log("Getting users error in AddUser component!");            
        });
    }

    componentDidMount(){
        axios.get(apiRoot + "users/marriage")
            .then((res) => {          
                this.setState({ 
                    maritalStatus: res.data,
                    marital: res.data[2].status_text
                });
            })
            .catch((err) => {            
                console.log("Getting marital status error in AddUser component!");            
        });        
        
        axios.get(apiRoot + "users/roles")
            .then((res) => {          
                this.setState({ 
                    roleList: res.data,
                    role: res.data[0].group_name
                });
            })
            .catch((err) => {            
                console.log("Getting roles error in AddUser component!");            
        });

        axios.get(apiRoot + "dictionary")
            .then((res) => { 
                const constellation_array = res.data.filter(one=>one.dict_key === '星座')          
                this.setState({ 
                    constellation_array,
                    constellation: constellation_array[0].id
                });
            })
            .catch((err) => {            
                console.log("Getting roles error in AddUser component!");            
        });
    }

    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.AddUser.cn;
        else lang=LANGUAGE.AddUser.en;

        const { constellation_array, maritalStatus, roleList, username, email, mobile, birthday, constellation, password, confirm, image, marital, role, imageUrl } = this.state;
        return(
            <div className="container-fluid">
                <div className="card rounded">
                    <div className="card-header">
                        <span style={{fontSize: "1.4em"}}><i className="fas fa-pencil-alt"></i>&nbsp;{lang[0]}</span>
                        <div className="float-right">
                            <div className=" btn-toolbar " >
                                <div className="btn-group-sm mr-2" role="group" aria-label="First group">
                                    <button type="button" className="btn btn-success" onClick={this.handleClickSave} title={lang[1]}><i className="fas fa-save"></i></button>
                                </div>
                                <Link to='/users'>
                                    <div className="btn-group-sm mr-2" role="group" aria-label="Second group">
                                        <button type="button" className="btn btn-primary" title={lang[2]}><i className="fas fa-arrow-alt-circle-right"></i></button>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="card-body" style={{fontWeight: 'bold'}}>
                        <div className="form-row">
                                {/*Basic Info **********************************************************************/}
                                <div className="form-group col-md-6 mt-2">
                                    <div className="card bg-light rounded">
                                        <div className="card-body">
                                            <div className="mb-2">
                                                <h6 className="card-title mb-2">{lang[3]}</h6>
                                                <hr/>
                                            </div>
                                            <div className="row mb-2">
                                                <div className="col col-sm-2 text-right input-group-sm">
                                                    <label htmlFor="username" className="col-form-label">{lang[4]}</label>
                                                </div>
                                                <div className="col col-sm-10 input-group-sm">
                                                    <input name="username" type="text" className="form-control" id="username" value={username} onChange={this.handleChange}/>
                                                </div>
                                            </div>
                                            <div className="row mb-2">
                                                <div className="col col-sm-2 text-right input-group-sm">
                                                    <label htmlFor="email" className="col-form-label">{lang[5]}</label>
                                                </div>
                                                <div className="col col-sm-10 input-group-sm">
                                                    <input name="email" type="email" className="form-control" id="email"  value={email} onChange={this.handleChange}/>
                                                </div>
                                            </div>
                                            <div className="row mb-2">
                                                <div className="col col-sm-2 text-right input-group-sm">
                                                    <label htmlFor="mobile" className="col-form-label">{lang[6]}</label>
                                                </div>
                                                <div className="col col-sm-10 input-group-sm">
                                                    <input name="mobile" type="text" className="form-control" id="mobile"  value={mobile} onChange={this.handleChange}/>
                                                </div>
                                            </div>
                                            <div className="row mb-2">
                                                <div className="col col-sm-2 text-right input-group-sm">
                                                    <label htmlFor="birthday" className="col-form-label">{lang[7]}</label>
                                                </div>
                                                <div className="col col-sm-10 input-group-sm">
                                                    <input name="birthday" type="date" className="form-control" id="birthday"  value={birthday} onChange={this.handleChange}/>
                                                </div>
                                            </div>
                                            <div className="row mb-2">
                                                <div className="col col-sm-2 text-right input-group-sm">
                                                    <label htmlFor="constellation" className="col-form-label">{lang[8]}</label>
                                                </div>
                                                <div className="col col-sm-10 input-group-sm">
                                                    <select name="constellation" className="form-control custom-select" id="constellation" value={constellation} onChange={this.handleChange}>
                                                        {constellation_array.map((one, index) => <option key={index} value={one.id}>{one.dict_value}</option> )}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="row mb-2">
                                                <div className="col col-sm-2 text-right input-group-sm">
                                                    <label htmlFor="marital" className="col-form-label">{lang[9]}</label>
                                                </div>
                                                <div className="col col-sm-10 input-group-sm">
                                                    <select name="marital" className="form-control custom-select" id="marital" value={marital} onChange={this.handleChange}>
                                                        {maritalStatus.map((one, index) => <option key={index} value={one.status_text}>{one.status_text}</option> )}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="row mb-2">
                                                <div className="col col-sm-2 text-right input-group-sm">
                                                    <label htmlFor="role" className="col-form-label">{lang[10]}</label>
                                                </div>
                                                <div className="col col-sm-10 input-group-sm">
                                                    <select name="role" className="form-control custom-select" id="role" value={role} onChange={this.handleChange}>
                                                        {roleList.map((one, index) => <option key={index} value={one.group_name}>{one.group_name}</option> )}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="row mb-3">
                                                <div className="col col-sm-2 text-right input-group-sm">
                                                    <label className="col-form-label">{lang[11]}</label>
                                                </div>
                                                <div className="col col-sm-10 input-group-sm">
                                                    <EmbeddedEditor 
                                                        content={this.state.desc}
                                                        getContent={this.getEditorContent}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="form-group col-md-6 mt-2">
                                    {/*Password **********************************************************************/}
                                    <div className="card bg-light rounded mb-3">
                                        <div className="card-body">
                                            <div className="mb-2">
                                                <h6 className="card-title mb-2">{lang[12]}</h6>
                                                <hr/>
                                            </div>
                                            <div className="row mb-2">
                                                <div className="col col-sm-2 text-right input-group-sm">
                                                    <label htmlFor="password" className="col-form-label">{lang[13]}</label>
                                                </div>
                                                <div className="col col-sm-10 input-group-sm">
                                                    <input name="password" type="password" className="form-control" id="password"  value={password} onChange={this.handleChange}/>
                                                </div>
                                            </div>
                                            <div className="row mb-2">
                                                <div className="col col-sm-2 text-right input-group-sm">
                                                    <label htmlFor="confirm" className="col-form-label">{lang[14]}</label>
                                                </div>
                                                <div className="col col-sm-10 input-group-sm">
                                                <input name="confirm" type="password" className="form-control" id="confirm"  value={confirm} onChange={this.handleChange}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/*Profile Image **********************************************************************/}
                                    <div className="card bg-light rounded">
                                        <div className="card-body">
                                            <div className="mb-2">
                                                <h6 className="card-title mb-2">{lang[15]}</h6>
                                                <hr/>
                                            </div>
                                            <div className="row">
                                                <div className="col col-sm-2 text-right input-group-sm">
                                                    <label htmlFor="image" className="col-form-label">{lang[16]}</label>
                                                </div>
                                                <div className="col col-sm-10 input-group-sm">
                                                    <input name="image" type="file" className="form-control mb-5" id="image" value={image} onChange={this.handleChange}/>
                                                    <div className="card border-secondary" style={{width: '130px',}}>
                                                        { image === ''? 
                                                            <img className="card-img-top" src="../../../images/default_user.png"  alt={'user icon'}/> :
                                                            <img className="card-img-top" src={imageUrl} alt={'user icon'}/> }
                                                    </div>
                                                </div>
                                            </div>
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

export default AddUser;