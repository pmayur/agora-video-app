import React from "react";

class FeedLogs extends React.Component {

    render() {
        let logsList = this.props.logs;
        return (
            <div>
                {
                    logsList.map(log => {
                        return <h5 style={{margin:'1px'}}>
                            {log}
                        </h5>
                    })
                }
            </div>
        )
    }
}

export default FeedLogs;