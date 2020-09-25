import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {Link} from 'react-router-dom';
import LANGUAGE from '../../../service/Language-data';
import apiRoot from '../../../config.api';

import SearchBar from '../../../service/components/SearchBar';
import PagingBar from '../../../service/components/PagingBar';

class DoctorCategories extends Component{
    state = {
        allMappingList: [],
        subjectList:[],
        searchContent:'',     // Accept the value of "change"; Used for search after the button is clicked.
        searchChange:'',      // Accept the value changed in "input".
        currentPage: 1,
        checkedArr: [],
        checkedIds: [],
        checkedAll: false
        };

    static propTypes={
        langState: PropTypes.string.isRequired
    };

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

    handleChecked=(e,i)=>{
        let {checkedArr} = this.state;
        checkedArr[i] = !checkedArr[i];

        let id = e.target.value;
        let ids = this.state.checkedIds;
        let index = ids.indexOf(+id);
        e.target.checked === true? ids.push(+id) : ids.splice(index,1);
        this.setState({ 
            checkedIds: ids,
            checkedArr 
        });
    }

    handleCheckedAll=(e)=>{
        const {checkedArr,subjectList } = this.state;
        let tempArr=[];
        let ids = [];
        if(e.target.checked){
            checkedArr.forEach(one=> tempArr.push(!one));
            subjectList.forEach((one, index) => { if(tempArr[index]) ids.push(+one.id)});
        }
        else{
            checkedArr.forEach(one=> tempArr.push(false));
        }
        this.setState({
            checkedArr : tempArr,
            checkedIds : ids,
            checkedAll : e.target.checked
        });
    }

    handleClickDelete=(e)=>{
        const {checkedIds, allMappingList} = this.state;
        const idsString=checkedIds.toString();

        const hasOneOnit = allMappingList.filter(one=>checkedIds.includes(one.doctor_categories_id));

        if(checkedIds.length===0){
            alert(`You did NOT select any item!`);
        }
        else{
            if(window.confirm(`Do you really want to delete No. ${idsString} ${checkedIds.length>1? 'categories':'category'}?`)){
                if(checkedIds.length===1 && hasOneOnit.length!==0){
                    alert(`There is at least one doctor under this category. You can NOT delete it.`);
                }
                else if(checkedIds.length>1 && hasOneOnit.length!==0){
                    alert(`There is at least one doctor under at least one of the categories you checked. You can NOT delete all of them.`);
                }
                else{
                    axios.put(apiRoot + "health/doctors/categories/delete", { checkedIds })
                        .then(res => {
                            alert(`You have deleted ${checkedIds.length>1? checkedIds.length +' categories':'an category'}.`);
                            axios.get(apiRoot + "health/doctors/categories")
                            .then((res) => {                   
                                this.setState({ subjectList: res.data });  
                            })
                            .catch((err) => {            
                                console.log("Getting attributes error in ProductAttributes component!");            
                            });
                        })
                        .catch(err=>{
                            console.log("Deleting attributes error in ProductAttributes component!");
                    });
                    let tempArr = [];
                    this.state.checkedArr.forEach(()=> tempArr.push(false));
                    this.setState({
                        checkedArr: tempArr,
                        checkedIds: [],
                        checkedAll: false
                    });
                    e.preventDefault();
                }
            }
        }
    }

    handleClickUpdate=(id)=>{
        this.props.clickUpdate(id);        
    }

    componentDidMount(){
        axios.get(apiRoot + "health/doctors/categories")
            .then((res) => {
                let checkedArr=[];
                res.data.forEach(one=>{
                    checkedArr.push( false )
                });
                this.setState({ checkedArr, subjectList: res.data });
            })
            .catch((err) => {            
                console.log("Getting attributes error in DoctorCategories component!");            
        });

        axios.get(apiRoot + "health/doctors")
            .then((res) => {
                this.setState({ allMappingList: res.data });
            })
            .catch((err) => {            
                console.log("Getting doctors error in DoctorCategories component!");            
        });
    }

    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.DoctorCategories.cn;
        else lang=LANGUAGE.DoctorCategories.en;

        const {subjectList, searchContent, currentPage} = this.state;

        const row=[];
        subjectList.forEach((one, index)=>{            
            if( (one.name.toUpperCase().indexOf(searchContent.toUpperCase())===-1)&&
                (one.language.toUpperCase().indexOf(searchContent.toUpperCase())===-1)){
                return;
            }
            row.push(
                <tr key={index} >
                    <td style={{verticalAlign: 'middle'}} className="text-center"><input type="checkbox" name="checkbox" checked={this.state.checkedArr[index]} value={one.id} onChange={(e)=>this.handleChecked(e, index)}/></td>
                    <td style={{verticalAlign: 'middle'}} className="text-center">{one.id}</td>
                    <td style={{verticalAlign: 'middle'}} >{one.name}</td>
                    <td style={{verticalAlign: 'middle'}} >
                        {(()=>{
                            switch(one.image.slice(0,4)){
                                case '':        return (<span>{'No Image'}</span>);
                                case 'http':    return (<img src={one.image} style={{height: '50px'}} alt={index}/>);
                                default:        return (<a href={apiRoot + 'display/image/file?file=' + one.image}>
                                                            <img src={apiRoot + 'display/image/file?file=' + one.image} style={{height: '50px'}} alt={index}/>
                                                        </a>)
                            }
                        })()}
                    </td>
                    <td style={{verticalAlign: 'middle'}} >{one.language}</td>
                    <td style={{verticalAlign: 'middle'}} className="text-center">
                        <Link to="/health/doctors/categories/update" ><button className="btn btn-success mr-2 btn-sm rounded" onClick={()=>this.handleClickUpdate(one.id)} title={lang[7]}><i className="fas fa-pencil-alt"></i></button></Link>
                    </td>
                </tr>
            );
        });

        const totalPages=Math.ceil(row.length/10);
        const onePage=row.reverse().slice((currentPage*10-10), (currentPage*10));

        return(
            <div className="container-fluid">
                <div className="card rounded">
                    <div className="card-header">
                        <span style={{fontSize: "1.4em"}}>{lang[0]}</span>
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
                            <div className="col">
                                <div className="btn-group float-right">
                                    <Link to='/health/doctors/categories/add' className="btn btn-primary btn-sm mr-2 rounded" title={lang[1]}><i className="fas fa-plus-square"></i></Link>
                                    <button type="button" className="btn btn-danger btn-sm rounded" onClick={this.handleClickDelete} title={lang[2]}><i className="fas fa-trash-alt"></i></button>
                               </div>
                            </div>
                        </div>
                        <div className="table-responsive rounded">
                            <table className="table table-hover table-bordered text-center">
                                <thead>
                                    <tr className="table-primary">
                                        <th scope="col" style={{width: "5%"}}><input checked={this.state.checkedAll} type="checkbox" onChange={this.handleCheckedAll}/></th>
                                        <th scope="col" style={{width: "10%"}}>#</th>
                                        <th scope="col" style={{width: "30%"}}>{lang[3]}</th>
                                        <th scope="col" style={{width: "30%"}}>{lang[4]}</th>
                                        <th scope="col" style={{width: "20%"}}>{lang[5]}</th>
                                        <th scope="col" style={{width: "5%"}}>{lang[6]}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {onePage}
                                </tbody>
                            </table>
                        </div>

                        <PagingBar 
                            totalPages={totalPages}                     
                            currentPage={this.state.currentPage}
                            pageChange={this.handlePageChange} 
                            />
                    </div>
                </div>            
            </div>
        );
    }
}

export default DoctorCategories;