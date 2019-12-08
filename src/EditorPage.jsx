import React, { Component } from 'react';

import CodeEditor from './CodeEditor';
import FileTree from './FileTree';
import SplitPane from 'react-split-pane';
import { Tree } from 'antd';

const { TreeNode, DirectoryTree } = Tree;

export default class EditorPage extends Component {

    constructor(props){
        super(props);

        this.state = {
          openFiles: [], 
          currentFile: null,
          projectPath: '',
          currrentFileName: 'Welcome. Select A file to begin',
          currentFileLang: ''
          
          // might have currrentFileName and CurrentFileLang but it might all be in the curent file object
        }

        
    }

    

    render() {
        return(
          <div style={{height: '100%', width: '100%'}}>
            <SplitPane split="vertical" defaultSize={280} minSize={0}>

              <FileTree/>
              <CodeEditor currrentFileName={this.state.currrentFileName} currentFileLang={this.state.currentFileLang}/>
              
                      
            </SplitPane>

            

          </div>
            
        );
    }
}