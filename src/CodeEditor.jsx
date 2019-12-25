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

        this.state = {
            currentFile: undefined
        };

        

        

        

    }

    setEditor = (ref) => {
        this.editor = ref;
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
        if (props.currentFile !== state.currentFile) {
          return { 
            currentFile: props.currentFile,
          };
        }
        return null;
      }

    // componentDidMount() {
    //     // console.log(this.editor);
  

    //     //  FIGURE OUT EDITOR THEME
    //     let code = codemirror(this.editor, {
    //         value: "function myScript(){return 100;}\n",
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
    //         lineWrapping: true, // lines should not be too long anywahy
    //         styleActiveLine: true,
    //         //placeholder: 'Code goes here...',
    //         keyMap: 'sublime',
    //         theme: 'material-darker',
    //         colorpicker : {
    //             mode : 'edit'
    //         } // think about theme
    //     })

        
    // }

    
    // read up on component lifecycle events
     componentDidUpdate(prevProps) { 

    

            

            // if (this.props.currentFile !== this.prevProps.currentFile) {
            //     this.setState({currentFile: this.props.currentFile});
            // }
        // this.props.currentFile.props.title;
        // do i still need this method?? 

    
        let code = codemirror(this.editor, {
            value: `Hello ${this.props.currentFile}`, 
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
            // lineWrapping: true, // lines should not be too long anywahy
            styleActiveLine: true,
            //placeholder: 'Code goes here...',
            keyMap: 'sublime',
            theme: 'material-darker',
            colorpicker : {
                mode : 'edit'
            } // think about theme
        })
    

        //this.swapDoc(); 
    }

    swapDoc = () => {}

    

    render() {

        
        return(
    <>
        <div className="editor-container">
                  
            {this.state.currentFile !== undefined && 
            
                <div className="editor" ref={this.setEditor}></div>
          
            }

            {this.state.currentFile === undefined && 
            
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