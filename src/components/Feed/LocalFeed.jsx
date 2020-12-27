import React from "react";
import AgoraRTC from "agora-rtc-sdk";

const USER_ID = generateRandomUserId();

const APP_ID    = process.env.REACT_APP_APP_ID;
const CHANNEL   = process.env.REACT_APP_CHANNEL;
const TOKEN     = process.env.REACT_APP_TOKEN;

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
                    this.props.setLocalFeed(this.localFeed, USER_ID); //inform app component about local stream
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
            TOKEN,
            CHANNEL,
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

    toggleVideoMuteUnmute = () => {
       let isMute = this.state.isVideoMute;

       this.setState({
           isVideoMute: !isMute
       },
       () => {
           isMute ?
           this.localFeed.unmuteVideo() :
           this.localFeed.muteVideo()
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
        })
    }

    render() {

        let hostStyle = {
            height: "400px", width: "500px"
        }

        let audienceStyle = {
            height: "50px", width: "500px"
        }

        return (
            <>
            <div
                style={this.props.isHost ? hostStyle : audienceStyle}
                id="local-feed"
            ></div>

            <button onClick={this.toggleVideoMuteUnmute}>Toggle Video</button>
            <button onClick={this.toggleAudioMuteUnmute}>Toggle Audio</button>
            </>
        );
    }
}

export default LocalFeed;

function generateRandomUserId() {
    return Math.floor(Math.random() * 1000000001);
}