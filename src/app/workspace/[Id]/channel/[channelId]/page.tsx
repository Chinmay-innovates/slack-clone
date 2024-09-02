"use client";

import { TriangleAlert } from "lucide-react";

import { useGetChannel } from "@/features/channels/api/use-get-channel";
import { useChannelId } from "@/hooks/use-channel-id";
import { Header } from "./header";
import { ChatInput } from "./chat-input";
import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { MessageList } from "@/components/message-list";
import { Spinner } from "@/components/spinner";

const ChannelIdpage = () => {
	const channelId = useChannelId();

	const { results, status, loadMore } = useGetMessages({ channelId });

	const { data: channel, isLoading: channelLoading } = useGetChannel({
		id: channelId,
	});
	if (channelLoading || status === "LoadingFirstPage") {
		return <Spinner />;
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
		<div className="flex flex-col h-full bg-fade-100">
			<Header title={channel.name} />
			<MessageList
				channelName={channel.name}
				channelCreationTime={channel._creationTime}
				data={results}
				loadMore={loadMore}
				isLoadingMore={status === "LoadingMore"}
				canLoadMore={status === "LoadingMore"}
			/>
			<ChatInput placeholder={`Message # ${channel.name}`} />
		</div>
	);
};

export default ChannelIdpage;
