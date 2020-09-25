import React, { Component } from 'react';
import LANGUAGE from '../../../service/Language-data';

class LogIn extends Component{
    handleChange=(e)=>{
        this.props.logInChange(e);        
    }

    handleSubmit=(e)=>{        
        this.props.logInSubmit(e)
    }  
    
    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.LogIn.cn;
        else lang=LANGUAGE.LogIn.en;

        return(
            <div className="card rounded">
                <div className="card-header">
                    <h3>{lang[0]}</h3>
                </div>
                <div className="card-body">
                    <div className=" col-md-6 offset-md-3">
                        <div className="card rounded">
                            <div className="card-header">
                                <h5>{lang[1]}</h5>
                            </div>
                            <div className="card-body">
                                <form onSubmit={this.handleSubmit}>
                                    <div className="form-group row">
                                        <label htmlFor="inputUsername" className="col-md-3 col-form-label">{lang[2]}</label>
                                        <div className="col-md-9" >
                                            <input type="text" className="form-control" name="logInName" id="inputUsername" onChange={this.handleChange} required/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label htmlFor="inputPassword" className="col-md-3 col-form-label">{lang[3]}</label>
                                        <div className="col-md-9">
                                            <input type="password" className="form-control" name="password" id="inputPassword" placeholder="Password" ref={input=>this.password = input} required/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <div className="col-md-12">
                                            <button type="submit" className="btn btn-primary col-md-12 rounded">{lang[4]}</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div> 
                </div>
            </div>
        );
    }
}

export default LogIn;