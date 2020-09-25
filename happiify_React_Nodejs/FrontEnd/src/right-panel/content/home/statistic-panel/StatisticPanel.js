import React, {Component} from 'react';

import Card1 from './Card1';
import Card2 from './Card2';
import Card3 from './Card3';

class StatisticPanel extends Component{
    render(){
        return(
            <div>
                <Card1/>
                <Card2/>
                <Card3/>
            </div>
        );
    }
}

export default StatisticPanel;