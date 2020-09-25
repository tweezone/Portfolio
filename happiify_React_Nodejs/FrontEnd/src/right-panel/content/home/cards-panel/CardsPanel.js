import React, {Component} from 'react';

import Card11 from './Card11';
import Card12 from './Card12';
import Card13 from './Card13';
import Card14 from './Card14';
import Card21 from './Card21';
import Card22 from './Card22';
import Card23 from './Card23';
import Card24 from './Card24';

class CardsPanel extends Component{
    render(){
        return(
        <div> 
            <Card11/> <Card12/> <Card13/> <Card14/>
            <Card21/> <Card22/> <Card23/> <Card24/>
        </div>
        )
    }
}

export default CardsPanel;