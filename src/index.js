import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as electron from 'electron';
import CodeEditor from './CodeEditor'
import EditorPage from './EditorPage';
import { Button } from 'antd';

import './index.css';
import 'antd/dist/antd.css';







class App extends Component {
    render() {
       
        return (
            <>
                <EditorPage />
            </>
        ); 
    }
}
ReactDOM.render(<App />, document.getElementById('root'));

  