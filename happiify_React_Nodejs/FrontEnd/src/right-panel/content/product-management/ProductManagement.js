import React, {Component} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {Link} from 'react-router-dom';
import LANGUAGE from '../../../service/Language-data';
import apiRoot from '../../../config.api';

import ProductTable from './ProductTable';
import SearchBar from '../../../service/components/SearchBar';
import PagingBar from '../../../service/components/PagingBar';

class ProductManagement extends Component{
    state={
            subjectList:[],
            searchContent:'',     // Accept the value of "change"; Used for search after the button is clicked.
            searchChange:'',      // Accept the value changed in "input".
            currentPage: 1,
            currentId: '',
            currentTitle: '',
            currentTotal_answers: ''
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

    handleClickDelete=(id, name)=>{
        if(window.confirm(`Do you really want to delete ${name}?`)){
            axios.put(apiRoot + "products/delete", {id:id})
                .then(res => {
                    alert(`You have deleted ${name}.`);
                    axios.get(apiRoot + "products")
                    .then((res) => {                   
                        this.setState({ subjectList: res.data });  
                    })
                    .catch((err) => {
                        console.log("[Error] - GET /products - at ProductManagement component!");
                        console.log(err);           
                    });
                })
                .catch(err=>{
                    console.log("[Error] - PUT /products/delete - at ProductManagement component!");
                    console.log(err);
            });
        }
    }

    handleClickUpdate=(id)=>{
        this.props.clickUpdate(id);        
    }

    componentDidMount(){
        axios.get(apiRoot + "products")
            .then((res) => { 
                this.setState({ subjectList: res.data });  
            })
            .catch((err) => {
                console.log("[Error] - GET /products - at ProductManagement component!");
                console.log(err);         
        });
    }

    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.ProductManagement.cn;
        else lang=LANGUAGE.ProductManagement.en;

        const {subjectList, searchContent, currentPage} = this.state;
        const { permissions } = this.props;

        const row=[];
        subjectList.forEach((one, index)=>{            
            if( (one.products_name.toUpperCase().indexOf(searchContent.toUpperCase())===-1)&&
                (one.products_model.toUpperCase().indexOf(searchContent.toUpperCase())===-1)&&
                (String(one.products_price).indexOf(searchContent)===-1)){
                return;
            }
            row.push(
                <tr key={index} >
                    <td style={{verticalAlign: 'middle'}} className='text-center'>
                        {(()=>{
                                switch(one.products_image.slice(0,4)){
                                    case '':        return (<span>{'No Image'}</span>);
                                    case 'http':    return (<img src={one.products_image} style={{height: '35px'}} alt={index}/>);
                                    default:        return (<a href={apiRoot + 'display/image/file?file=' + one.products_image}>
                                                                <img src={apiRoot + 'display/image/file?file=' + one.products_image} style={{height: '50px'}} alt={index}/>
                                                            </a>)
                                }
                            })()}
                    </td>
                    <td style={{verticalAlign: 'middle'}} className='text-center'>{one.products_name}</td>
                    <td style={{verticalAlign: 'middle'}} className='text-center'>{one.products_model}</td>
                    <td style={{verticalAlign: 'middle'}} className='text-center'>{one.products_price}</td>
                    <td style={{verticalAlign: 'middle'}} className='text-center'>{one.title}</td>
                    <td style={{verticalAlign: 'middle'}} className='text-center'>{one.products_quantity}</td>
                    {one.products_status === 1? 
                        <td style={{verticalAlign: 'middle'}} className='text-center' >Enabled</td>:
                        <td style={{verticalAlign: 'middle', color:'red'}} className='text-center'>Disabled</td>
                    }
                    {
                        permissions[8][3].value || permissions[8][4].value?
                        <td style={{verticalAlign: 'middle'}}                                                                >
                            <div className="btn-group">
                            {
                                permissions[8][3].value?
                                <Link to="/products/update" className="btn btn-success btn-sm mr-2 rounded" onClick={()=>this.handleClickUpdate(one.products_id)} title={lang[2]}><i className="fas fa-pencil-alt"></i></Link>:null
                            }
                            {
                                permissions[8][4].value?
                                <button type="button" className="btn btn-danger btn-sm rounded" onClick={(e)=>{this.handleClickDelete(one.products_id, one.products_name); e.preventDefault();}} title={lang[3]}><i className="fas fa-trash-alt"></i></button>:null
                            }   
                            </div>
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
                                permissions[8][2].value?
                                <div className="col">
                                    <div className="float-right">
                                        <Link to='/products/add' className="btn btn-primary btn-sm float-right rounded" title={lang[1]}><i className="fas fa-plus-square"></i></Link> 
                                    </div>
                                </div>:null
                            }
                        </div>           
                        <ProductTable
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

export default ProductManagement;