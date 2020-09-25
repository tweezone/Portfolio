import React, {Component} from 'react';

import Header from './Header';
//import TitleBar from './TitleBar';
import Content from './content/Content';

class RightPanel extends Component{

    handleLangCN=()=>{
        this.props.appHandleLangCN();
    }
    handleLangEN=()=>{
        this.props.appHandleLangEN();
    }

    handleLogInChange=(e)=>{
        this.props.logInChange(e);
    }

    handleLogInSubmit=(e)=>{
        this.props.logInSubmit(e);
    }

    handleLogOutClick=()=>{
        this.props.logOutClick();
    }

    render(){
        return(
            <div id="right-panel" className="right-panel" style={{width: "100%"}}>
                <Header 
                    langCN={this.handleLangCN}
                    langEN={this.handleLangEN}
                    logInName={this.props.logInName}
                    langState={this.props.langState}
                    authorization={this.props.authorization}
                    logOutClick={this.handleLogOutClick}
                />
                {/*<TitleBar 
                    langData={this.props.langData}
                    langState={this.props.langState}
                />*/}                
                <Content                    
                    langState={this.props.langState}
                    logInChange={this.handleLogInChange}
                    logInSubmite={this.handleLogInSubmit}
                    authorization={this.props.authorization}
                    logInName={this.props.logInName}

                    permissions={this.props.permissions}
                />            
            </div>
        );
    }
}

export default RightPanel;