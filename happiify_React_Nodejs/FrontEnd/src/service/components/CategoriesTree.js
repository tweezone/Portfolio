import React, { Component }from 'react';
import ReactDOM from 'react-dom';
import Tree from 'rc-tree';
import Tooltip from 'rc-tooltip';
import 'rc-tree/assets/index.css';
//import './contextmenu.less';

/*function contains(root, n) {
  let node = n;
  while (node) {
    if (node === root) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}*/

class CategoriesTree extends Component {
/*
    state = {
        selectedKeys: ['0-1', '0-1-1', '0-1-1-1', '0-1-1-1-1']
    };
*/
/*
    componentDidMount() {
        this.getContainer();
        // console.log(ReactDOM.findDOMNode(this), this.cmContainer);
        console.log(contains(ReactDOM.findDOMNode(this), this.cmContainer));
    }
*/
    componentWillUnmount() {
        if (this.cmContainer) {
        ReactDOM.unmountComponentAtNode(this.cmContainer);
        document.body.removeChild(this.cmContainer);
        this.cmContainer = null;
        }
    }
/*  
    onSelect = (selectedKeys) => {
        this.setState({ selectedKeys });
    }
*/  
    getContainer() {
        if (!this.cmContainer) {
            this.cmContainer = document.createElement('div');
            document.body.appendChild(this.cmContainer);
        }
        return this.cmContainer;
    }
    renderCm(info) {
        if (this.toolTip) {
            ReactDOM.unmountComponentAtNode(this.cmContainer);
            this.toolTip = null;
        }
        this.toolTip = (
            <Tooltip
                trigger="click" placement="bottomRight" prefixCls="rc-tree-contextmenu"
                defaultVisible overlay={<h4>{info.node.props.title}</h4>}
            >
            <span />
            </Tooltip>
        );
        const container = this.getContainer();
        Object.assign(this.cmContainer.style, {
        position: 'absolute',
        left: `${info.event.pageX}px`,
        top: `${info.event.pageY}px`,
        });
        ReactDOM.render(this.toolTip, container);
    }

    // Make data for rc-tree format from DB data, using " huyao_road" and JSON.replace()    
    buildTree=(data, id , pid)=> {
        var treeList = [];
        var DBdata =[];
        // The "for" loop implements a deep copy for input "data" to prevent the original "data" from being changed.
        for(let i=0; i<data.length ; i++){
            var b= JSON.parse(JSON.stringify(data[i]));
            b.name = "id: " + b.categories_id + " - " + b.name;
            treeList.push(b);
            DBdata.push(b);
        }
        var afun = function(ys, json) {  
                var len = json.length;  
                while(len > 0) {  
                    len--;  
                    var oo = json[len];  
                    if(ys[id] === oo[pid]) {  
                        ys.children = ys.children || [];  
                        ys.children.push(oo)  
                        json.splice(len, 1);  
                    }  
                }  
            }
        DBdata.forEach(function(value) {  
            afun(value, treeList);  
        });
        return treeList;  
    } 

    render() {

        var treeList = this.buildTree(this.props.data, 'categories_id', 'parent_id');
        // The two statements below work for changing properties' name. So, it can satisfy the requirements of rc-tree.
        var treeListJSON=JSON.stringify(treeList).replace(/categories_id/g, "key").replace(/name/g, "title");
        var treeListStr=JSON.parse(treeListJSON);

        return (
            <div style={{fontSize:"1.2em"}}>
                <Tree 
                    treeData={treeListStr}
                    onSelect={this.onSelect}
                    //selectedKeys={this.state.selectedKeys}
                    //multiple
                    //defaultExpandAll
                    //defaultExpandParent
                    showLine
                    //showIcon={false}
                ></Tree>
            </div>
        );
    }
}

export default CategoriesTree;