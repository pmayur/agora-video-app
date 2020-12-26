import React from "react";

import ConfigForm       from "./ConfigForm/ConfigForm";
import TestComponent    from "./TestComponent" // placeholder component for routes

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

class App extends React.Component {

    constructor() {
        super()

        // state
        this.state = {
            channel : process.env.REACT_APP_CHANNEL,
            token   : process.env.REACT_APP_TOKEN
        }

        // bindings
        this.handleConfigChange = this.handleConfigChange.bind(this);
    }

    handleConfigChange (object) {
        const newToken   = object.token;
        const newChannel = object.channel;

        this.setState({
            token   : newToken,
            channel : newChannel
        })
    }

    render() {
        return (
            <Router>
                <Switch>
                    <Route
                        exact
                        path="/"
                        component={() => (
                            <ConfigForm
                                handleConfigChange={this.handleConfigChange}
                            />
                        )}
                    />
                    <Route
                        exact
                        path="/host"
                        component={() => (
                            <TestComponent channel={this.state.channel} /> //placeholder component for testing route
                        )}
                    />
                    <Route
                        exact
                        path="/audience"
                        component={() => (
                            <TestComponent channel={this.state.channel} /> //placeholder component for testing route
                        )}
                    />
                </Switch>
            </Router>
        );
    }
}

export default App;
