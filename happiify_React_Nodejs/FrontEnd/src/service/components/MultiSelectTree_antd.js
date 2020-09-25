import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TreeSelect } from 'antd';

const SHOW_PARENT = TreeSelect.SHOW_PARENT;

class MultiSelectTree extends Component {
    state = {
        value: this.props.init,
    }

    static propTypes={
        init: PropTypes.array.isRequired,
        data: PropTypes.array.isRequired,
        property1: PropTypes.string.isRequired,
        property2: PropTypes.string.isRequired,
        property3: PropTypes.string.isRequired
    };

    buildTree=(data, id , p, title, key='')=> {
        var treeList = [];
        var DBdata =[];
        for(let i=0; i<data.length ; i++){
            var b= JSON.parse(JSON.stringify(data[i]));
            treeList.push(b);
            DBdata.push(b);
        }
        var afun = function(ys, json) {  
                var len = json.length;  
                while(len > 0) {  
                    len--;  
                    var oo = json[len];  
                    if(ys[id] === oo[p] && ys[p] === 0) {  
                        ys.children = ys.children || [];  
                        ys.children.push(oo)  
                        json.splice(len, 1);  
                    }  
                }  
            }
        DBdata.forEach(function(value) {  
            afun(value, treeList);  
    });

    let p1='';
    key ===''? p1 = new RegExp(id, "g"):p1 = new RegExp(key, "g");    
    const p2 = new RegExp(title, "g");
    var treeListJSON=JSON.stringify(treeList).replace(p1, "value").replace(p2, "title");
    var treeListObj=JSON.parse(treeListJSON);

    return treeListObj;  
    } 

  onChange = (value) => {
    this.setState({ value });
    this.props.getValue(value);
  }

  componentDidUpdate(prevProps){
    const { init } = this.props;
    if(init !== prevProps.init){
        if(init.length === 0 || prevProps.init.length === 0){
            this.setState({ value: init });
        }
    }
}

  render() {
    const { data, property1, property2, property3, property4 } = this.props;
    const treeData = this.buildTree(data, property1, property2, property3, property4 )
    const tProps = {
      treeData,
      value: this.state.value,
      onChange: this.onChange,
      treeCheckable: true,
      showCheckedStrategy: SHOW_PARENT,
      searchPlaceholder: 'Please select',
      style: {
        width: '100%',
      },
    };
    return <TreeSelect {...tProps} />;
  }
}

export default MultiSelectTree;