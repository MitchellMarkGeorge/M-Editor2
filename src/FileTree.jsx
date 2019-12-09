import React, { Component } from 'react';
import { Tree } from 'antd';
import { Button } from 'antd';

import './FileTree.css'

const { TreeNode, DirectoryTree } = Tree;

export default class Filetree extends Component {

    onSelect = (keys, event) => {
        console.log('Trigger Select', event);
      };
    
    onExpand = () => {
        console.log('Trigger Expand');
      };

    render() {

        
        return(
            <div className="file-tree">

                <div className="file-tree-bar">
                    File Tree
                </div>
             {this.props.file_tree.length > 0 && <DirectoryTree multiple defaultExpandAll onSelect={this.onSelect} onExpand={this.onExpand}>
                {/* the keys will be the path of the file */}
                <TreeNode title="parent 0" key="0-0">
                <TreeNode title="leaf 0-0" key="0-0-0" isLeaf />
                <TreeNode title="leaf 0-1" key="0-0-1" isLeaf />
                </TreeNode>
                <TreeNode title="parent 1" key="0-1">
                <TreeNode title="leaf 1-0" key="0-1-0" isLeaf />
                <TreeNode title="leaf 1-1" key="0-1-1" isLeaf />
                </TreeNode>
            </DirectoryTree>}

            {this.props.file_tree.length === 0 && 
            
            <div className="no-project">
               <p>No project has been selected.</p>
               <Button type="primary">Select Project</Button>  
            </div>}





          </div>
        );
    }
}