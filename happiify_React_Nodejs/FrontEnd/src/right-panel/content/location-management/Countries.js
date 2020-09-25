import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import LANGUAGE from '../../../service/Language-data';
import apiRoot from '../../../config.api';

import SearchBar from '../../../service/components/SearchBar';
import PagingBar from '../../../service/components/PagingBar';

class Countries extends Component{
    state={
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

    handleChecked=(e, i, enabled)=>{
        let {checkedArr} = this.state;
        checkedArr[i] = !checkedArr[i];

        let id = e.target.value;
        let ids = this.state.checkedIds;
        let index_id = ids.indexOf(+id);
        e.target.checked === true? ids.push(+id) : ids.splice(index_id,1);
        this.setState({ 
            checkedIds: ids,
            checkedArr
        });
    }

    handleCheckedAll=(e)=>{
        let { checkedArr, subjectList } = this.state;
        let tempArr=[];
        let ids = [];
        if(e.target.checked){
            checkedArr.forEach(one=> tempArr.push(!one))
            subjectList.forEach((one, index) => { if(tempArr[index]) ids.push(+one.id)})
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

    handleClickUpdate=(e)=>{
        const { checkedIds } = this.state;
        const checkedIds_json = JSON.stringify(checkedIds)
        const idsString=checkedIds.toString();

        if(checkedIds.length===0){
            alert(`You did NOT select any item!`);
        }
        else{
            if(window.confirm(`Do you really want to update No. ${idsString} ${checkedIds.length>1? 'countries':'country'}?`)){
                axios.put(apiRoot + "location/countries/update", { checkedIds: checkedIds_json })
                    .then(res => {
                        alert(`You have updated ${checkedIds.length>1? checkedIds.length +' countries':'an country'}.`);
                        axios.get(apiRoot + "location/countries/all")
                        .then((res) => {
                            let tempArr = [];
                            this.state.checkedArr.forEach(()=> tempArr.push(false));
                            this.setState({
                                subjectList: res.data,
                                checkedArr: tempArr,
                                checkedIds: [],
                                checkedAll: false
                            });
                        })
                        .catch((err) => { 
                            console.log("[Error] - GET /location/countries/all - at Countries component!");
                            console.log(err);            
                        });
                    })
                    .catch(err=>{ 
                        console.log("[Error] - PUT /location/countries/update - at Countries component!");
                        console.log(err);
                });
                e.preventDefault();
            }
        }   
    }

    componentDidMount(){
        axios.get(apiRoot + "location/countries/all")
            .then((res) => {
                let checkedArr=[];
                res.data.forEach(one=>{
                    checkedArr.push( false )
                });
                this.setState({ checkedArr, subjectList: res.data });
            })
            .catch((err) => { 
                console.log("[Error] - GET /users/roles - at Countries component!");
                console.log(err);            
        });
    }

    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.Countries.cn;
        else lang=LANGUAGE.Countries.en;

        const {subjectList, searchContent, currentPage} = this.state;
        const { permissions } = this.props;
        
        const row=[];
        subjectList.forEach((one, index)=>{ 
            const isEnable = one.enabled === 1? 'enabled':'Disabled';         
            if( (one.name.toUpperCase().indexOf(searchContent.toUpperCase())===-1) && 
                (one.ISO_2.toUpperCase().indexOf(searchContent.toUpperCase())===-1) &&
                (one.ISO_3.toUpperCase().indexOf(searchContent.toUpperCase())===-1) &&
                (isEnable.toUpperCase().indexOf(searchContent.toUpperCase())===-1)){
                return;
            }
            row.push(
                <tr key={index} >
                    <td style={{verticalAlign: 'middle'}} className="text-center"><input type="checkbox" name="checkbox" checked={this.state.checkedArr[index]} value={one.id} onChange={(e)=>this.handleChecked(e, index, one.enabled)}/></td>
                    <td style={{verticalAlign: 'middle'}} className="text-center">{one.id}</td>
                    <td style={{verticalAlign: 'middle'}} >{one.name}</td>
                    <td style={{verticalAlign: 'middle'}} >{one.ISO_2}</td>
                    <td style={{verticalAlign: 'middle'}} >{one.ISO_3}</td>
                    {one.enabled === 1? 
                        <td style={{verticalAlign: 'middle'}} className='text-center' >Enabled</td>:
                        <td style={{verticalAlign: 'middle', color:'red'}} className='text-center'>Disabled</td>
                    }
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
                            {
                                permissions[9][2].value?
                                <div className="col">
                                    <div className="float-right">
                                        <button type="button" className="btn btn-success btn-sm rounded" onClick={this.handleClickUpdate} title={lang[1]}><i className="fas fa-pencil-alt"></i></button>
                                    </div>
                                </div>:null
                            }
                        </div>
                        <div className="table-responsive rounded">
                            <table className="table table-hover table-bordered">
                                <thead>
                                    <tr className="table-primary">
                                        <th scope="col" style={{width: "5%"}} className="text-center"><input checked={this.state.checkedAll} type="checkbox" onChange={this.handleCheckedAll}/></th>
                                        <th scope="col" style={{width: "5%"}} className="text-center">#</th>
                                        <th scope="col" style={{width: "60%"}}>{lang[2]}</th>
                                        <th scope="col" style={{width: "10%"}}>{lang[3]}</th>
                                        <th scope="col" style={{width: "10%"}}>{lang[4]}</th>
                                        <th scope="col" style={{width: "10%"}} className="text-center">{lang[5]}</th>
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

export default Countries;