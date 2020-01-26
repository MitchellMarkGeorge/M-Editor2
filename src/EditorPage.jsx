import React, { Component } from "react";

import CodeEditor from "./CodeEditor";
import ImageViewer from './ImageViewer';
import FileTree from "./FileTree";
import SplitPane from "react-split-pane";
import { ipcRenderer } from "electron";
import { Icon } from "antd";
import walk from "./FileDta";
import CommandPalette from "react-command-palette";
import { remote } from "electron";
import * as os from "os";
import * as fs from "fs";
import * as git from "simple-git";
import * as path_os from 'path';
import * as child_proccess from "child_process";

const { dialog } = remote;

import { Empty, notification } from "antd";

import { GET_PROJECT_PATH, RECEIVED_PROJECT_PATH } from "../utils/constants";

import "./EditorPage.css";

// TODO:
// - Git status and icon
// - Checking git repo on change project
// - Image

export default class EditorPage extends Component {
  // currrentFileName = "Welcome. Select a file to begin.";
  // currentFileLang = "";
  //hasGitRepo = false;

  // theme = {
  //   modal: 'palette-overlay'
  // }



  constructor(props) {
    super(props);

    this.initalcommands = [
      //Open Terminal
      {
        name: "Create New File",
        // category: 'Editor',
        command: () => {
          this.newFile();
        }
      },
      {
        name: "Refresh File Tree",
        // category: 'Editor',
        command: () => {
          this.refreshFileTree();
          this.showNotification("File Tree refreshed", null, "success");
        }
      },

      {
        name: "Choose Project",
        // category: 'Editor',
        command: () => {
          //RESET EVERYTHING
          this.getPath();
          this.loadProject(true);
          // this.setFileName("Welcome. Select a file to begin.");
          // this.setFileLang("");
        }
      },

      {
        name: "Open Terminal",
        command: () => {
          this.openTerminal();
        }
      },

      // {
      //   name: 'Git Init',  // should i still use this???
      //   command: () => {
      //     this.initalizeGit();
      //     this.refreshFileTree();
      //     this.addGitCommands();
      //   }
      // }
    ];
    this.state = {
      file_tree: [],
      openFiles: [],
      currentFile: undefined,
      projectPath: "",
      hasGitRepo: false,
      currrentFileName: "Welcome. Select a file to begin.",
      currentFileLang: "",
      commands: this.initalcommands
      // might have currrentFileName and CurrentFileLang but it might all be in the curent file object
    };

    //   this.commands;
    // this.initalcommands = 

    // this.state = this.initalState;


    // this.commands = this.copy(this.initalcommands);
    // console.log(this.initalcommands)
  }

  // componentDidUpdate(prevState){
  //   if (this?.state?.currentFile?.props?.title !== prevState?.currentFile?.props?.title) {
  //     this.commands = [
  //       //Open Terminal
  //       {
  //         name: "Create New File",
  //         // category: 'Editor',
  //         command: () => {
  //           this.newFile();
  //         }
  //       },
  //       {
  //         name: "Refresh File Tree",
  //         // category: 'Editor',
  //         command: () => {
  //           this.refreshFileTree();
  //           this.showNotification("File Tree refreshed", null, "success");
  //         }
  //       },

  //       {
  //         name: "Choose Project",
  //         // category: 'Editor',
  //         command: () => {
  //           //RESET EVERYTHING
  //           this.getPath();
  //           this.loadProject(this.initalState);
  //           // this.setFileName("Welcome. Select a file to begin.");
  //           // this.setFileLang("");
  //         }
  //       },

  //       {
  //         name: "Open Terminal",
  //         command: () => {
  //           this.openTerminal();
  //         }
  //       }
  //     ];
  //   }

  //   this.addGitCommands();
  // }

  showModal = () => {
    console.log("do something");
    this.setState({
      visible: true
    });
  };

  copy = (aObject) => {
    if (!aObject) {
      return aObject;
    }

    let v;
    let bObject = Array.isArray(aObject) ? [] : {};
    for (const k in aObject) {
      v = aObject[k];
      bObject[k] = (typeof v === "object") ? this.copy(v) : v;
    }

    return bObject;
  }

  openTerminal = () => {
    if (os.platform() == "darwin") {
      child_proccess.exec(`open -a Terminal ${this.state.projectPath}`, err => {
        if (err) {
          console.log(err);
          this.showNotification(
            "Unable to open the terminal",
            "Try Again",
            "error"
          );
        }
      });
    } else if (os.platform() == "win32") {
      child_proccess.exec(
        `start cmd.exe /K cd ${this.state.projectPath}`,
        err => {
          if (err) {
            console.log(err);
            this.showNotification(
              "Unable to open the terminal",
              "Try Again",
              "error"
            );
          }
        }
      );
    } else
      this.showNotification(
        "Unable to open the terminal",
        "Platform might not be supported",
        "error"
      );
  };

  loadProject = (newProject) => {
    ipcRenderer.on(RECEIVED_PROJECT_PATH, (event, arg) => {
      // console.log(arg);
      const [project_path] = arg;
      // array destructuring

      walk(project_path, (err, result) => {
        if (result) {
          // handle error
          console.log(result);
          if (newProject) {
            document.body.style.cursor = 'default';
            this.setState({ file_tree: [result], projectPath: project_path, currentFile: undefined, currentFileLang: "", currrentFileName: "Welcome. Select a file to begin.", commands: this.initalcommands, hasGitRepo: false })
            // this.commands = this.copy(this.initalcommands);
            // console.log(this.initalcommands);
            // console.log(this.commands)
            // console.log('Reset')
            this.addGitCommands();
          } else {
            this.setState({ file_tree: [result], projectPath: project_path });
            //this.commands = this.initalcommands;
            //this.addGitCommands();

          }




        } else if (err) {
          this.showNotification(
            `Error in loading ${project_path}`,
            "Please try again",
            "error"
          );
        }
      });
    });
  };

  newFile = () => {
    dialog
      .showSaveDialog(remote.getCurrentWindow(), {
        title: "Create New File",
        defaultPath: this.state.projectPath
      })
      .then(result => {
        if (result.canceled) {
          return;
        } else if (result.filePath) {
          fs.writeFile(result.filePath, "", err => {
            if (err) return;
            this.showNotification(
              `New file ${path_os.basename(result.filePath)} made`,
              null,
              "success"
            );
          });

          //console.log(this.getFileObject(result.filePath, this.state.file_tree))
          this.refreshFileTree();
          console.log(
            this.getFileObject(this.state.file_tree[0], result.filePath)
          );
        }
      });
  };
  setFileName = fileName => {
    this.currrentFileName = fileName;
  };

  setFileLang = fileLang => {
    this.currentFileLang = fileLang;
  };

  showNotification = (message, description, type) => {
    notification[type]({
      message: message,
      placement: "bottomRight",
      description: description,
      className: "notification",
      style: {
        backgroundColor: "#23272a"
        // color: 'white'
      }
    });
  }; //SET GLOBAL GIVE VARIABLE

  addAll = () => {
    git(this.state.projectPath).add(".", err => {
      if (err)
        this.showNotification("Unable to add files", "Try again.", "error");
      else {
        this.showNotification("Added all files to Git", null, "success");
      }
      //ADD SUCCESS MESSAGE
    });
  };

  commitFiles = () => {
    git(this.state.projectPath).commit("new changes made", err => {
      if (err)
        this.showNotification("Unable to commit files", "Try again.", "error");
      else {
        this.showNotification("Commited all files to Git", null, "success");
      }
    });
  };

  pullRepo = () => {
    git(this.state.projectPath).pull(err => {
      if (err)
        this.showNotification(
          "Unable to pull files from Git",
          "Try again",
          "error"
        );
      else {
        this.refreshFileTree();
        this.showNotification("Pulled files from Git", null, "success");
      }
    });
  };

  // initalizeGit = () => {
  //   git(this.state.projectPath).init(false, err => {
  //     if (err)
  //       this.showNotification(
  //         "Unable to initalize Git repository",
  //         "Try again.",
  //         "error"
  //       );
  //     else {
  //       this.showNotification("Initalized new Git repository", null, "success");
  //     }
  //   });
  // };

  addGitCommands = () => {

    if (this.state.projectPath) {
      git(this.state.projectPath).checkIsRepo((err, isRepo) => {
        //console.log(isRepo);
        let newArray;
        if (isRepo) {
          this.setState({ hasGitRepo: true })
          //this.hasGitRepo = true;

          //console.log('working')

          newArray = [...this.state.commands, {
            name: "Git Add All Files",
            // category: 'Git',
            command: () => {
              this.addAll();
            }
          },

          {
            name: "Git Commit (with Defult Message)",
            // category: 'Git',
            command: () => {
              this.commitFiles();
            }
          },

          {
            name: "Git Pull",
            command: () => {
              this.pullRepo();
            }
          }]

          this.setState({ commands: newArray })
          // this.commands.push(

          // );
          //console.log(this.commands);
        } else if (err) {
          this.showNotification(
            "Unable to check Git repo",
            "Check that you have Git installed",
            "error"
          );
        }
      });
    }
  };

  componentDidMount() {

    // git(this.state.projectPath).push()

    // ipcRenderer.on(RECEIVED_PROJECT_PATH, (event, arg) => {
    //   // console.log(arg);
    //   const [project_path] = arg;
    //   // array destructuring

    //   walk(project_path, (err, result) => {
    //     if (result) {
    //       // handle error
    //       console.log(result);
    //       this.setState({ file_tree: [result], projectPath: project_path });
    //       this.addGitCommands();

    //     } else if (err) {
    //       this.showNotification(
    //         `Error in loading ${project_path}`,
    //         "Please try again",
    //         "error"
    //       );
    //     }
    //   });
    // });
    //console.log(this.hasGitRepo);


    this.loadProject(true);

    //this.getIcon();
  }

  componentWillUnmount() {
    //ipcRenderer.removeListener(RECEIVED_PROJECT_PATH); // SHOULD I DO THIS??
  }

  refreshFileTree = () => {
    walk(this.state.projectPath, (err, result) => {
      if (result) {
        // handle error
        //console.log(result);
        this.setState({ file_tree: [result] });
        this.addGitCommands();
      }
    });
  };

  onClick = (keys, event) => {
    //console.log(event);
    let object = event.node.props;
    // let lang = object.mode ? object.mode.name : "Plain Text";
    let lang;

    if (object.mode) {
      lang = object.mode.name;
    } else if (object.isImage) {
      lang = 'Image'
    } else {
      "Plain Text"
    }
    // if (object.mode) {

    // }
    this.setState({ currentFile: event.node, currrentFileName: object.title, currentFileLang: lang });
    console.log(`clicked ${event.node.props.title}`);
    //console.log(this.state.currentFile);

    // if (!object.saved) {
    //   this.setFileName(`${object.title} (Unsaved)`);
    // } else {
    //   this.setFileName(object.title);
    // }
    // if (object.mode) {
    //   this.setFileLang(object.mode.name);
    // } else {
    //   this.setFileLang("Plain Text"); // Language is undefined??? None??? Lang not supported
    // }
  };

  getPath = () => {
    ipcRenderer.send(GET_PROJECT_PATH, "");
    document.body.style.cursor = 'wait';
  };

  getFileObject(element, file_path) {
    // is async needed
    if (element?.props?.path == file_path) {
      console.log("match made");

      return element;
    } else if (element?.props?.children != undefined) {
      var i;
      var result = null;
      for (i = 0; result == undefined && i < element.children.length; i++) {
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
    if (this.state.currentFile) {

      if (this.state.currentFile.props.isImage) {
        View = (
          <ImageViewer path={this.state.currentFile.props.base64} />
        )
      } else {
        View = (
          <CodeEditor
            setFileName={this.setFileName}
            setFileLang={this.setFileLang}
            openFiles={this.state.openFiles}
            currentFile={this.state.currentFile}
            showNotification={this.showNotification}
            showModal={this.showModal}
          />
        );
      }
    } else {
      View = (
        <div
          style={{
            position: "relative",
            height: "100%",
            backgroundColor: "#14171d"
          }}
        >
          <Empty
            className="no-selected-file"
            description={<span>Nothing to see here. (Not final color)</span>}
          />
        </div>
      );
    }

    return View;
  };



  render() {
    return (
      <>
        {this.state.file_tree.length > 0 && (
          <CommandPalette
            commands={this.state.commands}
            closeOnSelect={true}
            hotKeys={["command+shift+p", "ctrl+shift+p"]}
            resetInputOnClose={true}
            placeholder="Enter a command"
          />
        )}

        <div className="container">
          {/* remove min size */}
          <div className="inner-container">
            {/* <div className="inner-grid"> */}
            <SplitPane
              split="vertical"
              defaultSize={280}
              maxSize={350}
              minSize={0}
            >
              {/* set max value */}
              <FileTree
                file_tree={this.state.file_tree}
                getPath={this.getPath}
                onClick={this.onClick}
              />
              {this.getView()}
              {/* <CodeEditor currrentFileName={this.state.currrentFileName} currentFileLang={this.state.currentFileLang} openFiles={this.state.openFiles} currentFile={this.state.currentFile} /> */}
            </SplitPane>
            {/* </div> */}
          </div>

          <div className="low-bar">
            <span className="low-bar-text">
              {/* <Icon type={this.state.currentFile ? "api" : "smile"} /> */}
              <Icon
                type={
                  this.state.hasGitRepo
                    ? 'branches' // or use 'forks'
                    : "api"
                }
              />
            </span>
            <span className="low-bar-text">{this.state.currrentFileName}</span>
            {this.state.currentFileLang && <span className="low-bar-text">{this.state.currentFileLang}</span>}




            {/* {this.state.hasGitRepo &&

              <span className="low-bar-text"><Icon type="branches" /></span>
              // <span className="low-bar-text">Git</span>

            } */}
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
