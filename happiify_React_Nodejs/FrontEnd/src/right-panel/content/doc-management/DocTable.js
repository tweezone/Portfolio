import React, {Component} from 'react';
import LANGUAGE from '../../../service/Language-data';


class DocTable extends Component{
    constructor(props){
        super(props);
        this.state={
            currentPage: 1
        }
    }    

    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.DocTable.cn;
        else lang=LANGUAGE.DocTable.en;

        const { permissions } = this.props;

        return(
            <div className="table-responsive rounded">
                <table className="table table-hover table-bordered text-center">
                    <thead className="thead-dark ">
                        <tr>
                            <th scope="col" style={{width:"5%"}}>{lang[0]}</th>
                            <th scope="col" style={{width:"10%"}}>{lang[1]}</th>
                            <th scope="col" style={{width:"10%"}}>{lang[2]}</th>
                            <th scope="col" style={{width:"25%"}}>{lang[3]}</th>
                            <th scope="col" style={{width:"10%"}}>{lang[4]}</th>
                            <th scope="col" style={{width:"15%"}}>{lang[5]}</th>
                            <th scope="col" style={{width:"15%"}}>{lang[6]}</th>
                            {
                                permissions[1][3].value || permissions[1][4].value?
                                <th scope="col" style={{width:"10%"}}>{lang[7]}</th>:null
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {this.props.onePage}
                    </tbody>
                </table>                
            </div>
        );
    }
}

export default DocTable;