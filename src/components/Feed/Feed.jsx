import React from "react";
import AgoraRTC from "agora-rtc-sdk";

import LocalFeed from "./LocalFeed"

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

    render() {
        return (
            <>
                <LocalFeed
                    client={CLIENT}
                    setLocalFeed={this.setLocalFeed}
                    isHost={this.props.isHost}
                />
                <div id="remote-feeds"></div>
                <div id="feed-logs"></div>
            </>
        );
    }
}

export default Feed;
