import React, { Component } from 'react';
import { } from 'antd';
import { Button, Tree, Icon } from 'antd';

import './FileTree.css'

const { TreeNode, DirectoryTree } = Tree;

export default class Filetree extends Component {

    state = { visible: false };

    onSelect = (keys, event) => {
        this.props.onClick(keys, event);
    };

    onExpand = () => {
        console.log('Trigger Expand');
    };

    state = { visible: false };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

    getPath = () => {
        this.props.getPath();
    }

    render() {
        // open file tee section 
        // FIX FILE TREE RENDERING, ALL ITEMS SHOULD BE VISIBLE
        return (
            
            <div className="file-tree">

                <div className="file-tree-bar">
                    File Tree
                
                </div>
                {/* The file tree object can have all the props of TreeNode see API */}
                {this.props.file_tree.length > 0 &&
                    <div >
                        {/* style={{overflow: 'auto', height: '100%'}} */}
                        <DirectoryTree className="tree" treeData={this.props.file_tree} multiple defaultExpandAll onSelect={this.onSelect} onExpand={this.onExpand}>

                            {/* the keys will be the path of the file */}
                            {/* <TreeNode title="parent 0" key="0-0">
                <TreeNode title="leaf 0-0" key="0-0-0" isLeaf />
                <TreeNode title="leaf 0-1" key="0-0-1" isLeaf />
                </TreeNode>
                <TreeNode title="parent 1" key="0-1">
                <TreeNode title="leaf 1-0" key="0-1-0" isLeaf />
                <TreeNode title="leaf 1-1" key="0-1-1" isLeaf />
                </TreeNode> */}
                        </DirectoryTree>

                    </div>}

                {this.props.file_tree.length === 0 &&

                    <div className="no-project">
                        <p>No project has been selected.</p>
                        <Button type="primary" onClick={this.getPath}>Select Project</Button>
                    </div>}





            </div>
            
        );
    }
}