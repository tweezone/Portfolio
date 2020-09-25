import React, {Component} from 'react';

class PagingBar extends Component{
    constructor(props){
        super(props);
        this.state={
            rightStartPage: this.props.currentPage
        }
    }

    handleClickPage=(e)=>{
        this.props.pageChange(e);
    }

    handleBarMoveLeft=()=>{
        this.setState((state, props)=>{
            return (this.state.rightStartPage>1)? {rightStartPage: state.rightStartPage-1}:{rightStartPage: state.rightStartPage}
        }); 
    }

    handleBarMoveRight=()=>{
        this.setState((state, props)=>{
            return ((this.state.rightStartPage+2)>this.props.totalPages)? {rightStartPage: state.rightStartPage}:{rightStartPage: state.rightStartPage+1}
        });
    }

    render(){
        let pageTags=[];
        let pageTag='';
        let key=0;     
        for (let i=this.state.rightStartPage; i<(this.state.rightStartPage+3); i++){
            if(i>this.props.totalPages){
                pageTag=<li key={key} className="page-item disabled" ><button className="page-link" value={i}>{i}</button></li>;
            }
            else{
                pageTag=<li key={key} className="page-item"  ><button className="page-link" onClick={this.handleClickPage} value={i}>{i}</button></li>;
            }
            pageTags.push(pageTag);
            key++;
        }        
        
        return(
            <div className="float-right">
                <nav aria-label="Page navigation example">
                    <ul className="pagination pagination-sm">
                        <li className="page-item" onClick={this.handleBarMoveLeft}><button className="page-link" >&laquo;</button></li>
                        {pageTags}
                        <li className="page-item" onClick={this.handleBarMoveRight}><button className="page-link" >&raquo;</button></li>                        
                    </ul>
                </nav>
            </div>
        );        
    }
}

export default PagingBar