import React from "react";
import AgoraRTC from "agora-rtc-sdk";

import LocalFeed   from "./LocalFeed"
import RemoteFeeds from "./RemoteFeeds"

const CLIENT    = AgoraRTC.createClient({mode: "live", codec: "h264"})

class Feed extends React.Component {
    constructor() {
        super();

        this.state = {
            localStr: {},
            feedsList: {},
        };

        // bindings
        this.setLocalFeed = this.setLocalFeed.bind(this);
    }

    setLocalFeed(localStr ,userId) {
        let newLocalStr = {
            [userId]: localStr
        }

        this.setState({
            localStr: newLocalStr,
        });
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
        return (
            <>
                <LocalFeed
                    client={CLIENT}
                    setLocalFeed={this.setLocalFeed}
                    isHost={this.props.isHost}
                    onEvent={this.subscribeToClientEvents}
                />
                <RemoteFeeds
                    feedsList={this.state.feedsList}
                />
                <div id="feed-logs"></div>
            </>
        );
    }
}

export default Feed;
