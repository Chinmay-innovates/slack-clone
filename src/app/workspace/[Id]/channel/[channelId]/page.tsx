"use client";

import { Loader, TriangleAlert } from "lucide-react";

import { useGetChannel } from "@/features/channels/api/use-get-channel";
import { useChannelId } from "@/hooks/use-channel-id";
import { Header } from "./header";

const channelIdpage = () => {
	const channelId = useChannelId();

	const { data: channel, isLoading: channelLoading } = useGetChannel({
		id: channelId,
	});
	if (channelLoading) {
		return (
			<div className=" h-full flex-1 flex flex-col  items-center justify-center">
				<Loader className="size-5 animate-spin text-muted-foreground" />
			</div>
		);
	}
	if (!channel) {
		return (
			<div className="flex-1 flex flex-col gap-y-2 h-full items-center justify-center">
				<TriangleAlert className="size-5 text-muted-foreground" />
				<span className="text-muted-foreground text-sm">Channel not found</span>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full">
			<Header title={channel.name} />
		</div>
	);
};

export default channelIdpage;
