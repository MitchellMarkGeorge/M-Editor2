import React, { Component } from 'react';
import * as codemirror from 'codemirror'
import { Empty } from 'antd';
import 'codemirror-colorpicker/dist/codemirror-colorpicker.css'
import 'codemirror-colorpicker' 


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
        // console.log(this.editor);
        // might try and call in constructure

        //  FIGURE OUT EDITOR THEME
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
            theme: 'material-darker',
            colorpicker : {
                mode : 'edit'
            } // think about theme
        })

        
    }

    render() {

        
        return(
    <>
        <div className="editor-container">
                  
            {this.props.openFiles.length > 0 && <div className="editor" ref={this.setEditor}></div>}

            {this.props.openFiles.length === 0 && 
            
            <div style={{position: 'relative', height: '100%', backgroundColor: '#14171d'}}>
                <Empty className="no-selected-file" description={
                    <span>No file selected. (Not final color)</span>
                }/>
            </div>}
                   
 
        </div>

    
            
          

            
         </>   
    
        );

        
    }

}