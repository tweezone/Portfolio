import React, {Component} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {Link} from 'react-router-dom';
import LANGUAGE from '../../../service/Language-data';
import apiRoot from '../../../config.api';

import DoctorTable from './DoctorTable';
import SearchBar from '../../../service/components/SearchBar';
import PagingBar from '../../../service/components/PagingBar';
class DoctorManagement extends Component{
    state={
            subjectList:[],
            searchContent:'',     // Accept the value of "change"; Used for search after the button is clicked.
            searchChange:'',      // Accept the value changed in "input".
            currentPage: 1,
            currentId: '',
            currentTitle: '',
            currentTotal_answers: '',
            checkedArr: [],
            checkedIds: [],
            checkedAll: false
        };
    
    static propTypes = {
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
        let index = ids.indexOf(+id);   // NOTE: The type of "e.target.value" is string, like "1", but when checkedAll is true first, there are number type in the array "checkedIds".
        e.target.checked === true? ids.push(+id) : ids.splice(index,1);
        this.setState({ 
            checkedIds: ids,
            checkedArr
        });
    }

    handleCheckedAll=(e)=>{
        let { checkedArr,subjectList } = this.state;
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
        const {checkedIds} = this.state;
        const idsString=checkedIds.toString();
        if(checkedIds.length===0){
            alert(`You did NOT select any item!`);
        }
        else{
            if(window.confirm(`Do you really want to delete No. ${idsString} ${checkedIds.length>1? 'doctors':'doctor'}?`)){
                axios.put(apiRoot + "health/doctors/delete", { checkedIds })
                    .then(res => {
                        alert(`You have deleted ${checkedIds.length>1? checkedIds.length +' doctors':'an doctor'}.`);
                        let tempArr = [];
                        this.state.checkedArr.forEach(()=> tempArr.push(false));
                        this.setState({
                            checkedArr: tempArr,
                            checkedIds: [],
                            checkedAll: false
                        });
                        axios.get(apiRoot + "health/doctors")
                        .then((res) => {                   
                            this.setState({ subjectList: res.data });  
                        })
                        .catch((err) => { 
                            console.log("[Error] - GET /health/doctors - at DoctorManagement component!");
                            console.log(err);             
                        });
                    })
                    .catch(err=>{ 
                        console.log("[Error] - GET /health/doctors/delete - at DoctorManagement component!");
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
        axios.get(apiRoot + "health/doctors")
            .then((res) => { 
                let checkedArr=[];
                res.data.forEach(one=>{
                    checkedArr.push( false )
                });
                this.setState({ checkedArr, subjectList: res.data });
            })
            .catch((err) => { 
                console.log("[Error] - GET /health/doctors - at DoctorManagement component!");
                console.log(err);            
        });
    }

    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.DoctorManagement.cn;
        else lang=LANGUAGE.DoctorManagement.en;

        const {subjectList, searchContent, currentPage} = this.state;
        const { permissions } = this.props;

        const row=[];
        subjectList.forEach((one, index)=>{            
            if( (one.username.toUpperCase().indexOf(searchContent.toUpperCase())===-1)&&
                (one.name.toUpperCase().indexOf(searchContent.toUpperCase())===-1)&&
                (one.title.toUpperCase().indexOf(searchContent.toUpperCase())===-1)&&
                (one.products_model.toUpperCase().indexOf(searchContent.toUpperCase())===-1)&&
                (one.city_name.toUpperCase().indexOf(searchContent.toUpperCase())===-1)&&
                (one.categories_name).indexOf(searchContent)===-1){
                return;
            }
            row.push(
                <tr key={index} >
                    <td style={{verticalAlign: 'middle'}} className="text-center"><input type="checkbox" name="checkbox" checked={this.state.checkedArr[index]} value={one.id} onChange={(e)=>this.handleChecked(e, index)}/></td>
                    <td style={{verticalAlign: 'middle'}} className='text-center'>{one.id}</td>
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
                    <td style={{verticalAlign: 'middle'}} className='text-center'>{one.username}</td>
                    <td style={{verticalAlign: 'middle'}} className='text-center'>{one.name}</td>
                    <td style={{verticalAlign: 'middle'}} className='text-center'>{one.title}</td>
                    <td style={{verticalAlign: 'middle'}} className='text-center'>{one.categories_name}</td>
                    <td style={{verticalAlign: 'middle'}} className='text-center'>{one.city_name}</td>
                    {
                        permissions[6][3].value?
                        <td style={{verticalAlign: 'middle'}}>
                            <Link to="/health/doctors/update" className="btn btn-success btn-sm mr-2 rounded" onClick={()=>this.handleClickUpdate(one.id)} title={lang[3]}><i className="fas fa-pencil-alt"></i></Link>
                        </td>:null
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
                                permissions[6][2].value || permissions[6][4].value?
                                <div className="col">
                                    <div className="btn-group float-right" >
                                        {
                                            permissions[6][2].value?
                                            <Link to='/health/doctors/add' className="btn btn-primary btn-sm mr-2 rounded" title={lang[1]}><i className="fas fa-plus-square"></i></Link>:null
                                        }
                                        {
                                            permissions[6][4].value?
                                            <button type="button" className="btn btn-danger btn-sm rounded" onClick={this.handleClickDelete} title={lang[2]}><i className="fas fa-trash-alt"></i></button>:null
                                        }
                                    </div>
                                </div>:null
                            }
                        </div>           
                        <DoctorTable
                            langState={this.props.langState}
                            checkedAll={this.handleCheckedAll}
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

export default DoctorManagement;