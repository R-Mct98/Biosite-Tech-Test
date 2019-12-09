import React from "react";

import Nav from '../components/Nav';

export default class Layout extends React.Component {
    render() {

        return (
            <div>
                <Nav/>
                <div className="container">
                    {this.props.children}
                </div>
            </div>
        );
    }
}
