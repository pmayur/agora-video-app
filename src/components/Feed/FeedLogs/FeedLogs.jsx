import React from "react";

class FeedLogs extends React.Component {

    render() {
        let logsList = this.props.logs;

        return (
            <div style={{margin:'auto'}}>
                {
                    logsList.map((log,index) => {
                        return <h5 style={{margin:'1px'}} key={index}>
                            {log}
                        </h5>
                    })
                }
            </div>
        )
    }
}

export default FeedLogs;