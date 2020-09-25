import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {Link} from 'react-router-dom';
import LANGUAGE from '../../../service/Language-data';
import apiRoot from '../../../config.api';

import SearchBar from '../../../service/components/SearchBar';
import PagingBar from '../../../service/components/PagingBar';

class ProductAttributes extends Component{
    state = {
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
        const { checkedArr,subjectList } = this.state;
        let tempArr=[];
        let ids = [];
        if(e.target.checked){
            checkedArr.forEach(one=> tempArr.push(!one));
            subjectList.forEach((one, index) => { if(tempArr[index]) ids.push(+one.products_options_values_to_products_options_id)});
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
        const {checkedIds} = this.state;
        const idsString=checkedIds.toString();
        if(checkedIds.length===0){
            alert(`You did NOT select any item!`);
        }
        else{
            if(window.confirm(`Do you really want to delete No. ${idsString} ${checkedIds.length>1? 'attributes':'attribute'}?`)){
                axios.put(apiRoot + "products/attributes/delete", {checkedIds:this.state.checkedIds})
                    .then(res => {
                        alert(`You have deleted ${checkedIds.length>1? checkedIds.length +' attributes':'an attribute'}.`);
                        axios.get(apiRoot + "products/attributes")
                            .then((res) => {                   
                                this.setState({ subjectList: res.data }); 
                                let tempArr = [];
                                this.state.checkedArr.forEach(()=> tempArr.push(false));
                                this.setState({
                                    checkedArr: tempArr,
                                    checkedIds: [],
                                    checkedAll: false
                                }); 
                            })
                            .catch((err) => {
                                console.log("[Error] - GET /products/attributes - at ProductAttributes component!");
                                console.log(err);            
                        });
                    })
                    .catch(err=>{
                        console.log("[Error] - PUT /products/attributes/delete - at ProductAttributes component!");
                        console.log(err);
                });
                e.preventDefault();
            }
        }
    }

    handleClickUpdate=(id)=>{
        this.props.clickUpdate(id);        
    }

    componentDidMount(){
        axios.get(apiRoot + "products/attributes")
            .then((res) => {
                let checkedArr=[];
                res.data.forEach(one=>{
                    checkedArr.push( false )
                });
                this.setState({ checkedArr, subjectList: res.data });
            })
            .catch((err) => {
                console.log("[Error] - GET /products/attributes - at ProductAttributes component!");
                console.log(err);          
        });
    }

    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.ProductAttributes.cn;
        else lang=LANGUAGE.ProductAttributes.en;

        const {subjectList, searchContent, currentPage} = this.state;

        const row=[];
        subjectList.forEach((one, index)=>{            
            if( (one.products_options_name.toUpperCase().indexOf(searchContent.toUpperCase())===-1)&&
                (one.products_options_values_name.toUpperCase().indexOf(searchContent.toUpperCase())===-1)){
                return;
            }
            row.push(
                <tr key={index} >
                    <td style={{verticalAlign: 'middle'}} className="text-center"><input type="checkbox" name="checkbox" checked={this.state.checkedArr[index]} value={one.products_options_values_to_products_options_id} onChange={(e)=>this.handleChecked(e, index)}/></td>
                    <td style={{verticalAlign: 'middle'}} className="text-center">{one.products_options_values_to_products_options_id}</td>
                    <td style={{verticalAlign: 'middle'}} >{one.products_options_values_name}</td>
                    <td style={{verticalAlign: 'middle'}} >{one.products_options_name}</td>
                    <td style={{verticalAlign: 'middle'}} className="text-center">
                        <Link to="/products/attributes/update" className="btn btn-success mr-2 btn-sm rounded" onClick={()=>this.handleClickUpdate(one.products_options_values_to_products_options_id)} title={lang[6]}><i className="fas fa-pencil-alt"></i></Link>
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
                                    <Link to='/products/attributes/add' className="btn btn-primary btn-sm rounded mr-2" title={lang[1]}><i className="fas fa-plus-square"></i></Link>
                                    <button type="button" className="btn btn-danger btn-sm rounded" onClick={this.handleClickDelete} title={lang[2]}><i className="fas fa-trash-alt"></i></button>
                                </div>
                            </div>
                        </div>
                        <div className="table-responsive rounded">
                            <table className="table table-hover table-bordered">
                                <thead>
                                    <tr className="table-primary">
                                        <th scope="col" style={{width: "5%"}} className="text-center"><input checked={this.state.checkedAll} type="checkbox" onChange={this.handleCheckedAll}/></th>
                                        <th scope="col" style={{width: "5%"}} className="text-center">#</th>
                                        <th scope="col" style={{width: "45%"}}>{lang[3]}</th>
                                        <th scope="col" style={{width: "40%"}}>{lang[4]}</th>
                                        <th scope="col" style={{width: "5%"}} className="text-center">{lang[5]}</th>
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

export default ProductAttributes;