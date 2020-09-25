import React, {Component} from 'react';
import PropTypes from 'prop-types';
import LANGUAGE from '../../../service/Language-data';


class QuestionTable extends Component{
    state={
            currentPage: 1
        };
    
    static propTypes = {
        langState: PropTypes.string.isRequired,
        onePage: PropTypes.array.isRequired
    }

    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.QuestionTable.cn;
        else lang=LANGUAGE.QuestionTable.en;

        const { permissions } = this.props;

        return(
            <div className="table-responsive rounded">
                <table className="table table-hover table-bordered text-center">
                    <thead className="thead-dark">
                        <tr>
                            <th scope="col" style={{width:"5%"}}>{lang[0]}</th>
                            <th scope="col" style={{width:"15%"}}>{lang[1]}</th>
                            <th scope="col" style={{width:"15%"}}>{lang[2]}</th>
                            <th scope="col" style={{width:"30%"}}>{lang[3]}</th>
                            <th scope="col" style={{width:"10%"}}>{lang[4]}</th>
                            {
                                permissions[5][4].value || permissions[5][5].value?
                                <th scope="col" style={{width:"10%"}}>{lang[5]}</th>:null
                            }
                            <th scope="col" style={{width:"10%"}}>{lang[6]}</th>
                            {
                                permissions[5][2].value?
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

export default QuestionTable;