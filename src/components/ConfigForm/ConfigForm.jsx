import React from "react";
import { withRouter } from 'react-router-dom'

import "./ConfigForm.css"

class ConfigForm extends React.Component {
    constructor() {
        super();

        // state
        this.state = {
            channel : "",
            token   : "",
        };

        // bindings
        this.handleInputChange=this.handleInputChange.bind(this)
        this.buttonClickHandler=this.buttonClickHandler.bind(this)
    }

    handleInputChange(event) {
        const target = event.target;
        const value  = target.value;
        const name   = target.name;

        // update state using es6 compute property syntax
        this.setState({
            [name]: value,
        });
    }

    buttonClickHandler(event) {
        const target = event.target;
        const id     = target.id; // get the id name, host or audience

        // change values in the App component
        this.props.handleConfigChange({
            channel: this.state.channel,
            token: this.state.token,
        })

        this.props.history.push(`/${id}`) // route to id name
    }

    render() {
        return (
            <div className="form-ctn">
                <label className="label">
                    <div>CHANNEL:</div>
                    <input
                        className="wide"
                        name="channel"
                        value={this.state.channel}
                        onChange={this.handleInputChange}
                    />
                </label>

                <label className="label">
                    <div>TOKEN:</div>
                    <input
                        className="wide"
                        name="token"
                        value={this.state.token}
                        onChange={this.handleInputChange}
                    />
                </label>

                <button
                    onClick={this.buttonClickHandler}
                    className="btn"
                    id="host"
                >
                    JOIN AS A HOST
                </button>

                <button
                    onClick={this.buttonClickHandler}
                    className="btn"
                    id="audience"
                >
                    JOIN AS AUDIENCE
                </button>
            </div>
        );
    }
}

export default withRouter(ConfigForm);
