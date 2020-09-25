import React, {Component} from 'react';
import LANGUAGE from '../service/Language-data';

class TitleBar extends Component{
    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.TitleBar.cn;
        else lang=LANGUAGE.TitleBar.en;
        
        return(
            <div className="breadcrumbs">
                <div className="col-sm-4">
                    <div className="page-header float-left">
                        <div className="page-title">
                            <h1>{lang[0]}</h1>
                        </div>
                    </div>
                </div>
                <div className="col-sm-8">
                    <div className="page-header float-right">
                        <div className="page-title">
                            <ol className="breadcrumb text-right">
                                <li className="active">{lang[1]}</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default TitleBar;