import React, {Component} from 'react';
import PropTypes from 'prop-types';
import LANGUAGE from '../../../service/Language-data';


class LessonTable extends Component{
    state={
            currentPage: 1
        };
    
    static propTypes = {
        langState: PropTypes.string.isRequired,
        onePage: PropTypes.array.isRequired
    }

    render(){
        let lang='';
        if(this.props.langState ==='cn') lang=LANGUAGE.LessonTable.cn;
        else lang=LANGUAGE.LessonTable.en;
        
        const { permissions } = this.props;

        return(
            <div className="table-responsive rounded">
                <table className="table table-hover table-bordered text-center">
                    <thead className="thead-dark ">
                        <tr>
                            <th scope="col" style={{width:"5%"}}>{lang[0]}</th>
                            <th scope="col" style={{width:"10%"}}>{lang[1]}</th>
                            <th scope="col" style={{width:"10%"}}>{lang[2]}</th>
                            <th scope="col" style={{width:"15%"}}>{lang[3]}</th>
                            <th scope="col" style={{width:"5%"}}>{lang[4]}</th>
                            <th scope="col" style={{width:"15%"}}>{lang[5]}</th>
                            <th scope="col" style={{width:"10%"}}>{lang[6]}</th>
                            <th scope="col" style={{width:"5%"}}>{lang[7]}</th>
                            <th scope="col" style={{width:"5%"}}>{lang[8]}</th>
                            <th scope="col" style={{width:"5%"}}>{lang[9]}</th>
                            <th scope="col" style={{width:"5%"}}>{lang[10]}</th>
                            {
                                permissions[4][3].value || permissions[4][4].value?
                                <th scope="col" style={{width:"10%"}}>{lang[11]}</th>:null
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

export default LessonTable;