import React, { Component } from 'react';
import * as codemirror from 'codemirror'
import { notification } from 'antd';
import { remote } from "electron";
import * as fs from 'fs';
import { ipcRenderer } from "electron";
import { RECEIVED_SAVE_FILE_SIGNAL } from "../utils/constants";
// import { Empty } from 'antd';
import 'codemirror-colorpicker/dist/codemirror-colorpicker.css'
import 'codemirror-colorpicker'



import './CodeEditor.css';


import Moustrap from 'mousetrap';





export default class CodeEditor extends Component {

    codeEditor;
    menu;
    constructor(props) {
        super(props);

        this.editor = React.createRef();


        this.state = {
            currentFile: undefined
        };



        Moustrap.bind(['ctrl+s', 'command+s'], () => {
            this.saveFile();
        });

        // const appMenu = this.props.Appmenu;
        // console.log(appMenu)
        // appMenu.append({
        //     label: 'Editor' ,
        //     submenu: [
        //         {label: 'Save File', click: () => {this.saveFile()}}
        //     ]
        // })







    }

    // setEditor = (ref) => {
    //     this.editor = ref;
    // }

    swapDoc = () => {
        if (this.state.currentFile) {
            console.log(this.state.currentFile.props);
            let object = this.state.currentFile.props;
            console.log(object.document.cm);
            if (object.document.cm) { console.log('hello', object.document.cm); object.document.cm = null; } // why was this giving an eror
            this.codeEditor.swapDoc(object.document);
            // if (!object.saved) {
            //     this.props.setFileName(`${object.title} (Unsaved)`);
            //   } else{
            //     this.props.setFileName(object.title);
            //   }
            //   if (object.mode){
            //     this.props.setFileLang(object.mode.name);
            //   } else {
            //     this.props.setFileLang('Plain Text'); // Language is undefined??? None??? Lang not supported
            //   }
            this.codeEditor.setOption('mode', object.mode?.mime);
            this.codeEditor.setOption('mode', this.codeEditor.getOption('mode'));
            //console.log(this.state.currentFile.props);
        }
    }

    showNotification = (message, description, type) => {
        notification[type]({
            message: message,
            // duration: 0,
            placement: 'bottomRight',
            description: description,
            className: 'notification',
            style: {
                backgroundColor: '#23272a',
                // color: 'white'
            }

        });

    }

    saveFile = () => {
        //console.log(this.state.currentFile.props);
        if (this.state.currentFile && fs.existsSync(this?.state?.currentFile?.props?.path)) {
            let text = this.codeEditor.getDoc().getValue();
            fs.writeFile(this.state.currentFile.props.path, text, (err) => {
                if (err) {
                    this.showNotification('Unable to save file.', 'Try again', 'error');
                    return;
                }

                console.log('saved file')
                this.showNotification(`File ${this.state.currentFile.props.title} saved`, null, 'success');
                this.state.currentFile.props.document.clearHistory()
            })


        }
    }

    // static getDerivedStateFromProps(props, state) {


    //     if (props.currentFile.path !== state.currentFile.path) {
    //       return {
    //         currentFile: props.currentFile,



    //       };
    //     }


    //   }

    static getDerivedStateFromProps(props, state) {

        // Any time the current user changes,
        // Reset any parts of state that are tied to that user.
        // In this simple example, that's just the email.
        //console.log(props?.currentFile?.props?.path, state?.currentFile?.props?.path)
        if (props?.currentFile?.props?.path !== state?.currentFile?.props?.path) {
            //console.log('derived state');
            return {
                currentFile: props.currentFile,
            };
        }
        return null;
    }

    componentDidMount() {
        // console.log(this.editor);

        ipcRenderer.on(RECEIVED_SAVE_FILE_SIGNAL, () => {
            this.saveFile();
        })

        codemirror.commands.save = () => {
            this.saveFile();
        }



        codemirror.commands.autocomplete =  (cm) => {
            let hint;
            // look at all applicable languages
            let mode = this.state.currentFile.props.mode.name.toLowerCase();

            if (mode === 'javascript' || mode === 'jsx' || mode === 'typescript') {
                hint = codemirror.hint.javascript;
            } else if (mode === 'html') {
                hint = codemirror.hint.html;
            } else if (mode === 'css' || mode === 'scss' || mode === 'less' || mode === 'sass') {
                // confirm this works for all modes
                hint = codemirror.hint.css;

            } else {
                hint = codemirror.hint.anyword
            }
            cm.showHint({ hint: hint});
        };



        //  FIGURE OUT EDITOR THEME
        this.codeEditor = codemirror(this.editor.current, {
            // value: "function myScript(){return 100;}\n",
            // value: 'Welcome to M-Editor! Select a file to begin.',
            // mode:  "javascript",
            lineNumbers: true,
            lint: true,
            autocorrect: true,
            spellcheck: true,
            matchBrackets: true,
            matchTags: true,
            autoCloseBrackets: true,
            autoCloseTags: true,
            showMatchesOnScrollbar: true,
            gutters: ["CodeMirror-lint-markers"],
            smartIndent: true,
            indentWithTabs: true,
            hintOptions: { completeSingle: false },
            lint: true,
            lint: {
                onUpdateLinting: ((annotations) => {
                    console.log("annotations change", annotations); 

                     if (this.state.currentFile.props.mode.name == 'JSON') {
                         let json_errors = annotations.length;
                         this.props.setErrorAndWarningNumber(json_errors, 0);
                     } else {

                    //this.props.setErrorAndWarningNumber
                    let errors = annotations.filter((item) => item.severity === 'error').length;
                    let warnings = annotations.filter((item) => item.severity === 'warning').length;
                    this.props.setErrorAndWarningNumber(errors, warnings);
                     }
                }),
                options: { //look at options JSHINT, csslint options
                    // https://github.com/CSSLint/csslint/wiki/Rules
                    //https://jshint.com/docs/options/
                    //   'asi': false,
                    //   'curly': true,
                    //   "browser": true,
                    //   "jquery": true,
                    //   "devel": true,
                    //   "varstmt": true, // think about this
                    //   "node": true,
                    //   "latedef": false, // look at this
                    //   "undef": true,
                    //   "trailing": true,     // Prohibit trailing whitespaces.
                    //   "unused": true,
                    //   'eqeqeq': true,
                    //WATCH HOW MANY OPTIONS I AM LOADING!!!!
                    //CSS RULES (REVIEW)
                    'duplicate-properties': true, 
                    'unqualified-attributes': true,
                    'regex-selectors': true,
                    'floats': true,
                    'fallback-colors': true,
                    'empty-rules': true, 
                    'shorthand': true,
                    // JS RULES (REVIEW)
                    'maxerr': 100,
                    "node": true,
                    "browser": true,
                    "esnext": true,
                    "bitwise": true,
                    "predef": [         // Extra globals.
                        "require", 'chrome'
                      ],
                    "curly": true,
                    "eqeqeq": true,
                    "immed": true,
                    "indent": 2,
                    "latedef": "nofunc", //true
                    // "laxbreak": true,
                    "newcap": true,
                    "noarg": true,
                    // "quotmark": "single",
                    "regexp": true,
                    "undef": true,
                    "unused": true,
                    // "strict": true,
                    "trailing": true,
                    "smarttabs": true,
                    "expr": true,
                    "node": true,
                    // "globalstrict": true,
                    "esnext": true, // think about this
                    //   '-W041': false,????
                    //   "globalstrict": true, 
                    //   'esversion': 10
                }
            },
            // gutters: ["CodeMirror-lint-markers"],
            // lineWrapping: true, // lines should not be too long anywahy
            styleActiveLine: true,
            //placeholder: 'Code goes here...',
            keyMap: 'sublime',
            extraKeys: {"Ctrl-Space": "autocomplete" , ".": (cm) => {
                setTimeout(() => {
                  cm.execCommand("autocomplete")
                    }, 100); throw new Error('Need this error to show to work');}},
            theme: 'material-darker',
            colorpicker: {
                mode: 'edit'
            } // think about theme
        })

        this.codeEditor.on("focus", (cm, obj) => {
            //console.log(cm.getCursor());
            this.props.setCursorPosition(cm.getCursor());
        })

        this.codeEditor.on("cursorActivity", (cm, obj) => {
            //console.log(cm.getCursor());
            //console.log('activity')
            this.props.setCursorPosition(cm.getCursor());
        })

        this.codeEditor.on("swapDoc", (cm, obj) => {
            //console.log(cm.getCursor());
            this.props.setCursorPosition(cm.getCursor());
        })

        // reconsider


        // this.codeEditor.on("keyup", function (cm, event) {
        //     //console.log(event.keyCode)
        //     if (!cm.state.completionActive && (event.keyCode && event.keyCode > 64 && event.keyCode < 91)) {


        //         codemirror.commands.autocomplete(cm);
        //     }
        // });
        const menu = new remote.Menu();
        menu.append(new remote.MenuItem({ label: 'Go To Start', click: (e) => { console.log(e); this.codeEditor.execCommand('goDocStart') } }));
        menu.append(new remote.MenuItem({ label: 'Go To End', click: (e) => { console.log(e); this.codeEditor.execCommand('goDocEnd') } }));
        menu.append(new remote.MenuItem({ label: 'Undo', click: () => { this.codeEditor.execCommand('undo') } }));
        menu.append(new remote.MenuItem({ label: 'Redo', click: () => { this.codeEditor.execCommand('redo') } }));
        menu.append(new remote.MenuItem({ label: 'Comment', click: () => { this.codeEditor.execCommand('toggleCommentIndented') } }));
        menu.append(new remote.MenuItem({ label: 'Find', click: (e) => { console.log(e); this.codeEditor.execCommand('find') } }));
        menu.append(new remote.MenuItem({ label: 'Select All', click: () => { this.codeEditor.execCommand('selectAll') } }));
        menu.append(new remote.MenuItem({ label: 'Indent', click: () => { this.codeEditor.execCommand('defaultTab') } }));
        menu.append(new remote.MenuItem({ label: 'Replace', click: () => { this.codeEditor.execCommand('replace') } }));
        menu.append(new remote.MenuItem({ label: 'Replace All', click: () => { this.codeEditor.execCommand('replaceAll') } }));
        menu.append(new remote.MenuItem({ type: 'separator' }));
        menu.append(new remote.MenuItem({ label: 'Save File', click: () => { this.codeEditor.execCommand('save') } }));



        this.menu = menu;

        //console.log(codemirror.commands);
        this.swapDoc();



        // if (this.state.currentFile) {
        //     console.log(this.state.currentFile.props);
        //     let object = this.state.currentFile.props;
        //     this.codeEditor.swapDoc(object.document);
        //     // if (!object.saved) {
        //     //     this.props.setFileName(`${object.title} (Unsaved)`);
        //     //   } else{
        //     //     this.props.setFileName(object.title);
        //     //   }
        //     //   if (object.mode){
        //     //     this.props.setFileLang(object.mode.name);
        //     //   } else {
        //     //     this.props.setFileLang('Plain Text'); // Language is undefined??? None??? Lang not supported
        //     //   }
        //     this.codeEditor.setOption('mode', object.mode?.mime);
        //     this.codeEditor.setOption('mode', this.codeEditor.getOption('mode'));
        //     //console.log(this.state.currentFile.props);
        // }


    }

    componentDidUpdate(prevProps, prevState) {
        //console.log('changed')
        //prevState.currentFile.props.path !== this.state.currentFile.props.path
        if (prevProps.currentFile.props.path !== this.props.currentFile.props.path) {
            this.swapDoc();
        }
        //this.codeEditor.setOption('value', this.state.currentFile.props.title);
        // setFileName
        // swap doc
        //console.log(this.state.currentFile.props);
        // this.codeEditor.refresh();
        //this.swapDoc();
        // if (this.state.currentFile) {
        //     console.log(this.state.currentFile.props);
        //     let object = this.state.currentFile.props;
        //     this.codeEditor.swapDoc(object.document);
        //     // if (!object.saved) {
        //     //     this.props.setFileName(`${object.title} (Unsaved)`);
        //     //   } else{
        //     //     this.props.setFileName(object.title);
        //     //   }
        //     //   if (object.mode){
        //     //     this.props.setFileLang(object.mode.name);
        //     //   } else {
        //     //     this.props.setFileLang('Plain Text'); // Language is undefined??? None??? Lang not supported
        //     //   }
        //     this.codeEditor.setOption('mode', object.mode?.mime);
        //     this.codeEditor.setOption('mode', this.codeEditor.getOption('mode'));
        //     //console.log(this.state.currentFile.props);
        // }
    }

    showContextMenu = (event) => {
        // console.log(event.target)
        event.preventDefault();
        this.menu.popup({ window: remote.getCurrentWindow() });
    }


    // read up on component lifecycle events
    //  componentDidUpdate(prevProps) { 





    //         // if (this.props.currentFile !== this.prevProps.currentFile) {
    //         //     this.setState({currentFile: this.props.currentFile});
    //         // }
    //     // this.props.currentFile.props.title;
    //     // do i still need this method?? 


    //     let code = codemirror(this.editor, {
    //         //value: `Hello ${this.props.currentFile}`, 
    //         mode:  "javascript",
    //         lineNumbers: true,
    //         autocorrect: true,
    //         spellcheck: true,
    //         matchBrackets: true,
    //         matchTags: true,
    //         autoCloseBrackets: true,
    //         autoCloseTags: true,
    //         showMatchesOnScrollbar: true,
    //         smartIndent: true,
    //         indentWithTabs: true,
    //         hintOptions: {completeSingle: false},
    //         lint: true,
    //         // gutters: ["CodeMirror-lint-markers"],
    //         // lineWrapping: true, // lines should not be too long anywahy
    //         styleActiveLine: true,
    //         //placeholder: 'Code goes here...',
    //         keyMap: 'sublime',
    //         theme: 'material-darker',
    //         colorpicker : {
    //             mode : 'edit'
    //         } // think about theme
    //     })


    //     //this.swapDoc(); 
    // }

    // swapDoc = () => {

    // }



    render() {


        return (
            <>
                <div className="editor-container" >

                    {/* {this.state.currentFile !== undefined && 
            
                <div className="editor" ref={this.setEditor}></div>
          
            } */}

                    <div className="editor" ref={this.editor} onContextMenu={this.showContextMenu}></div>

                    {/* {this.state.currentFile === undefined && 
            
            <div style={{position: 'relative', height: '100%', backgroundColor: '#14171d'}}>
                <Empty className="no-selected-file" description={
                    <span>No file selected. (Not final color)</span>
                }/>
            </div>} */}


                </div>






            </>

        );


    }

}