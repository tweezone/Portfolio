import React, { Component } from 'react';

import Alert from './Alert';
import CardsPanel from './cards-panel/CardsPanel';
import GraphicCard from './GraphicCard';
import ManagerCard from './ManagerCard';
import StatisticPanel from './statistic-panel/StatisticPanel';
import MapCard from './MapCard';

class Home extends Component{
    render(){
        return(
            <div>
                <Alert 
                    langData={this.props.langData}
                    langState={this.props.langState}
                />
                <CardsPanel/>
                <GraphicCard/>
                <ManagerCard/>
                <StatisticPanel/>
               <MapCard/>
            </div>
        );
    }
}

export default Home;