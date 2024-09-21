import { GetMessagesReturnType } from "@/features/messages/api/use-get-messages";
import { differenceInMinutes, format } from "date-fns";
import { Message } from "./message";
import { ChannelHero } from "./channel-hero";
import { useState } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { Spinner } from "./spinner";
import { formatDateLabel, TIME_THRESHOLD } from "@/lib/utils";
import { Button } from "./ui/button";
import { ConversationHero } from "./conversation-hero";

interface MessageListProps {
	memberName?: string;
	memberImage?: string;
	channelName?: string;
	channelCreationTime?: number;
	variant?: "channel" | "thread" | "conversation";
	data: GetMessagesReturnType | undefined;
	loadMore: () => void;
	isLoadingMore: boolean;
	canLoadMore: boolean;
}

export const MessageList = ({
	data,
	loadMore,
	canLoadMore,
	isLoadingMore,
	variant = "channel",
	channelCreationTime,
	channelName,
	memberImage,
	memberName,
}: MessageListProps) => {
	const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);
	const workspaceId = useWorkspaceId();

	const { data: currentMember } = useCurrentMember({ workspaceId });

	// Group messages by date
	const groupedMessages = data?.reduce(
		(groups, message) => {
			const date = new Date(message._creationTime);
			const dateKey = format(date, "yyyy-MM-dd");

			if (!groups[dateKey]) groups[dateKey] = [];
			groups[dateKey].unshift(message);

			return groups;
		},
		{} as Record<string, typeof data>
	);

	return (
		<div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
			{groupedMessages &&
				Object.entries(groupedMessages || {}).map(([dateKey, messages]) => (
					<div key={dateKey}>
						<div className="text-center my-2 relative">
							<hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
							<span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
								{formatDateLabel(dateKey)}
							</span>
						</div>
						{messages.map((message, index) => {
							const prevMesg = messages[index - 1];
							const isSameAuthor =
								prevMesg &&
								prevMesg.user?._id === message.user?._id &&
								differenceInMinutes(
									new Date(message._creationTime),
									new Date(prevMesg._creationTime)
								) < TIME_THRESHOLD;
							return (
								<Message
									key={message._id}
									id={message._id}
									memberId={message.memberId}
									authorImage={message.user.image}
									isAuthor={message.memberId === currentMember?._id}
									authorName={message.user.name}
									reactions={message.reactions}
									body={message.body}
									image={message.image}
									isEditing={editingId === message._id}
									setEditingId={setEditingId}
									updatedAt={message.updatedAt}
									createdAt={message._creationTime}
									threadCount={message.threadCount}
									threadImage={message.threadImage}
									threadName={message.threadName}
									threadTimestamp={message.threadTimestamp}
									hideThreadButton={variant === "thread"}
									isCompact={isSameAuthor}
								/>
							);
						})}
					</div>
				))}
			<div
				className="h-[1px]"
				ref={(el) => {
					if (el) {
						const observer = new IntersectionObserver(
							([entry]) => {
								if (entry.isIntersecting || canLoadMore) {
									loadMore();
								}
							},
							{
								threshold: 1.0,
							}
						);
						observer.observe(el);
						return () => observer.disconnect();
					}
				}}
			/>
			<div>
				<Button
					className="w-full pointer-events-none"
					size="sm"
					variant="transparent"
					onMouseMove={loadMore}
				/>
				{/* Cant see this button */}
			</div>
			{isLoadingMore && (
				<div className="text-center my-2 relative">
					<hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
					<span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
						<Spinner />
					</span>
				</div>
			)}
			{variant === "channel" && channelName && channelCreationTime && (
				<ChannelHero name={channelName} creationTime={channelCreationTime} />
			)}
			{variant === "conversation" && (
				<ConversationHero name={memberName} image={memberImage} />
			)}
		</div>
	);
};
