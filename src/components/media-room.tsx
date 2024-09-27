"use client";
import {
	LiveKitRoom,
	RoomAudioRenderer,
	VideoConference,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { useCurrentUser } from "@/features/auth/api/use-current-user";
import { useEffect, useState } from "react";
import { Spinner } from "./spinner";
import { useChannelId } from "@/hooks/use-channel-id";

interface MediaRoomProps {
	chatId: string;
	video: boolean;
	audio: boolean;
}

export const MediaRoom = ({ audio, chatId, video }: MediaRoomProps) => {
	const { data: user } = useCurrentUser();
	const [token, setToken] = useState("");
	const channelId = useChannelId();
	useEffect(() => {
		if (!user?.name) return;

		(async () => {
			try {
				const res = await fetch(
					`/api/livekit?room=${chatId}&channelId=${channelId}`
				);
				const data = await res.json();
				setToken(data.token);
			} catch (e) {
				console.log(e);
			}
		})();
	}, [chatId, channelId]);

	if (token === "") {
		return <Spinner />;
	}

	return (
		<LiveKitRoom
			data-lk-theme="default"
			style={{ height: "100dvh" }}
			serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
			token={token}
			audio={audio}
			video={video}
			connect={true}
		>
			<VideoConference />
			<RoomAudioRenderer />
		</LiveKitRoom>
	);
};
