import React, { Component } from 'react';

import CodeEditor from './CodeEditor';
import FileTree from './FileTree';
import SplitPane from 'react-split-pane';
import { ipcRenderer } from 'electron';
import { Icon } from 'antd';


import { Row, Col } from 'antd';

import { GET_PROJECT_PATH } from '../utils/constants';

import './EditorPage.css'

export default class EditorPage extends Component {

    constructor(props){
        super(props);

        this.state = {
          file_tree: [],  
          openFiles: [], 
          currentFile: null,
          projectPath: '',
          currrentFileName: 'Welcome. Select a file to begin.',
          currentFileLang: ''
          
          // might have currrentFileName and CurrentFileLang but it might all be in the curent file object
        }

        
    }

    getPath = () => {
      ipcRenderer.send(GET_PROJECT_PATH)
    }

    

    render() {
        return(
// .row class in index.css
          <>
            <Row className="row"> 
            {/* remove min size */}
              <SplitPane split="vertical" defaultSize={280} maxSize={350} minSize={0}> 
              {/* set max value */}
                <FileTree file_tree={this.state.file_tree} projectPath={this.state.projectPath}/>
                <CodeEditor currrentFileName={this.state.currrentFileName} currentFileLang={this.state.currentFileLang} openFiles={this.state.openFiles}/>
                
                        
              </SplitPane>
            </Row>


            <div className="low-bar">
                <Icon type="api" className="low-bar-text"/>
                {/* think about icon */}
                <div className="low-bar-text">{this.state.currrentFileName}</div>
                <div className="low-bar-text">{this.state.currentFileLang}</div>
                {/* can have github icon show if git repo is present */}
            </div>
            </>

            
              
      
          
            
        );
    }
}