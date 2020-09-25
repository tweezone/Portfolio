import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {Link} from 'react-router-dom';
import LANGUAGE from '../../../service/Language-data';
import apiRoot from '../../../config.api';

import EmbeddedEditor from '../../../service/components/EmbeddedEditor';

class UpdateUser extends Component{
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
        imageUrl: '',  // For displaying the image in Front-End.
        points: 0,
        follows: 0,
        fans: 0,
        coins: 0
    }

    static propTypes={
        langState: PropTypes.string.isRequired,
        logInName: PropTypes.string.isRequired,
        userId: PropTypes.number.isRequired
    };

    handleChange=(e)=>{
        this.setState({
            [e.target.name]: e.target.value
        });
        const imageFile = document.getElementById('image')
        if(imageFile.files[0]){
            const imageUrl = window.URL.createObjectURL(imageFile.files[0]);
            this.setState({ imageUrl })
        }
    }

    getEditorContent=(content)=>{
        this.setState({ desc: content });
    }

    handleClickSave=(e)=>{
        const { constellation_array, maritalStatus, roleList, username, email, mobile, birthday, marital, role, desc, password, confirm, image, constellation } = this.state;
        const { userId } = this.props;

        axios.get(apiRoot + "users")
            .then((res) => {
                const oldName = res.data.find(one=>one.id === userId).username;
                const oldEmail = res.data.find(one=>one.id === userId).email;
                const oldMobile = res.data.find(one=>one.id === userId).mobile;
                const haveOneUser = res.data.find(one=> one.username === username);
                const haveOneEmail = res.data.find(one=> one.email === email);
                const haveOneMobile = res.data.find(one=> one.mobile === mobile);
                if(password !== confirm){
                    alert(`The password didn't match. Try again, please.`);
                }
                else if(username === ''){
                    alert(`You must enter a username. Try again, please.`);
                }
                else if(username !== oldName && haveOneUser){
                    alert(`The username which you changed has been used. Try again, please.`);
                }
                else if(email === ''){
                    alert(`You must enter an email address. Try again, please.`);
                }
                else if(email !== oldEmail && haveOneEmail){
                    alert(`The email address which you changed has been used. Try again, please.`);
                }  
                else if(mobile === ''){
                        alert(`You must enter an mobile number. Try again, please.`);
                }
                else if(mobile !== oldMobile && haveOneMobile){
                    alert(`The mobile number which you changed has been used. Try again, please.`);
                }
                else{
                    const formData = new FormData();
                    formData.append('userId', userId);
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
        
                    axios.put(apiRoot + "users/update", formData, { 
                            headers:{'Content-Type':'multipart/form-data'}
                        })
                        .then(res => {
                            alert("A user was updated!");
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
                                imageUrl: '',
                                points: 0,
                                follows: 0,
                                fans: 0,
                                coins: 0
                            });
                        })
                        .catch(err=>{
                            console.log("updating a user error in UpdateUser component!");
                    });
                    e.preventDefault();
                }
            })
            .catch((err) => {           
                console.log("Getting the user error in UpdateUser component!");            
        });
    }

    componentDidMount(){
        const { userId } = this.props;
        axios.get(apiRoot + "users/marriage")
            .then((res) => {          
                this.setState({ 
                    maritalStatus: res.data,
                    marital: res.data[2].status_text
                });
            })
            .catch((err) => {            
                console.log("Getting marital status error in UpdateUser component!");            
        });        
        
        axios.get(apiRoot + "users/roles")
            .then((res) => {          
                this.setState({ 
                    roleList: res.data,
                    role: res.data[0].group_name
                });
            })
            .catch((err) => {            
                console.log("Getting roles error in UpdateUser component!");            
        });
        
        axios.get(apiRoot + "users")
            .then((res) => {
                const currentOne = res.data.find(one=>one.id === userId);

                let birth = currentOne.birthday;
                if(birth === null){ birth = '' }
                else if(birth.includes('1900-01-01')){ birth = ''; }
                else{ birth = currentOne.birthday.slice(0, currentOne.birthday.indexOf('T')) }

                const currentMarital = this.state.maritalStatus.find(one=>one.id === +currentOne.marriage_status_id);

                let desc = currentOne.brief_description;
                if( desc === null){ desc = ''; }

                this.setState({
                    subjectList: res.data,
                    username: currentOne.username,
                    email: currentOne.email,
                    mobile: currentOne.mobile,
                    birthday: birth,
                    constellation: currentOne.constellation_id,
                    marital: currentMarital.status_text,
                    role: currentOne.group_name,
                    desc,
                    image: currentOne.portrait,
                    points: currentOne.total_points,
                    follows: currentOne.total_follows,
                    fans: currentOne.total_fans,
                    coins: currentOne.total_coins
                });
            })
            .catch((err) => {           
                console.log("Getting the user error in UpdateUser component!");            
        });
        axios.get(apiRoot + "dictionary")
            .then((res) => { 
                const constellation_array = res.data.filter(one=>one.dict_key === '星座')          
                this.setState({ constellation_array });
            })
            .catch((err) => {            
                console.log("Getting roles error in AddUser component!");            
        });
    }

    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.UpdateUser.cn;
        else lang=LANGUAGE.UpdateUser.en;

        const { constellation_array, maritalStatus, roleList, username, email, mobile, birthday, constellation, password, confirm, imageUrl, points, follows, fans, coins } = this.state;
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
                                                    <select name="marital" className="form-control custom-select" id="marital" value={this.state.marital} onChange={this.handleChange}>
                                                        {maritalStatus.map((one, index) => <option key={index} value={one.status_text}>{one.status_text}</option> )}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="row mb-2">
                                                <div className="col col-sm-2 text-right input-group-sm">
                                                    <label htmlFor="role" className="col-form-label">{lang[10]}</label>
                                                </div>
                                                <div className="col col-sm-10 input-group-sm">
                                                    <select name="role" className="form-control custom-select" id="role" value={this.state.role} onChange={this.handleChange}>
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
                                    <div className="card bg-light rounded mb-3">
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
                                                    <input name="image" type="file" className="form-control mb-5" id="image" onChange={this.handleChange}/>
                                                        <div className="card border-secondary" style={{width: '130px', height: '130px'}}>
                                                        {imageUrl !== '' ? 
                                                            <img className="card-img-top" src={this.state.imageUrl} alt={'user icon'}/> :
                                                            (()=>{
                                                                switch(this.state.image.slice(0,4)){
                                                                    case '':        return (<img className="card-img-top" src="../../../images/default_user.png"  alt={'user icon'}/>);
                                                                    case 'http':    return (<img src={this.state.image} alt={123}/>);
                                                                    default:        return (<a href={apiRoot + 'display/image/file?file=' + this.state.image}>
                                                                                                <img src={apiRoot + 'display/image/file?file=' + this.state.image} alt={123}/>
                                                                                            </a>)
                                                                }
                                                            })()}
                                                        </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/*Other Details **********************************************************************/}
                                    <div className="card bg-light rounded">
                                        <div className="card-body">
                                            <div className="mb-2">
                                                <h6 className="card-title mb-2">{lang[17]}</h6>
                                                <hr/>
                                            </div>
                                            <div className="row mb-2">
                                                <div className="col col-sm-2 text-right input-group-sm">
                                                    <label htmlFor="points" className="col-form-label">{lang[18]}</label>
                                                </div>
                                                <div className="col col-sm-10 input-group-sm">
                                                    <input name="points" type="text" className="form-control" id="points" value={points} disabled/>
                                                </div>
                                            </div>
                                            <div className="row mb-2">
                                                <div className="col col-sm-2 text-right input-group-sm">
                                                    <label htmlFor="follows" className="col-form-label">{lang[19]}</label>
                                                </div>
                                                <div className="col col-sm-10 input-group-sm">
                                                    <input name="follows" type="text" className="form-control" id="follows"  value={follows} disabled/>
                                                </div>
                                            </div>
                                            <div className="row mb-2">
                                                <div className="col col-sm-2 text-right input-group-sm">
                                                    <label htmlFor="fans" className="col-form-label">{lang[20]}</label>
                                                </div>
                                                <div className="col col-sm-10 input-group-sm">
                                                    <input name="fans" type="text" className="form-control" id="fans"  value={fans} disabled/>
                                                </div>
                                            </div>
                                            <div className="row mb-2">
                                                <div className="col col-sm-2 text-right input-group-sm">
                                                    <label htmlFor="coins" className="col-form-label">{lang[21]}</label>
                                                </div>
                                                <div className="col col-sm-10 input-group-sm">
                                                    <input name="coins" type="text" className="form-control" id="coins"  value={coins} disabled/>
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

export default UpdateUser;