import React, { Component } from 'react';

import CodeEditor from './CodeEditor';
import FileTree from './FileTree';
import SplitPane from 'react-split-pane';
import { ipcRenderer } from 'electron';
import { Icon } from 'antd';
import walk from './FileDta';

import { Empty } from 'antd';

// import { Layout } from 'antd';
// const { Content, Footer, Sider } = Layout;

import { GET_PROJECT_PATH, RECEIVED_PROJECT_PATH } from '../utils/constants';

import './EditorPage.css'

export default class EditorPage extends Component {

  constructor(props) {
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
      const [project_path] = arg;

      walk(project_path, (err, result) => {
        if (result) { // handle error
          //console.log(result);
          this.setState({ file_tree: [result], projectPath: project_path });
        }

      })
    })
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

  getView = () => {
    let View;

    if (this.state.file_tree && this.state.file_tree.length) {
      View = <CodeEditor currrentFileName={this.state.currrentFileName} currentFileLang={this.state.currentFileLang} openFiles={this.state.openFiles} currentFile={this.state.currentFile} />
    } else {
      View = <div style={{ position: 'relative', height: '100%', backgroundColor: '#14171d' }}>
        <Empty className="no-selected-file" description={
          <span>No project selected. (Not final color)</span>
        } />
      </div>
    }

    return View;
  }



  render() {
    return (
      // .row class in index.css
      <div className="container">

        {/* remove min size */}
        <SplitPane split="vertical" defaultSize={280} maxSize={350} minSize={0}>
          {/* set max value */}
          <FileTree file_tree={this.state.file_tree} getPath={this.getPath} onClick={this.onClick} />
          {this.getView()}
          {/* <CodeEditor currrentFileName={this.state.currrentFileName} currentFileLang={this.state.currentFileLang} openFiles={this.state.openFiles} currentFile={this.state.currentFile} /> */}


        </SplitPane>


        <div className="low-bar">
          {/* style={{zIndex: 2, height: '20px', lineHeight: '20px', padding: 0, position: 'fixed', bottom: 0, width: '100%'}} */}

          <span className="low-bar-text"><Icon type="smile" /></span>
          <span className="low-bar-text">{this.state.currrentFileName}</span>
          <span className="low-bar-text">{this.state.currentFileLang}</span>
        </div>


        {/* <Footer className="low-bar">
              <div className="low-bar">
                <Icon type="api" className="low-bar-text"/>
                
                <div className="low-bar-text">{this.state.currrentFileName}</div>
                <div className="low-bar-text">{this.state.currentFileLang}</div>
                
                </div>
            </Footer> */}
      </div>






    );
  }
}