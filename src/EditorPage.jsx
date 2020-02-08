import React, { Component } from "react";
import Logo from '../M-Editor.png'
import CodeEditor from "./CodeEditor";
import ImageViewer from "./ImageViewer";
import FileTree from "./FileTree";
import SplitPane from "react-split-pane";
import { ipcRenderer } from "electron";
import { Icon } from "antd";
import walk from "./FileDta";
import { walk2, configContent } from "./FileDta"
import CommandPalette from "react-command-palette";
import { remote } from "electron";
import * as os from "os";
import * as fs from "fs";
import * as git from "simple-git";
import * as path_os from "path";
import * as child_proccess from "child_process";
import Moustrap from 'mousetrap';
import AppIcon from '../M-Editor.png'
const { dialog, Menu } = remote;

const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === "development";
const isMac = process.platform === "darwin";

import { Empty, notification } from "antd";

import {
  GET_PROJECT_PATH,
  RECEIVED_PROJECT_PATH,
  SEND_SAVE_FILE_SIGNAL,
  CANCELED
} from "../utils/constants";

import "./EditorPage.css";

import { TitleBar } from 'electron-react-titlebar'
import 'electron-react-titlebar/assets/style.css'

const currentWindow = remote.getCurrentWindow();

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
  cursorPosition;
  constructor(props) {
    super(props);
    this.cursorPosition = undefined;
    //this.CodeEditor = React.createRef();

    let Menu = remote.Menu;

    this.template = [
      ...(isMac
        ? [
          {
            label: remote.app.name,
            submenu: [
              { role: "about" },
              { type: "separator" },
              { role: "services" },
              { type: "separator" },
              { role: "hide" },
              { role: "hideothers" },
              { role: "unhide" },
              { type: "separator" },
              { role: "quit" }
            ]
          }
        ]
        : []),

      {
        label: "File",
        submenu: [isMac ? { role: "close" } : { role: "quit" }]
      },

      ...(isDev
        ? [
          {
            label: "DevTools",
            submenu: [
              { role: "reload" },
              { role: "forcereload" },
              { role: "toggledevtools" }
            ]
          }
        ]
        : []),

      // {
      //   label: "DevTools",
      //   submenu: [
      //     { role: "reload" },
      //     { role: "forcereload" },
      //     { role: "toggledevtools" }
      //   ]
      // },

      {
        label: "Git Commands",

        submenu: [
          {
            label: "Git Init",
            click: () => {
              this.initalizeGit();
            }
          },
          {
            label: "Git Add",
            click: () => {
              this.addAll();
            }
          },

          {
            label: "Git Commit",
            click: () => {
              this.commitFiles();
            }
          },

          {
            label: "Git Pull",
            click: () => {
              this.pullRepo();
            }
          }
        ]
      },
      {
        label: "Commands",
        submenu: [
          {
            label: "New File",
            click: () => {
              this.newFile();
            }
          },
          {
            label: "Choose Project",
            click: () => {
              this.getPath();
              this.loadProject(true);
            }
          },

          {
            label: "Generate Config File",
            click: () => {
              this.generateConfigFile();
            }
          },

          {
            label: "Open Terminal",
            click: () => {
              this.openTerminal();
            }
          },
          {
            label: "Refresh File Tree",
            click: () => {
              this.refreshFileTree();
            }
          },
          {
            label: "Save File",
            click: () => {
              this.sendSaveFile();
            }
          },

          // {
          //   label: "Command Pallette",
          //   click: () => {
          //     this.callCommandPallete();
          //   }
          // }
        ]
      },

      { role: "editMenu" },

      //  ...(isMac
      //   ? [
      //     {role: "help"}
      //   ] 
      //   : []),


      // think about this

      //   {label: 'Edit',
      //   submenu: [
      //     {label:}
      //   ]
      // }
    ];

    let appMenu = Menu.buildFromTemplate(this.template);
    Menu.setApplicationMenu(appMenu);

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

      {
        name: 'Generate M-Editor Config File',
        command: () => {
          this.generateConfigFile();
        }
      }

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
      openPallette: false,
      currentFile: undefined,
      projectPath: "",
      hasGitRepo: false,
      currrentFileName: "Welcome. Select a file to begin.",
      currentFileLang: "",
      commands: this.initalcommands,
      cursorPosition: undefined,
      errors: 0,
      warnings: 0
      // cursorLine: 0,
      // cursorCol: 0,

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

  sendSaveFile = () => {
    if (this.state.currentFile) {
      ipcRenderer.send(SEND_SAVE_FILE_SIGNAL, "");
    }
  };

  callCommandPallete = () => {
    if (this.state.file_tree.length > 0) {
      console.log('done')

      Moustrap.trigger("ctrl+shift+p");

    }
  }

  showModal = () => {
    console.log("do something");
    this.setState({
      visible: true
    });
  };

  copy = aObject => {
    if (!aObject) {
      return aObject;
    }

    let v;
    let bObject = Array.isArray(aObject) ? [] : {};
    for (const k in aObject) {
      v = aObject[k];
      bObject[k] = typeof v === "object" ? this.copy(v) : v;
    }

    return bObject;
  };

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

  loadProject = newProject => {
    ipcRenderer.on(RECEIVED_PROJECT_PATH, (event, arg) => {
      // console.log(arg);
      const [project_path] = arg;
      // array destructuring
      //walk2(project_path, (err, result) => {if (result) console.log('Walk 2: ', result)})
      walk2(project_path, (err, result) => {
        if (result) {
          // handle error
          console.log(result);
          if (newProject) {
            document.body.style.cursor = "default";
            this.setState({
              file_tree: [result],
              projectPath: project_path,
              currentFile: undefined,
              currentFileLang: "",
              currrentFileName: "Welcome. Select a file to begin.",
              commands: this.initalcommands,
              hasGitRepo: false,
              cursorPosition: undefined,
              warnings: 0,
              errors: 0
            });
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
  // codenirror languages


  generateConfigFile = () => {
    let config_file_path = path_os.resolve(this.state.projectPath, 'm-editor.config.json');
    // set global path
    if (fs.existsSync(config_file_path)) {
      this.showNotification('M-Editor Config file already exists in this project', null, 'error');
    } else {  // '{\n\t"git": {}\n}'
      try {
        fs.writeFileSync(config_file_path, configContent);
        this.refreshFileTree()
        this.showNotification('M-Editor Config file made.', null, 'success');
      } catch (err) {
        console.log(err)
        this.showNotification('Unable to make M-Editor Config file', null, 'error');
      }
    }
  }

  newFile = () => {
    if (this.state.file_tree.length > 0) {
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
              if (err) { console.log(err); return; }
              this.showNotification(
                `New file ${path_os.basename(result.filePath)} made`,
                null,
                "success"
              );
              this.refreshFileTree();
            });

            //console.log(this.getFileObject(result.filePath, this.state.file_tree))


          }
        });
    }
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
    if (this.state.projectPath) {
      git(this.state.projectPath).add(".", err => {
        if (err)
          this.showNotification("Unable to add files", "Try again.", "error");
        else {
          this.showNotification("Added all files to Git", null, "success");
        }
        //ADD SUCCESS MESSAGE
      });
    } else this.showNotification('No project selected.', null, 'error')
  };

  getConfigFileContent = () => {
    let config_file_path = path_os.resolve(this.state.projectPath, 'm-editor.config.json');
    console.log(config_file_path)
    try {
      let config_content = JSON.parse(fs.readFileSync(config_file_path, 'utf8'));
      console.log(config_content)
      return config_content;
    } catch (err) {
      console.log(err)
      this.showNotification("Unable to read M-Editor Config File", 'Try Again', 'error')
    }

  }

  commitFiles = () => {
    if (this.state.projectPath) {
      let commit_message;
      if (fs.existsSync(path_os.resolve(this.state.projectPath, 'm-editor.config.json'))) {
        commit_message = this.getConfigFileContent()?.git?.commit_message;
      }

      console.log(this.getConfigFileContent())
      let final_message = commit_message || "new changes made";


      // if (commit_message) {
      //   final_message = commit_message;
      // } else {
      //   final_message = "new changes made"
      // }

      // final_message = commit_message? commit_message: "new changes made"
      git(this.state.projectPath).commit(final_message, err => {
        if (err)
          this.showNotification("Unable to commit files", "Try again.", "error");
        else {
          this.showNotification("Commited all files to Git", null, "success");
        }
      });
    } else this.showNotification('No project selected.', null, 'error')
  };

  pullRepo = () => {
    if (this.state.projectPath) {
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
    }
  };

  initalizeGit = () => {

    if (this.state.projectPath) {
      git(this.state.projectPath).init(false, err => {
        if (err)
          this.showNotification(
            "Unable to initalize Git repository",
            "Try again.",
            "error"
          );
        else {
          this.showNotification("Initalized new Git repository", null, "success");
          this.addGitCommands();
        }
      });
    } else this.showNotification('No project selected.', null, 'error')
  };

  addGitCommands = () => {
    if (this.state.projectPath) {
      git(this.state.projectPath).checkIsRepo((err, isRepo) => {
        //console.log(isRepo);
        let newArray;
        if (isRepo) {
          //git(this.state.projectPath).raw(["rev-parse", "--abbrev-ref", 'HEAD'], (err, results) => {console.log(results)})
          this.setState({ hasGitRepo: true });
          //this.hasGitRepo = true;

          //console.log('working')

          newArray = [
            ...this.state.commands,
            {
              name: "Git Add All Files",
              // category: 'Git',
              command: () => {
                this.addAll();
              }
            },

            {
              name: "Git Commit",
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
            }
          ];

          this.setState({ commands: newArray });
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

    ipcRenderer.on(CANCELED, () => {
      document.body.style.cursor = "default";
    })
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

  resetcurrentFile = () => {
    this.setState({ currentFile: undefined, currentFileLang: "", currrentFileName: "Welcome. Select a file to begin.", })
  }

  setCursorPosition = (position) => {
    //console.log(position)
    if (this.state.currentFile && position) {
      // this.cursorPosition = position;
      this.setState({ cursorPosition: position })

    }
  }

  refreshFileTree = () => {

    if (this.state.projectPath) {
      walk2(this.state.projectPath, (err, result) => {
        if (result) {
          // handle error
          //console.log(result);
          this.setState({ file_tree: [result] });
          //this.showNotification("File Tree refreshed", null, "success"); // after the setState or after the gitcommands?
          this.addGitCommands();



        } else if (err) {
          this.showNotification('Unable to refresh File Tree', null, 'error')
        }
      });
    }
  };

  onClick = (keys, event) => {
    //console.log(event);
    // const projectName = path_os.basename(this.state.projectPath);
    let object = event.node.props;
    // if (object.path === this.state?.currentFile?.props?.path) return;
    // let lang = object.mode ? object.mode.name : "Plain Text";
    let lang;

    if (object.mode) {
      lang = object.mode.name;  
    } else if (object.isImage) {
      lang = "Image";
    } else {
      lang = "Plain Text";
    }
    // if (object.mode) {

    // }
    this.setState({
      currentFile: event.node,
      currrentFileName: object.title,
      currentFileLang: lang,
      // warnings: 0, //might not need to do this
      // errors: 0
    });
    // currentWindow.setTitle(`${object.title} - ${projectName}`); // dont really ned to do this
    //console.log(`clicked ${event.node.props.title}`);
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
    document.body.style.cursor = "wait";
  };

  // getFileObject(element, file_path) {
  //   // is async needed
  //   if (element?.props?.path == file_path) {
  //     console.log("match made");

  //     return element;
  //   } else if (element?.props?.children != undefined) {
  //     var i;
  //     var result = null;
  //     for (i = 0; result == undefined && i < element.children.length; i++) {
  //       result = this.getFileObject(element.children[i], file_path); // await
  //     }
  //     return result;
  //   }
  //   return null;
  // }

  getView = () => {
    let View;
    // add if no files are opened???
    // this.state.file_tree && this.state.file_tree.length
    if (this.state.currentFile) {
      if (
        this.state.currentFile.props.isImage &&
        this.state.currentFile.props.base64
      ) {
        View = <ImageViewer path={this.state.currentFile.props.base64} />;
      } else {
        View = (
          <CodeEditor
            // ref={this.CodeEditor}
            setFileName={this.setFileName}
            setFileLang={this.setFileLang}
            openFiles={this.state.openFiles}
            currentFile={this.state.currentFile}
            showNotification={this.showNotification}
            setCursorPosition={this.setCursorPosition}
            setErrorAndWarningNumber={this.setErrorAndWarningNumber}

          />
        );
      }
    } else {
      View = (
        <div
          style={{
            position: "relative",
            height: "100%",
            // backgroundColor: "#14171d"
            backgroundColor: "#212121"
          }}
        >
          <Empty
            className="no-selected-file"
            image={Logo}
            // image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={<span>Nothing to see here. </span>}
          />
        </div>
      );
    }

    return View;
  };

  openPallette = () => {
    this.open = true;
    console.log("Hello");
  };

  setErrorAndWarningNumber = (errors, warnings) => {
     
      this.setState({ errors: errors, warnings: warnings })
    
  }

  render() {
    return (
      <>
      {/* <TitleBar menu={this.template} icon={AppIcon} />   */}
        {this.state.file_tree.length > 0 && (
          <>
          
          <CommandPalette
            commands={this.state.commands}
            closeOnSelect={true}
            hotKeys={["command+shift+p", "ctrl+shift+p"]}
            resetInputOnClose={true}
            placeholder="Enter a command"
            maxDisplayed={10}

            
          />
          
          </>
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
                refreshFileTree={this.refreshFileTree}
                projectPath={this.state.projectPath}
                showNotification={this.showNotification}
                currentFile={this.state.currentFile}
                newFile={this.newFile}
                resetcurrentFile={this.resetcurrentFile}
                generateConfigFile={this.generateConfigFile}
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
                    ? "branches" // or use 'forks'
                    : "api"
                }
              />
            </span>
            <span className="low-bar-text">{this.state.currrentFileName}</span>
            {this.state.currentFileLang && (
              <span className="low-bar-text">{this.state.currentFileLang}</span>
            )}



            {(this.state.cursorPosition && !this?.currentFile?.props?.base64) && (  // figure out image subbprt
              <span className="low-bar-text cursor-position">{`Line ${this.state.cursorPosition.line + 1}, Column ${this.state.cursorPosition.ch + 1}`}</span>
            )}

            {(this.state.currentFile && !this?.currentFile?.props?.base64) && (  // figure out image subbprt
              <>
                <span className="low-bar-text cursor-position"><Icon type="close-circle" /> {this.state.errors}</span>
                <span className="low-bar-text cursor-position"><Icon type="warning" /> {this.state.warnings}</span>
              </>
            )}


            {/* {(this.state.hasGitRepo && this.state.currentFile) && (
              <span className="low-bar-text git">Git</span>
            )} */}



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
