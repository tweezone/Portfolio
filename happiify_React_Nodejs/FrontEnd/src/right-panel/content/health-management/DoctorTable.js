import React, {Component} from 'react';
import PropTypes from 'prop-types';
import LANGUAGE from '../../../service/Language-data';


class DoctorTable extends Component{
    state={
            currentPage: 1
        };
    
    static propTypes = {
        langState: PropTypes.string.isRequired,
        onePage: PropTypes.array.isRequired
    }

    handleCheckedAll=(e)=>{
        this.props.checkedAll(e);
    }

    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.DoctorTable.cn;
        else lang=LANGUAGE.DoctorTable.en;

        const { permissions } = this.props;

        return(
            <div className="table-responsive rounded">
                <table className="table table-hover table-bordered text-center">
                    <thead>
                        <tr className="table-primary">
                            <th scope="col" style={{width:"5%"}} className="text-center"><input checked={this.state.checkedAll} type="checkbox" onChange={this.handleCheckedAll}/></th>
                            <th scope="col" style={{width:"5%"}}>{lang[0]}</th>
                            <th scope="col" style={{width:"10%"}}>{lang[1]}</th>
                            <th scope="col" style={{width:"15%"}}>{lang[2]}</th>
                            <th scope="col" style={{width:"15%"}}>{lang[3]}</th>
                            <th scope="col" style={{width:"15%"}}>{lang[4]}</th>
                            <th scope="col" style={{width:"15%"}}>{lang[5]}</th>
                            <th scope="col" style={{width:"15%"}}>{lang[6]}</th>
                            {
                                permissions[6][3].value?
                                <th scope="col" style={{width:"5%"}}>{lang[7]}</th>:null
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

export default DoctorTable;