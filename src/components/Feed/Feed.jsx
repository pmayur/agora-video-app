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
            logs:[],            // stores stream event logs
            feedsList: {},      // stores remote streams against streamID's
        };

        //bindings
        this.addLogs = this.addLogs.bind(this);
    }

    // adds logs to the logs state
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
        CLIENT.on("peer-leave", this.onStreamRemoved);
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

        this.addLogs(`User: ${stream.getId()} joined the stream`)

        // copy of feedsList state and stream to copy and update state
        let newList = this.state.feedsList;
        newList[stream.getId()] = stream;

        this.setState({
                feedsList: newList,
        });
    }

    onStreamRemoved = (event) => {

        let stream   = event.stream;
        let newList  = this.state.feedsList;
        let streamId = stream.getId();

        delete newList[streamId];

        this.setState({
            feedsList: newList
        },
        () => {
            console.log("Remote stream is removed " + stream.getId());
            this.addLogs(`User:${streamId} left the stream`)
        })
    };

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
                    addLogs={this.addLogs}
                    channel={this.props.channel}
                    token={this.props.token}
                />
                <RemoteFeeds
                    feedsList={this.state.feedsList}
                    addLogs={this.addLogs}
                />
                <FeedLogs
                    logs={this.state.logs}
                />
            </div>
        );
    }
}

export default Feed;
