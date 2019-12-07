import React, { Component } from 'react';
import * as codemirror from 'codemirror'
// FEATURES
// import 'codemirror/addon/mode/loadmode.js';
import 'codemirror/lib/codemirror.js';
import 'codemirror/addon/dialog/dialog.js';
import 'codemirror/addon/comment/comment.js';
import 'codemirror/addon/search/searchcursor.js';
import 'codemirror/addon/search/search.js';
import 'codemirror/addon/search/jump-to-line.js';
import 'codemirror/addon/search/matchesonscrollbar.js';
import 'codemirror/addon/edit/matchbrackets.js';
import 'codemirror/addon/edit/matchtags.js';
import 'codemirror/addon/edit/closetag.js';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/javascript-hint.js';
import 'codemirror/addon/hint/xml-hint.js';
import 'codemirror/addon/hint/html-hint.js';
import 'codemirror/addon/hint/css-hint.js';
import 'codemirror/addon/hint/anyword-hint.js';
import 'codemirror/addon/hint/sql-hint.js';
import 'codemirror/addon/search/match-highlighter.js';
import 'codemirror/addon/edit/closebrackets.js';
import 'codemirror/addon/scroll/annotatescrollbar.js';
import 'codemirror/addon/edit/continuelist.js';
import 'codemirror/addon/selection/active-line.js';
import 'codemirror/mode/meta.js';
import 'codemirror/addon/display/placeholder.js';
import 'codemirror/keymap/sublime.js';
import 'codemirror/addon/lint/lint.js';
import 'codemirror/addon/lint/javascript-lint.js';
import 'codemirror/addon/lint/json-lint.js';
import 'codemirror/addon/lint/css-lint.js';
import 'codemirror/addon/display/autorefresh.js'




// LANGS/ MODES
import 'codemirror/mode/htmlmixed/htmlmixed.js';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/mode/markdown/markdown.js';
import 'codemirror/mode/clike/clike.js';
import 'codemirror/mode/css/css.js';
import 'codemirror/mode/dart/dart.js';
import 'codemirror/mode/xml/xml.js';
import 'codemirror/mode/sql/sql.js';
import 'codemirror/mode/gfm/gfm.js';
import 'codemirror/mode/python/python.js';
import 'codemirror/mode/sass/sass.js';
import 'codemirror/mode/handlebars/handlebars.js';
import 'codemirror//mode/swift/swift.js';
import 'codemirror/mode/jsx/jsx.js';
import 'codemirror/mode/php/php.js';

import './CodeEditor.css';





import { Tabs } from 'antd';

const { TabPane } = Tabs;



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
            // lineWrapping: true,
            styleActiveLine: true,
            //placeholder: 'Code goes here...',
            keyMap: 'sublime',
            theme: 'material-darker'
        })

        
    }

    render() {

        
        return(
    
        <div style={{height: '100%', width: '100%'}}>
            <Tabs type="card">
                <TabPane className="pane" tab="Tab 1" key="1">


                    <div style={{height: '100%', position: 'relative'}}>
                        <div className="editor" ref={this.setEditor}></div>
                    </div>
                
                </TabPane>
                
            </Tabs>
        </div>
            
    
        );

        
    }

}