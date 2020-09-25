import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import LANGUAGE from '../../../service/Language-data';
import apiRoot from '../../../config.api';

import VideoTable from './VideoTable';
import SearchBar from '../../../service/components/SearchBar';
import PagingBar from '../../../service/components/PagingBar';

class VideoManagement extends Component{
    constructor(props){
        super(props);
        this.state={
            videoList:[],
            searchContent:'',     // Accept the value of "change"; Used for search after the button is clicked.
            searchChange:'',      // Accept the value changed in "input".
            currentPage: 1
        }
    }
    
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
        if(window.confirm(`Do you really want to delete No. ${id} video?`)){
            axios.put(apiRoot + "videos/delete", {id})
                .then(res => {
                    alert("You have deleted a video.");
                    axios.get(apiRoot + "videos")
                    .then((res) => {     
                        this.setState({ videoList: res.data });
                    })
                    .catch((err) => {            
                        console.log("Getting videos error in VideoManagement component!");            
                    });
                })
                .catch(err=>{
                    console.log("Deleting videos error in VideoManagement component!");
            });
            e.preventDefault();
        }
    }

    handleClickUpdate=(id)=>{
        this.props.clickUpdate(id);        
    }

    componentDidMount(){
        axios.get(apiRoot + "videos")
            .then((res) => {            
                this.setState({ videoList: res.data });  
            })
            .catch((err) => {            
                console.log("Getting videos error in VideoManagement component!");            
            });
    }
    
    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.VideoManagement.cn;
        else lang=LANGUAGE.VideoManagement.en;

        const { permissions } = this.props;

        const row=[];
        this.state.videoList.forEach((one, index)=>{
            if( (one.username.toUpperCase().indexOf(this.state.searchContent.toUpperCase())===-1)&&
                (one.category_name.toUpperCase().indexOf(this.state.searchContent.toUpperCase())===-1)&&
                (one.video_title.toUpperCase().indexOf(this.state.searchContent.toUpperCase())===-1)&&
                (one.video_description.toUpperCase().indexOf(this.state.searchContent.toUpperCase())===-1)){
                return;
            }
            row.push(
                <tr key={index}>
                    <th style={{verticalAlign: 'middle'}} scope="row">{one.id}</th>
                    <td style={{verticalAlign: 'middle'}} >{one.username}</td>
                    <td style={{verticalAlign: 'middle'}} >{one.category_name}</td>
                    <td style={{verticalAlign: 'middle'}} >{one.video_title}</td>
                    <td style={{verticalAlign: 'middle'}} >
                        {(()=>{
                            switch(one.cover_image_path.slice(0,4)){
                                case '':        return (<span>{'No Image'}</span>);
                                case 'http':    return (<img src={one.cover_image_path} style={{height: '50px'}} alt={index}/>);
                                default:        return (<a href={apiRoot + 'display/image/file?file=' + one.cover_image_path}>
                                                            <img src={apiRoot + 'display/image/file?file=' + one.cover_image_path} style={{height: '50px'}} alt={index}/>
                                                        </a>)
                            }
                        })()}
                    </td>
                    <td style={{verticalAlign: 'middle'}} >
                        {(()=>{
                            switch(one.video_path.slice(0,4)){
                                case '':        return (<span>{'No Video'}</span>);
                                case 'http':    return (<a href={one.video_path}>{one.video_path}</a>);
                                default:        return (<a href={apiRoot + 'display/video/file?file=' + one.video_path} >{one.video_path}</a>)
                            }
                        })()}
                    </td>
                    <td style={{verticalAlign: 'middle'}} >{one.time_length}</td>
                    {
                        permissions[2][3].value || permissions[2][4].value?
                        <td style={{verticalAlign: 'middle'}} >
                            <div className="btn-group">
                                { 
                                    permissions[2][3].value? 
                                    <Link to="/videos/update" className="btn btn-success btn-sm mr-2 rounded" onClick={()=>this.handleClickUpdate(one.id)} title={lang[2]}><i className="fas fa-pencil-alt"></i></Link>
                                    : null
                                }
                                {
                                    permissions[2][4].value?
                                    <button type="button" className="btn btn-danger btn-sm rounded" onClick={(e)=>this.handleClickDelete(e, one.id)} title={lang[3]}><i className="fas fa-trash-alt"></i></button>
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
                                permissions[2][2].value?
                                <div className="col">
                                    <div className="float-right">
                                        <Link to='/videos/add' className="btn btn-primary btn-sm rounded" title={lang[1]}><i className="fas fa-plus-square"></i></Link> 
                                    </div>
                                </div>: null
                            }
                        </div>                
                        <VideoTable
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

export default VideoManagement;