import React, { Component } from 'react';
import * as codemirror from 'codemirror'

import './CodeEditor.css';








export default class CodeEditor extends Component {

    constructor(props){
        super(props);
        
        this.editor = null;

        

        

        

    }

    setEditor = (ref) => {
        this.editor = ref;
    }

    

    componentDidMount() {
        console.log(this.editor);
        // might try and call in constructure
        let code = codemirror(this.editor, {
            value: "function myScript(){return 100;}\n",
            mode:  "javascript",
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
            hintOptions: {completeSingle: false},
            lint: true,
            // gutters: ["CodeMirror-lint-markers"],
            lineWrapping: true, // lines should not be too long anywahy
            styleActiveLine: true,
            //placeholder: 'Code goes here...',
            keyMap: 'sublime',
            theme: 'material-darker' // think about theme
        })

        
    }

    render() {

        
        return(
    <>
        <div className="editor-container">
                  
            <div className="editor" ref={this.setEditor}></div>

           
                   
 
        </div>

            <div className="low-bar">
                <p className="low-bar-text">{this.props.currrentFileName}</p>
                <div className="low-bar-text">{this.props.currentFileLang}</div>
            </div>
         </>   
    
        );

        
    }

}