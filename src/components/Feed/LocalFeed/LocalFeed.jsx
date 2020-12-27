import React from "react";
import AgoraRTC from "agora-rtc-sdk";

const USER_ID = generateRandomUserId();

const APP_ID    = process.env.REACT_APP_APP_ID;

class LocalFeed extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isVideoMute: true,
            isAudioMute: true
        }

        // bindings
        this.toggleAudioMuteUnmute = this.toggleAudioMuteUnmute.bind(this)
        this.toggleVideoMuteUnmute = this.toggleVideoMuteUnmute.bind(this)
    }

    localFeed = AgoraRTC.createStream({
        streamID: USER_ID,
        audio: true,
        video: this.props.isHost,
        screen: false,
    });

    async componentDidMount() {
        await this.createLocalFeed()
        this.initializeAgoraClient()
        this.joinClientChannel()
    }

    /*
        FLOW:
        1.) create a local stream using webcam and mic (this.createLocalFeed())
        2.) initialize agora client with developer app id (this.initializeAgoraClient())
        3.) create a channel on agora client (this.joinClientChannel())
        4.) publish localstream to the channel (callback of this.joinClientChannel())
    */

    createLocalFeed = () => {
        return new Promise((resolve, reject) => {
            this.localFeed.init(
                () => {
                    console.log(
                        "the local feed has been started using your media devices"
                    );

                    // play feed to the passed dom element's id then mute
                    this.localFeed.play("local-feed");
                    this.localFeed.muteAudio();
                    this.localFeed.muteVideo();

                    this.props.addLogs("You Joined the stream")
                    this.props.addLogs("Your Audio and Video is turned off")
                    resolve();
                },
                (err) => {
                    console.log("failed to start the local feed due to: ", err);
                    reject();
                }
            );
        })

    };

    initializeAgoraClient = () => {
        const CLIENT = this.props.client;
        CLIENT.init(
            APP_ID,
            () => console.log("AgoraRTC client initialized"),
            (err) => console.log("AgoraRTC client initialization failed", err)
        );
        this.props.onEvent();
    };

    joinClientChannel = () => {
        const CLIENT = this.props.client;

        CLIENT.join(
            this.props.token,
            this.props.channel,
            USER_ID,
            (uid) => {
                console.log("User " + uid + " join channel successfully");

                CLIENT.publish(this.localFeed, function (err) {
                    console.error("Publish local stream error: " + err);
                });

                CLIENT.on("stream-published", function (evt) {
                    console.log("Publish local stream successfully", evt);
                });
            },
            function (err) {
                console.log("Join channel failed", err);
            }
        );
    };

    // state change functions

    toggleVideoMuteUnmute = () => {
       let isMute = this.state.isVideoMute;

       this.setState({
           isVideoMute: !isMute
       },
       () => {
           isMute ?
           this.localFeed.unmuteVideo() :
           this.localFeed.muteVideo()

           // log video activity
           isMute ?
           this.props.addLogs("Your Video is On") :
           this.props.addLogs("Your Video is Off")
       })
    }

    toggleAudioMuteUnmute = () => {
        let isMute = this.state.isAudioMute;

       this.setState({
           isAudioMute: !isMute
       },
       () => {
            isMute ?
            this.localFeed.unmuteAudio() :
            this.localFeed.muteAudio()

            // log audio activity
            isMute ?
            this.props.addLogs("Your Audio is On") :
            this.props.addLogs("Your Audio is Off")
        })
    }

    render() {

        let hostStyle = {
            height: "400px", width: "500px", padding: "10px"
        }

        let audienceStyle = {
            height: "0px", width: "500px", padding: "10px"
        }

        let infoStyle = {
            padding: "10px",
            width: "500px",
            display: "flex",
            flexDirection: "column",
            alignItems: "centre",
            justifyContent: "centre",
            textAlign: "centre"
        }

        return (
            <div style={{ margin: 'auto'}}>
                <div
                    style={this.props.isHost ? hostStyle : audienceStyle}
                    id="local-feed"
                ></div>
                <div style={infoStyle}>
                    <div style={{textAlign:'center'}}>
                        <h5>User in session: {USER_ID}</h5>
                    </div>
                    {
                        this.props.isHost
                        ? <HostButtons
                            isAudioMute={this.state.isAudioMute}
                            isVideoMute={this.state.isVideoMute}
                            toggleAudioMuteUnmute={this.toggleAudioMuteUnmute}
                            toggleVideoMuteUnmute={this.toggleVideoMuteUnmute}
                        />
                        : <AudienceButtons
                            isAudioMute={this.state.isAudioMute}
                            toggleAudioMuteUnmute={this.toggleAudioMuteUnmute}
                        />
                    }
                </div>
            </div>
        );
    }
}

export default LocalFeed;

// helper functions
function generateRandomUserId() {
    return Math.floor(Math.random() * 1000000001);
}

// functional components displaying buttons
function HostButtons (props) {
    return (
        <>
        <button onClick={props.toggleVideoMuteUnmute}>
        {
            props.isVideoMute
            ? "Turn Video On"
            : "Turn Video Off"
        }
        </button>
        <button onClick={props.toggleAudioMuteUnmute}>
        {
            props.isAudioMute
            ? "Turn Audio On"
            : "Turn Audio Off"
        }
        </button>
        </>
    )
}

function AudienceButtons (props) {
    return (
        <button onClick={props.toggleAudioMuteUnmute}>
        {
            props.isAudioMute
            ? "Ask a Question"
            : "Got the Answer"
        }
        </button>
    )
}