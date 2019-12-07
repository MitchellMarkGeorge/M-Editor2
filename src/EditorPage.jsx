import React, { Component } from 'react';

import CodeEditor from './CodeEditor';
import SplitPane from 'react-split-pane';
import { Tree } from 'antd';

const { TreeNode, DirectoryTree } = Tree;

export default class EditorPage extends Component {

    constructor(props){
        super(props);

        
    }

    onSelect = (keys, event) => {
        console.log('Trigger Select', keys, event);
      };
    
    onExpand = () => {
        console.log('Trigger Expand');
      };

    render() {
        return(
            
                <SplitPane split="vertical" defaultSize={280}>

    <DirectoryTree multiple defaultExpandAll onSelect={this.onSelect} onExpand={this.onExpand}>
        {/* the keys will be the path of the file */}
        <TreeNode title="parent 0" key="0-0">
          <TreeNode title="leaf 0-0" key="0-0-0" isLeaf />
          <TreeNode title="leaf 0-1" key="0-0-1" isLeaf />
        </TreeNode>
        <TreeNode title="parent 1" key="0-1">
          <TreeNode title="leaf 1-0" key="0-1-0" isLeaf />
          <TreeNode title="leaf 1-1" key="0-1-1" isLeaf />
        </TreeNode>
      </DirectoryTree>

                    <CodeEditor/>
                    


                </SplitPane>
            
        );
    }
}