import React, {Component} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import LANGUAGE from '../../../service/Language-data';
import apiRoot from '../../../config.api';

import SearchBar from '../../../service/components/SearchBar';
import PagingBar from '../../../service/components/PagingBar';

class LessonComments extends Component{
    state={
            commentList:[],
            searchContent:'',     // Accept the value of "change"; Used for search after the button is clicked.
            searchChange:'',      // Accept the value changed in "input".
            currentPage: 1
        };
    
    static propTypes={
        langState: PropTypes.string.isRequired
    };
    
    handleCommentSearchContent=(e)=>{
        this.setState({
            searchChange: e.target.value
        });
    };
    
    handleCommentSearchSubmit=(e)=>{
        this.setState({
            searchContent: this.state.searchChange,
            currentPage: 1,        
        });
        e.preventDefault();
    }

    handleCommentPageChange=(e)=>{
        this.setState({
            currentPage: +e.target.value
        });
    }

    handleClickDelete=(e)=>{
        if(window.confirm(`Do you really want to delete No.${e.target.value} comment?`)){
            axios.put(apiRoot + "lessons/comments/delete", {id: e.target.value})
                .then(res => {
                    axios.get(apiRoot + "lessons/comments")
                    .then((res) => {            
                        this.setState({ commentList: res.data });  
                    })
                    .catch((err) => {            
                        console.log("Getting comments error in LessonComments component!");            
                    });
                })
                .catch(err=>{
                    console.log("Deleting comments error in LessonComments component!");
            });
        }
    }

    componentDidMount(){
        axios.get(apiRoot + "lessons/comments")
            .then((res) => {            
                this.setState({ commentList: res.data });  
            })
            .catch((err) => {            
                console.log("Getting comments error in LessonComments component!");            
            });
    }
    
    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.LessonComments.cn;
        else lang=LANGUAGE.LessonComments.en;

        const {commentList, searchContent, currentPage} = this.state;
        const row=[];
        let key=0;
        commentList.forEach((one)=>{
            if( (one.title.toUpperCase().indexOf(searchContent.toUpperCase())===-1) && 
                (one.username.toUpperCase().indexOf(searchContent.toUpperCase())===-1) &&
                (one.comments.toUpperCase().indexOf(searchContent.toUpperCase())===-1)) {
                return;
            }
            row.push(
                <tr key={key}>
                    <th scope="row">{one.id}</th>
                    <td>{one.username}</td>
                    <td>{one.title}</td>
                    <td>{one.comments}</td>
                    <td>{one.create_time}</td>
                    <td >                        
                        <button className="btn btn-outline-danger btn-sm rounded" value={one.id} onClick={this.handleClickDelete}>{lang[7]}</button>
                    </td>
                </tr>
            );
            key++;
        });

        const totalPages=Math.ceil(row.length/10);
        const onePage=row.reverse().slice((currentPage*10-10), (currentPage*10));

        return(  
            <div className="container">
                <div className="card rounded">
                    <div className="card-header">
                        <h5>{lang[0]}</h5>
                    </div>
                    <div className="card-body">
                        <SearchBar
                            langState={this.props.langState}
                            searchContent={this.handleCommentSearchContent}
                            searchSubmit={this.handleCommentSearchSubmit}                     
                        />
                        <div className="table-responsive rounded">
                            <table className="table table-hover">
                                <thead className="thead-dark ">
                                    <tr>
                                        <th scope="col" style={{width:"5%"}}>{lang[1]}</th>
                                        <th scope="col" style={{width:"10%"}}>{lang[2]}</th>
                                        <th scope="col" style={{width:"20%"}}>{lang[3]}</th>
                                        <th scope="col" style={{width:"40%"}}>{lang[4]}</th>
                                        <th scope="col" style={{width:"20%"}}>{lang[5]}</th>
                                        <th scope="col" style={{width:"5%"}}>{lang[6]}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {onePage}
                                </tbody>
                            </table>                
                        </div>
                        <PagingBar 
                            totalPages={totalPages}                     
                            currentPage={currentPage}
                            pageChange={this.handleCommentPageChange}
                        />
                    </div>
                </div>                
            </div>
        );
    }
}

export default LessonComments;