import React, {Component} from 'react';
import LANGUAGE from '../../../Language-data';

class Alert extends Component{
    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.Alert.cn;
        else lang=LANGUAGE.Alert.en;

        return(            
            <div className="col-sm-12">
                <div className="alert  alert-success alert-dismissible fade show" role="alert">
                    <span className="badge badge-pill badge-success">{lang[0]}</span> {lang[1]}
                        <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                </div>
            </div>
        );
    }
}

export default Alert;