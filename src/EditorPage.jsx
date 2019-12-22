import React, { Component } from 'react';

import CodeEditor from './CodeEditor';
import FileTree from './FileTree';
import SplitPane from 'react-split-pane';
import { ipcRenderer } from 'electron';
import { Icon } from 'antd';
import walk from './FileDta'; 


import { Row, Col } from 'antd';

import { GET_PROJECT_PATH,  RECEIVED_PROJECT_PATH} from '../utils/constants';

import './EditorPage.css'

export default class EditorPage extends Component {

    constructor(props){
        super(props);

        this.state = {
          file_tree: [],  
          openFiles: [], 
          currentFile: undefined,
          projectPath: '',
          currrentFileName: 'Welcome. Select a file to begin.',
          currentFileLang: ''
          
          // might have currrentFileName and CurrentFileLang but it might all be in the curent file object
        }

        

        
    }

    componentDidMount() {
      ipcRenderer.on(RECEIVED_PROJECT_PATH, (event, arg) => {
          // console.log(arg);
          const [ project_path ] = arg;

      walk(project_path, (err, result) => {
        if (result) { // handle error
        //console.log(result);
        this.setState({file_tree: [result], projectPath: project_path});
      }

      })
      })
    }

    refreshFileTree = () => {

      walk(this.state.projectPath, (err, result) => {
        if (result) { // handle error
        //console.log(result);
        this.setState({file_tree: [result]})
      
      }
    })
  }
  
    onClick = (keys, event) => {
      //console.log(event);
      this.setState({currentFile: event.node})
      console.log(`clicked ${event.node.props.title}`)
      //console.log(this.state.currentFile);
    }


    getPath =  () => {
      ipcRenderer.send(GET_PROJECT_PATH, '');
      // walk('/Users/mitch/Resource-Ottawa-App').then(result => {console.log(result)})
      // walk('/Users/mitch/Resource-Ottawa-App', (err, result) => {
      //   if (result) {
      //   console.log(result);
      //   this.setState({file_tree: [result]})
      // }

      // })
      // let tree = new Fil2('/Users/mitch/Resource-Ottawa-App');
      //  tree.build();
      // console.log(tree);
      // this.setState({file_tree: [tree]})
    }

    

    render() {
        return(
// .row class in index.css
          <>
            <Row className="row"> 
            {/* remove min size */}
              <SplitPane split="vertical" defaultSize={280} maxSize={350} minSize={0}> 
              {/* set max value */}
                <FileTree file_tree={this.state.file_tree} getPath={this.getPath} onClick={this.onClick}/>
                <CodeEditor currrentFileName={this.state.currrentFileName} currentFileLang={this.state.currentFileLang} openFiles={this.state.openFiles} currentFile={this.state.currentFile}/>
                
                        
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