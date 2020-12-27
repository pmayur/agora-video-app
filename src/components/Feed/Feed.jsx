import React from "react";

class Feed extends React.Component {
    constructor() {
        super();

        this.state = {
            feedsList: {},
        };
    }
    render() {
        return (
            <>
                <div id="local-feed"></div>
                <div id="remote-feeds"></div>
                <div id="feed-logs"></div>
            </>
        );
    }
}

export default Feed;
