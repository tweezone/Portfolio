import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
//import PropTypes from 'prop-types';
import LANGUAGE from '../../../service/Language-data';
import apiRoot from '../../../config.api';

import DocTable from './DocTable';
import SearchBar from '../../../service/components/SearchBar';
import PagingBar from '../../../service/components/PagingBar';

class DocManagement extends Component{
    state={
            docList:[],
            searchContent:'',     // Accept the value of "change"; Used for search after the button is clicked.
            searchChange:'',      // Accept the value changed in "input".
            currentPage: 1
        };
    
    /*static propTypes={
        langState: PropTypes.string.isRequired,
        logInName: PropTypes.string.isRequired,
        clickUpdate: PropTypes.func.isRequired
    }*/
    
    handleSearchContent=(e)=>{
        this.setState({
            searchChange: e.target.value
        });
    };
    
    handleSearchSubmit=(e)=>{
        this.setState({
            searchContent: this.state.searchChange,
            currentPage: 1,        
        });
        e.preventDefault();
    }

    handlePageChange=(e)=>{
        this.setState({
            currentPage: +e.target.value
        });
    }

    handleClickDelete=(e, id)=>{
        if(window.confirm(`Do you really want to delete No. ${id} document?`)){
            axios.put(apiRoot + "documents/delete", {id})
                .then(res => {
                    alert("You have deleted a document.");
                    axios.get(apiRoot + "documents")
                    .then((res) => {     
                        this.setState({ docList: res.data });
                    })
                    .catch((err) => {            
                        console.log("Getting documents error in DocManagement component!");            
                    });
                })
                .catch(err=>{
                    console.log("Deleting documents error in DocManagement component!");
            });
            e.preventDefault();
        }
    }

    handleClickUpdate=(id)=>{
        this.props.clickUpdate(id);
    }

    componentDidMount(){
        axios.get(apiRoot + "documents")
            .then((res) => {            
                this.setState({ docList: res.data });  
            })
            .catch((err) => {            
                console.log("Getting documents error!");            
            });
    }
    
    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.DocManagement.cn;
        else lang=LANGUAGE.DocManagement.en;

        const {docList, searchContent}=this.state;
        const { permissions } = this.props;

        const row=[];
        docList.forEach((doc, index)=>{
            if( (doc.categories_name.toUpperCase().indexOf(searchContent.toUpperCase())===-1)&&
                (doc.username.toUpperCase().indexOf(searchContent.toUpperCase())===-1)&&
                (doc.post_title.toUpperCase().indexOf(searchContent.toUpperCase())===-1)){
                return;
            }
            row.push(
                <tr key={index}>
                    <th style={{verticalAlign: 'middle'}} scope="row">{doc.id}</th>
                    <td style={{verticalAlign: 'middle'}} >{doc.categories_name}</td>
                    <td style={{verticalAlign: 'middle'}} >{doc.username}</td>
                    <td style={{verticalAlign: 'middle'}} >{doc.post_title}</td>
                    <td style={{verticalAlign: 'middle'}} >
                        {(()=>{
                            switch(doc.feature_image_url.slice(0,4)){
                                case '':        return (<span>{'No Image'}</span>);
                                case 'http':    return (<img src={doc.feature_image_url} style={{height: '50px'}} alt={index}/>);
                                default:        return (<a href={apiRoot + 'display/image/file?file=' + doc.feature_image_url}>
                                                            <img src={apiRoot + 'display/image/file?file=' + doc.feature_image_url} style={{height: '50px'}} alt={index}/>
                                                        </a>)
                            }
                        })()}
                    </td>
                    <td style={{verticalAlign: 'middle'}} >{doc.create_time}</td>
                    <td style={{verticalAlign: 'middle'}} >{doc.modify_time}</td>
                    {
                        permissions[1][3].value || permissions[1][4].value?
                        <td style={{verticalAlign: 'middle'}} >
                            <div className="btn-group">
                                { 
                                    permissions[1][3].value? 
                                    <Link to="/documents/update" className="btn btn-success mr-2 btn-sm rounded" onClick={()=>this.handleClickUpdate(doc.id)}  title={lang[2]}><i className="fas fa-pencil-alt"></i></Link>
                                    : null
                                }
                                {
                                    permissions[1][4].value?
                                    <button type="button" className="btn btn-danger btn-sm rounded" onClick={(e)=>this.handleClickDelete(e,doc.id)}  title={lang[3]}><i className="fas fa-trash-alt" ></i></button>
                                    : null
                                }
                            </div>
                        </td> : null
                    }
                </tr>
            );
        });

        const totalPages=Math.ceil(row.length/10);
        const onePage=row.reverse().slice((this.state.currentPage*10-10), (this.state.currentPage*10));

        return(  
            <div className="container-fluid">
                <div className="card rounded">
                    <div className="card-header">
                        <h5>{lang[0]}</h5>
                    </div>
                    <div className="card-body">
                        <div className="row">
                            <div className="col">
                                <div className="float-left">
                                    <SearchBar 
                                        langState={this.props.langState}
                                        searchContent={this.handleSearchContent}
                                        searchSubmit={this.handleSearchSubmit} />
                                </div>
                            </div>
                            {
                                permissions[1][2].value?
                                <div className="col">
                                    <div className="float-right">
                                        <Link to='/documents/add' className="btn btn-primary btn-sm rounded" title={lang[1]} ><i className="fas fa-plus-square"></i></Link> 
                                    </div>
                                </div>: null
                            }
                        </div>
                        <DocTable
                            langState={this.props.langState}
                            onePage={onePage}
                            permissions={this.props.permissions}/>
                        <PagingBar 
                            totalPages={totalPages}                     
                            currentPage={this.state.currentPage}
                            pageChange={this.handlePageChange}/>
                    </div>
                </div>      
            </div>
        );
    }
}

export default DocManagement;