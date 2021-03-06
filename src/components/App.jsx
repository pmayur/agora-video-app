import React from "react";

import ConfigForm       from "./ConfigForm/ConfigForm";
import Feed             from "./Feed/Feed"

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

    // change state
    handleConfigChange (object) {
        const newToken   = object.token;
        const newChannel = object.channel;

        this.setState({
            token   : newToken,
            channel : newChannel
        })
    }

    render() {

        let parentStyle = {
            width: '100vw',
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            overflowX: 'hidden'
        }

        return (
            <div style={parentStyle}>
                <Router>
                    <Switch>
                        <Route
                            exact
                            path = "/"
                            component = {() => (
                                <ConfigForm
                                    handleConfigChange={this.handleConfigChange}
                                />
                            )}
                        />
                        <Route
                            path = "/host"
                            component = {() => (
                                <Feed
                                    channel = {this.state.channel}
                                    token   = {this.state.token}
                                    isHost  = {true}
                                />
                            )}
                        />
                        <Route
                            path = "/audience"
                            component = {() => (
                                <Feed
                                    channel = {this.state.channel}
                                    token   = {this.state.token}
                                    isHost  = {false}
                                />
                            )}
                        />
                    </Switch>
                </Router>
            </div>
        );
    }
}

export default App;
