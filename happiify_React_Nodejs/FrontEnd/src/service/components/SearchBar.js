import React, {Component} from 'react';
import LANGUAGE from '../Language-data';

class SearchBar extends Component{
    
    handleChange=(e)=>{
        this.props.searchContent(e);
    }
    
    handleSubmit=(e)=>{
        this.props.searchSubmit(e);
    }
    
    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.SearchBar.cn;
        else lang=LANGUAGE.SearchBar.en;

        return(
            <div className="input-group input-group-sm mb-3">
                <input className="form-control mr-2 rounded" type="text" placeholder="Search...." name="content" onChange={this.handleChange}/>
                <div className="input-group-append">
                    <button className="btn btn-success rounded" type="button" onClick={this.handleSubmit} title={lang[0]}><i className="fas fa-search"></i></button>
                </div>
            </div>
        );
    }
}

export default SearchBar;