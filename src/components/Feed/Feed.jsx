import React from "react";
import AgoraRTC from "agora-rtc-sdk";

import LocalFeed   from "./LocalFeed/LocalFeed"
import RemoteFeeds from "./RemoteFeed/RemoteFeeds"
import FeedLogs    from "./FeedLogs/FeedLogs"

const CLIENT    = AgoraRTC.createClient({mode: "live", codec: "h264"})

class Feed extends React.Component {
    constructor() {
        super();

        this.state = {
            logs:[],
            feedsList: {},
        };

        //bindings

    }

    addLogs(log) {
        let logsCopy = this.state.logs;
        logsCopy.push(log);

        this.setState({
            logs: logsCopy
        })
    }

    subscribeToClientEvents = () => {
        CLIENT.on("stream-added", this.onNewStreamAdded);
        CLIENT.on("stream-subscribed", this.onNewStreamSubscribed);
    };

    onNewStreamAdded = (event) => {
        let stream = event.stream;

        CLIENT.subscribe(stream, function (err) {
            console.log("Subscribe stream failed", err);
        });
    }

    onNewStreamSubscribed = (event) => {
        let stream = event.stream;
        console.log("Subscribing to new Stream")

        // create a new object from the state
        // add the new stream to the new object
        let newList = this.state.feedsList;
        newList[stream.getId()] = stream;

        this.setState({
                feedsList: newList,
        });
    }

    render() {
        let parentStyle = {
            display: "flex",
            flexDirection: "column",
            alignItems: "centre",
            justifyContent: "centre",
            textAlign: "centre"
        }

        return (
            <div style={parentStyle}>
                <LocalFeed
                    client={CLIENT}
                    setLocalFeed={this.setLocalFeed}
                    isHost={this.props.isHost}
                    onEvent={this.subscribeToClientEvents}
                />
                <RemoteFeeds
                    feedsList={this.state.feedsList}
                />
                <FeedLogs
                    logs={this.state.logs}
                />
            </div>
        );
    }
}

export default Feed;
