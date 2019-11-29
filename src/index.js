import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import * as electron from 'electron';

import { Button } from 'antd';

import './index.css';
import 'antd/dist/antd.css';






class App extends Component {
    render() {
       
        return (
            <div>
                <h1>Hello My friends</h1>
                <Button>Primary</Button>
            </div>
        ); 
    }
}
ReactDOM.render(<App />, document.getElementById('root'));

  