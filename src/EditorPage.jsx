import React, { Component } from 'react';

import CodeEditor from './CodeEditor';
import FileTree from './FileTree';
import SplitPane from 'react-split-pane';
import { ipcRenderer } from 'electron';
import { Icon } from 'antd';
import walk from './FileDta';
import CommandPalette from 'react-command-palette';
import {remote} from 'electron';
import * as os from 'os';
import * as fs from 'fs';

const { dialog } = remote;

import { Empty, notification } from 'antd';

import { Layout } from 'antd';
const { Content, Footer } = Layout;

import { GET_PROJECT_PATH, RECEIVED_PROJECT_PATH } from '../utils/constants';

import './EditorPage.css'

export default class EditorPage extends Component {

  currrentFileName = 'Welcome. Select a file to begin.'
  currentFileLang = ''
  

  

  // theme = {
  //   modal: 'palette-overlay'
  // }

  constructor(props) {
    super(props);

    this.state = {
      file_tree: [],
      openFiles: [],
      currentFile: undefined,
      projectPath: '',
      visible: false


      // might have currrentFileName and CurrentFileLang but it might all be in the curent file object
    }

    this.commands = [{
      name: "Create New File",
      command: () => {
        this.newFile();
      }
          
       
    }, {
      name: "Refresh File Tree",
      command: () => {
        this.refreshFileTree(); 
      }
    }];




  }

  

  showModal = () => {
    console.log('do something') 
    this.setState({
      visible: true,
    });
  };


  newFile = () => {
    dialog.showSaveDialog(remote.getCurrentWindow(), {title: 'Create New File', defaultPath: this.state.projectPath}).then(
      result => {
        if (result.canceled) {
          return;
        } else if (result.filePath) {

          fs.writeFile(result.filePath, '', (err) => {
            if (err) return;
            this.showNotification(`New file ${result.filePath} made`, null, 'success')
          })


          //console.log(this.getFileObject(result.filePath, this.state.file_tree))
          this.refreshFileTree();
          console.log(this.getFileObject(this.state.file_tree[0], result.filePath));
        }
      })
  }
  setFileName = (fileName) => {
    this.currrentFileName = fileName;
  }

  setFileLang = (fileLang) => {
    this.currentFileLang = fileLang;
  }

  showNotification = (message, description, type) => {
    notification[type]({
      message: message,
      placement: 'bottomRight',
      description: description,
      className: 'notification',
      style: {
        backgroundColor: '#23272a',
        color: 'white'
      }

    });

  }



  componentDidMount() {
    ipcRenderer.on(RECEIVED_PROJECT_PATH, (event, arg) => {
      // console.log(arg);
      const [project_path] = arg;
      // array destructuring

      walk(project_path, (err, result) => {
        if (result) { // handle error
          console.log(result);
          this.setState({ file_tree: [result], projectPath: project_path });
          //this.showNotification('Hello', 'Hi', 'error')
        } else if (err) {
          this.showNotification(`Error in loading ${project_path}`, 'Please try again', 'error')
        }

      })
    })
  }

  componentWillUnmount() {
    //ipcRenderer.removeListener(RECEIVED_PROJECT_PATH); // SHOULD I DO THIS??
  }

  refreshFileTree = () => {

    walk(this.state.projectPath, (err, result) => {
      if (result) { // handle error
        //console.log(result);
        this.setState({ file_tree: [result] })

      }
    })
  }

  onClick = (keys, event) => {
    //console.log(event);
    this.setState({ currentFile: event.node })
    console.log(`clicked ${event.node.props.title}`)
    //console.log(this.state.currentFile);
    let object = event.node.props;
    if (!object.saved) {
      this.setFileName(`${object.title} (Unsaved)`);
    } else {
      this.setFileName(object.title);
    }
    if (object.mode) {
      this.setFileLang(object.mode.name);
    } else {
      this.setFileLang('Plain Text'); // Language is undefined??? None??? Lang not supported
    }
  }


  getPath = () => {
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

  getFileObject (element, file_path){ // is async needed
    if(element?.props?.path == file_path){
      console.log('match made');
       
         return element;
         
    }else if (element?.props?.children != undefined){ 
         var i;
         var result = null;
         for(i=0; result == undefined && i < element.children.length; i++){
              result = this.getFileObject(element.children[i], file_path); // await
         }
         return result;
    }
    return null;
}

  getView = () => {
    let View;
    // add if no files are opened???
    // this.state.file_tree && this.state.file_tree.length
    if (this.state.file_tree && this.state.file_tree.length) {
      View = <CodeEditor setFileName={this.setFileName} setFileLang={this.setFileLang} openFiles={this.state.openFiles} currentFile={this.state.currentFile} showNotification={this.showNotification} showModal={this.showModal}/>
    } else {
      View = <div style={{ position: 'relative', height: '100%', backgroundColor: '#14171d' }}>
        <Empty className="no-selected-file" description={
          <span>Nothing to see here. (Not final color)</span>
        } />
      </div>
    }

    return View;
  }



  render() {
    return (

      <> 

      {this.state.file_tree.length > 0 &&
        <CommandPalette commands={this.commands} closeOnSelect={true} /> 
        }

        <div className="container">

          {/* remove min size */}
          <div className="inner-container">
            <div className="inner-grid">
              <SplitPane split="vertical" defaultSize={280} maxSize={350} minSize={0}>
                {/* set max value */}
                <FileTree file_tree={this.state.file_tree} getPath={this.getPath} onClick={this.onClick} />
                {this.getView()}
                {/* <CodeEditor currrentFileName={this.state.currrentFileName} currentFileLang={this.state.currentFileLang} openFiles={this.state.openFiles} currentFile={this.state.currentFile} /> */}


              </SplitPane>
            </div>
          </div>


          <div className="low-bar">


            <span className="low-bar-text"><Icon type={this.state.currentFile ? 'api' : 'smile'} /></span>
            <span className="low-bar-text">{this.currrentFileName}</span>
            <span className="low-bar-text">{this.currentFileLang}</span>
          </div>


          {/* <Footer className="low-bar">
              <div className="low-bar">
                <Icon type="api" className="low-bar-text"/>
                
                <div className="low-bar-text">{this.state.currrentFileName}</div>
                <div className="low-bar-text">{this.state.currentFileLang}</div>
                
                </div>
            </Footer> */}
        </div>
      </>





    );
  }
}