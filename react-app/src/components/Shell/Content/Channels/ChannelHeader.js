import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom'
import { useEffect, useState } from 'react';
import * as ChlActions from "../../../../store/channel";

function ChannelHeader(props) {

    const { setPane } = props;

    const handlePane = (pane) => {
        setPane(pane);
    }

    const { channelId } = useParams();
    const dispatch = useDispatch()
    const singleChannel = useSelector((state) => state.channels.single_channel)
    let numMemb = 0;
    let userList;

    useEffect(() => {
        dispatch(ChlActions.OneChannelThunk(channelId));
    }, [dispatch, channelId])

    const currentChannel = Object.values(singleChannel);

    if (currentChannel.length) {
        userList = Object.values(currentChannel[0].Members)
    }

    if (currentChannel.length && userList) {
        numMemb = userList.length
    }


    return (
        <div className="content-heading-holder">
            <div className="content-header-left">
                <button className="content-header-channelname" style={{ whiteSpace: 'nowrap' }} onClick={() => handlePane('editChannel')}>
                    # {currentChannel.length && currentChannel[0].name}
                    <i style={{ fontSize: "12px", marginLeft: "3px" }} className="fas fa-angle-down"></i>
                </button>
                <div className="content-header-channeltopic">
                    {currentChannel.length && currentChannel[0].subject}
                </div>
            </div>

            {numMemb >= 4 &&
                <div className="content-header-right">
                    <div className="content-header-membercount">
                        <img style={{ zIndex: 5 }} className="membercount-image"
                            src={userList && userList[0].avatar}
                            alt="Member"></img>
                        <img style={{ zIndex: 4, position: "relative", left: "-8px" }} className="membercount-image"
                            src={userList && userList[1].avatar}
                            alt="Member"></img>
                        <img style={{ zIndex: 3, position: "relative", left: "-16px" }} className="membercount-image"
                            src={userList && userList[2].avatar}
                            alt="Member"></img>
                        <span style={{ zIndex: 4, position: "relative", left: "-8px" }}>{numMemb}</span>
                    </div>
                </div>
            }

            {numMemb === 3 &&
                <div className="content-header-right">
                    <div className="content-header-membercount">
                        <img style={{ zIndex: 5 }} className="membercount-image"
                            src={userList && userList[0].avatar} alt=''></img>
                        <img style={{ zIndex: 4, position: "relative", left: "-8px" }} className="membercount-image"
                            src={userList && userList[1].avatar} alt=''></img>
                        <span style={{ zIndex: 3, position: "relative", left: "-3px" }}>{numMemb}</span>
                    </div>
                </div>
            }

            {numMemb < 3 &&
                <div className="content-header-right">
                    <div className="content-header-membercount">
                        <img className="membercount-image"
                            src={userList && userList[0].avatar} alt=''></img>
                        <span style={{ padding: "0px 5px" }}>{numMemb}</span>
                    </div>
                </div>
            }


        </div>
    )
}


export default ChannelHeader;
