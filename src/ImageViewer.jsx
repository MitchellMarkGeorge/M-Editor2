import React, { Component } from 'react'
import './ImageViewer.css'

export default class ImageViewer extends Component {
    render() {
        return (
            <div className="image-container">
                <img className="image" src={this.props.path}></img>
            </div>
        )
    }
}
