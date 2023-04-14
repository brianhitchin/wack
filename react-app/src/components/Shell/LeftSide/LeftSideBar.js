import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react';
import { AllChannelThunk } from '../../../store/channel';

function LeftSideLinks() {

    const dispatch = useDispatch()
    const history = useHistory()
    const { channelId } = useParams()
    const sessionUser = useSelector(state => state.session.user);
    const channels = useSelector(state => state.channels)
    const [channelList, setChannelList] = useState(null)

    useEffect(() => {
        dispatch(AllChannelThunk())
    }, [dispatch])

    useEffect(() => {
        try {
            setChannelList(channels.all_channels)
        } catch {
            setChannelList(null)
        }
    }, [channels])

    return (

        <div id="grid-leftside" className="grid-leftside-threecolumn">


            <div className="leftside-link-holder">

                <div className="leftside-channeldirect-holder">

                    <div>
                        <button>
                            <span style={{ width: "20px" }}><i className="fa fa-newspaper-o"></i></span>
                            <span className="ellipsis-if-long">All Channels</span>
                        </button>
                    </div>

                    <div>
                        <button>
                            <span style={{ width: "20px" }}><i className="far fa-comments"></i></span>
                            <span className="ellipsis-if-long">Direct Messages</span>
                        </button>
                    </div>

                </div>


            </div>


            <div className="leftside-channeldirect-holder">

                {/* <!-- ------ Spacer Div for Between leftside sections------- --> */}
                <div style={{ padding: "4px" }}></div>

                {channelList && channelList.map((channel, idx) => {
                    return (
                        <div key={idx}>
                            <button>
                                <span style={{ width: "20px" }}><i className="fas fa-hashtag"></i></span>
                                <span className="ellipsis-if-long" onClick={() => history.push(`/${channel.id}`)}>{channel.name}</span>
                            </button>
                        </div>
                    )
                })}

                {/* <!-- ------ Spacer Div for Between leftside sections------- --> */}
                <div style={{ padding: "8px" }}></div>


                <div>
                    <button>
                        <span><img src="https://ca.slack-edge.com/T0266FRGM-UQ46QH94Z-gc24d346e359-512"
                            alt="Brian Hitchin"
                            style={{ borderRadius: "5px", width: "20px", height: "20px", marginTop: "4px" }}></img></span>
                        <span className="ellipsis-if-long">Brian Hitchin</span>
                    </button>
                </div>

                <div className="tooltip">
                    <button>
                        <span><img src="https://ca.slack-edge.com/T03GU501J-U04B5SVB5N1-fe508f121b64-512"
                            alt="Brian Hitchin"
                            style={{ borderRadius: "5px", width: "20px", height: "20px", marginTop: "4px" }}></img></span>
                        <span className="ellipsis-if-long">Cameron Beck, Brian Hitchin, Cynthia Liang</span>
                    </button>
                    <span className="tooltiptext">Cameron Beck, Brian Hitchin, Cynthia Liang</span>
                </div>

                <div>
                    {/* <!-- ### (SELECTED OPTION) IF THIS MATCHES CURRENT CHANNEL ADD STYLE THIS STYLE TO BUTTON --> */}
                    <button style={{ backgroundColor: "#275895", color: "#e9e8e8" }}>
                        <span><img src="https://ca.slack-edge.com/T03GU501J-U0476TK99LH-61c6e53dbd3d-512"
                            alt="Brian Hitchin"
                            style={{ borderRadius: "5px", width: "20px", height: "20px", marginTop: "4px" }}></img></span>
                        <span className="ellipsis-if-long">Dave Titus</span>
                    </button>
                </div>

            </div>


        </div>
    );
}

export default LeftSideLinks;
