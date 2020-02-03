import React, { Component } from 'react';

import { Button, Tree } from 'antd';
import { remote } from "electron";

import * as path from 'path';


import './FileTree.css'

const { TreeNode, DirectoryTree } = Tree;
const { shell, clipboard } = remote;

export default class Filetree extends Component {

    menu;
    rightClickedNodePath
    projectPath
    
    state = { rightClickedNodePath: '' };
   

    componentDidUpdate() {
        if (this.props.file_tree) { 
            //this.projectPath = this.props.projectPath; 
            const menu = new remote.Menu();
           
            menu.append(new remote.MenuItem({ label: 'New File', click: () => { this.props.newFile() }}));
            menu.append(new remote.MenuItem({ label: 'Generate Config File', click: () => { this.props.generateConfigFile()}}));
            menu.append(new remote.MenuItem({ type: 'separator' }));
            menu.append(new remote.MenuItem({ label: 'Move To Trash', click: () => { this.deleteItem() }}));
            menu.append(new remote.MenuItem({ label: 'Show in File System', click: () => { this.showItemInFileSystem() } }));
            menu.append(new remote.MenuItem({ type: 'separator' }));
            menu.append(new remote.MenuItem({ label: 'Copy Full Path', click: () => { this.copyFullPath() } }));
            menu.append(new remote.MenuItem({ label: 'Copy Relative Path', click: () => { this.copyRelativePath() } }));
            this.menu = menu;


        }
    }


    onSelect = (keys, event) => {
        this.props.onClick(keys, event);
    };

    onExpand = () => {
        console.log('Trigger Expand');
    };

    

    

    onContextMenu = () => {
        console.log(event)
        event.preventDefault();

        this.menu.popup({ window: remote.getCurrentWindow() });
    }

    getPath = () => {
        this.props.getPath();
    }

    rightClick = (e) => {
        //console.log(e.node.props.path) // cannot be project path
        this.setState({rightClickedNodePath: e.node.props.path})
        console.log(e.node.props.path);
        //console.log(this.rightClickedNodePath);
        // trigger
    }

    copyFullPath = () => {
        try {
            clipboard.writeText(this.state.rightClickedNodePath);
        } catch (err) {
            console.log(err);
            this.props.showNotification("Unable to copy full path.", 'Try Again.', 'error')

        }
    }

    copyRelativePath = () => {
        try {
            let currentFilePath = this.props.currentFile.props.path;
            let relativePath = path.relative(this.state.rightClickedNodePath, currentFilePath);
            clipboard.writeText(relativePath);
        } catch (err) {
            this.props.showNotification("Unable to copy relative path.", 'Try Again.', 'error')
        }
    }

    showItemInFileSystem = () => {
        try {
            shell.showItemInFolder(this.state.rightClickedNodePath);
        } catch (err) {
            console.log(err);
            this.props.showNotification('Unable to show item in file system.', 'Try again.', 'error')
        }
    }

    deleteItem = () => {
        if (this.state.rightClickedNodePath === this.props.projectPath) {
            this.props.showNotification('Can not delete current project folder.', null, 'error');

        } else if (this.props.file_tree) { 
            console.log('HERE')
            console.log(this.state.rightClickedNodePath);

            // const movedToTrash = shell.moveItemToTrash(this.state.rightClickedNodePath);
            // console.log(movedToTrash);
            // might try try-catch block

            try {
                
                const movedToTrash = shell.moveItemToTrash(this.state.rightClickedNodePath);
                console.log(movedToTrash);
                if (this?.props?.currentFile && (this.state.rightClickedNodePath == this.props.currentFile.props.path)) {
                    this.props.resetcurrentFile();
                }
                this.props.showNotification(`Moved ${path.basename(this.state.rightClickedNodePath)} to trash.`, null, 'success');
                this.props.refreshFileTree();
            } catch (err) {
                console.log(err);
                this.props.showNotification('Could not move item to trash.', 'Try again.', 'error');

            }
            // if (movedToTrash) {
            //     this.props.showNotification('Moved item to trash.', null, 'success');
            //     this.props.refreshFileTree();
            // } else {
            //     this.props.showNotification('Could not move item to trash.', 'Try again.', 'error');
            // }

            
            
            // trash(this.state.rightClickedNodePath).then(() => { 
            //     this.props.showNotification('Moved item to trash.', null, 'success');
            //     this.props.refreshFileTree();
            //     })
            //     .catch((err) => { console.log(err); this.props.showNotification('Could not move item to trash.', 'Try again.', 'error'); })
        }
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
                    <div onContextMenu={this.onContextMenu}>
                        {/* style={{overflow: 'auto', height: '100%'}} */}
                        <DirectoryTree className="tree" treeData={this.props.file_tree} onSelect={this.onSelect} onExpand={this.onExpand} onRightClick={this.rightClick}>

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