import React, { Component } from 'react';
import axios from 'axios';
import apiRoot from './config.api';

import {getPermissions} from './service/permission';

import LeftPanel from './left-panel/LeftPanel';
import RightPanel from './right-panel/RightPanel';

class App extends Component {
  constructor(props){
    super(props);
    this.state={
      langState: 'cn',
      logInName: '',
      authorization: false,
      permissionsIds: [],
    };
  }
  handleClickCN=()=>{    
    this.setState({
      langState:'cn'
    });
    sessionStorage.setItem('langState', 'cn');
  }
  handleClickEN=()=>{
    this.setState({
      langState:'en'
    });
    sessionStorage.setItem('langState', 'en');
  }

  handleLogInChange=(e)=>{    
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleLogInSubmit=(e)=>{
    const { logInName } = this.state;
    const password = document.getElementById("inputPassword").value

    axios.get(apiRoot + "users")
      .then((res) => { 
          const userList = res.data;
          const user=userList.find(one=>one.username === logInName);
          if(userList.length === 0){
            alert("Sorry, the system is very busy, please log in later.");
          }
          else if(user === undefined){
            alert("You input a wrong username. Please try again.");
          }
          else{
            axios.post(apiRoot, {
              username: logInName,
              password
            })
              .then((res) => {
                if(res.data!=="Success"){
                  alert("You input a wrong password. Please try again.")
                }
                else{
                  sessionStorage.setItem("authorization", true); 
                  sessionStorage.setItem("logInName", logInName);
                  const roleId = userList.find(one=> one.username === logInName).usergroups_id;
                  axios.get(apiRoot + "users/groups_permissions")
                    .then((res) => {
                      const permissions = res.data.filter(one=> one.user_group_id === +roleId);
                      let permissionsIds = [];
                      permissions.forEach(one=>{
                          permissionsIds.push(one.permissions_id);
                      });
                      sessionStorage.setItem("permissionsIds", permissionsIds);      
                      this.setState({
                        authorization: sessionStorage.getItem("authorization"),     // Note: Here, get the value whose type is string. That is to say that the value is "true".
                        permissionsIds: sessionStorage.getItem("permissionsIds").split(',')
                      }); 
                    })
                    .catch((err) => {
                      console.log("[Error] - GET /users/groups_permissions - at App component!");
                      console.log(err); 
                  });
                }
              })
              .catch((err) => {
                console.log("[Error] - GET / - at App component!");
                console.log(err);            
            });
          }
      })
      .catch((err) => {
        console.log("[Error] - GET /users - at App component!");
        console.log(err);           
    });
    e.preventDefault(); 
  }

  handleLogOutClick=()=>{
    this.setState({
      langState:'cn',
      logInName: '',
      authorization: false,
      permissionsIds: []
    });
    sessionStorage.clear();
  }

  /*
  getStartingTime=()=>{
    let lastTime = new Date().getTime();
    sessionStorage.setItem("lastTime", lastTime);
  }

  handleTimeOut=()=>{
    const timeOut = 10*60*1000;
    let currentTime = new Date().getTime();
    const lastTime = sessionStorage.getItem("lastTime") === null? 0 : +sessionStorage.getItem("lastTime");
    if(currentTime - lastTime > timeOut){
      if(this.state.authorization === "true"){
        sessionStorage.clear();
        alert("Sorry, time out, please log in again.");
        this.setState({
          langState:'cn',
          logInName: '',
          authorization: false,
          permissionsIds: []
        });
      }
    }
  }
  //*/

  componentDidMount(){
    const langState = sessionStorage.getItem("langState") === null? 'cn':sessionStorage.getItem("langState");
    const authorization = sessionStorage.getItem("authorization") === null? 'false':sessionStorage.getItem("authorization");
    const logInName = sessionStorage.getItem("logInName") === null? '':sessionStorage.getItem("logInName");
    const permissionsIds = sessionStorage.getItem("permissionsIds") === null? [] : sessionStorage.getItem("permissionsIds").split(',')
      
    this.setState({
      langState,
      authorization,
      logInName,
      permissionsIds
    });
  }
  
  render() {
    //window.setInterval(this.handleTimeOut, 1000);
    const { permissionsIds } = this.state;
    const perms =  getPermissions(permissionsIds);
    return (
      <div /*onMouseOver={this.getStartingTime}*/>
        <LeftPanel
          langState={this.state.langState}
          authorization={this.state.authorization}
          logOutClick={this.handleLogOutClick}
          permissions={perms}
        />
        <RightPanel       
          appHandleLangCN={this.handleClickCN} 
          appHandleLangEN={this.handleClickEN}
          langState={this.state.langState}

          logInChange={this.handleLogInChange}
          logInSubmit={this.handleLogInSubmit}
          logOutClick={this.handleLogOutClick}
          authorization={this.state.authorization}
          logInName={this.state.logInName}
          permissions={perms}
        />
      </div>
    );
  }
}

export default App;
