import React from "react";

class RemoteFeeds extends React.Component {

    componentDidUpdate() {
        let feedsIdList = Object.keys(this.props.feedsList)

        feedsIdList.forEach( id => {
            this.props.feedsList[id].play(`remote-feed-${id}`)
        })
    }

    render() {

        let remoteFeedsStyle = {
            height: "400px",
            width: "500px",
            margin: '10px'
        }

        const feedsList = Object.values(this.props.feedsList);

        return (
            <div style={{display:'flex', width: 'auto'}}>
            {
                feedsList.map(stream => {
                    let streamId = stream.getId();
                    return (
                        <div
                            key={streamId}
                            id={`remote-feed-${streamId}`}
                            style={remoteFeedsStyle}
                        ></div>
                    );
                })
            }
            </div>
        )
    }
}

export default RemoteFeeds;