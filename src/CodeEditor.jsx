import React, { Component } from 'react';
import * as codemirror from 'codemirror'
import { notification } from 'antd';
import * as fs from 'fs';
// import { Empty } from 'antd';
import 'codemirror-colorpicker/dist/codemirror-colorpicker.css'
import 'codemirror-colorpicker'



import './CodeEditor.css';


import Moustrap from 'mousetrap';





export default class CodeEditor extends Component {

    codeEditor;

    constructor(props) {
        super(props);

        this.editor = null;


        this.state = {
            currentFile: undefined
        };

        Moustrap.bind(['ctrl+s', 'command+s'], () => {
            this.saveFile();
        })







    }

    setEditor = (ref) => {
        this.editor = ref;
    }

    swapDoc = () => {
        if (this.state.currentFile) {
            console.log(this.state.currentFile.props);
            let object = this.state.currentFile.props;
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
            })
            console.log('saved file')
            this.showNotification(`File ${this?.state?.currentFile?.props?.title} saved`, null, 'success');
            this.state.currentFile.props.document.clearHistory()

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
        if (props?.currentFile?.props?.title !== state?.currentFile?.props?.title) {
            return {
                currentFile: props.currentFile,
            };
        }
        return null;
    }

    componentDidMount() {
        // console.log(this.editor);
        codemirror.commands.save = () => {
            this.saveFile();
        }

        codemirror.commands.autocomplete = function (cm) {
            cm.showHint({ hint: codemirror.hint.anyword });
        };

        //  FIGURE OUT EDITOR THEME
        this.codeEditor = codemirror(this.editor, {
            // value: "function myScript(){return 100;}\n",
            // value: 'Welcome to M-Editor! Select a file to begin.',
            // mode:  "javascript",
            lineNumbers: true,
            autocorrect: true,
            spellcheck: true,
            matchBrackets: true,
            matchTags: true,
            autoCloseBrackets: true,
            autoCloseTags: true,
            showMatchesOnScrollbar: true,
            smartIndent: true,
            indentWithTabs: true,
            hintOptions: { completeSingle: false },
            lint: true,
            // gutters: ["CodeMirror-lint-markers"],
            // lineWrapping: true, // lines should not be too long anywahy
            styleActiveLine: true,
            //placeholder: 'Code goes here...',
            keyMap: 'sublime',
            theme: 'material-darker',
            colorpicker: {
                mode: 'edit'
            } // think about theme
        })

        this.swapDoc()

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

    componentDidUpdate() {
        //this.codeEditor.setOption('value', this.state.currentFile.props.title);
        // setFileName
        // swap doc
        //console.log(this.state.currentFile.props);
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
                <div className="editor-container">

                    {/* {this.state.currentFile !== undefined && 
            
                <div className="editor" ref={this.setEditor}></div>
          
            } */}

                    <div className="editor" ref={this.setEditor}></div>

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