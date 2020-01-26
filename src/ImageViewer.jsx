import React, { Component } from 'react'
import './ImageViewer.css'

export default class ImageViewer extends Component {
    render() {
        return (
            <div>
                <img src={this.props.path}></img>
            </div>
        )
    }
}
