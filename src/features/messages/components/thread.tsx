import Quill from "quill";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { AlertTriangle, XIcon } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import { Message } from "@/components/message";

import { useGetMessages } from "@/features/messages/api/use-get-messages";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-uplod-url";
import { useCreateMessage } from "@/features/messages/api/use-create-message";
import { useGetMessage } from "@/features/messages/api/use-get-message";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useChannelId } from "@/hooks/use-channel-id";
import { differenceInMinutes, format } from "date-fns";
import { formatDateLabel, TIME_THRESHOLD } from "@/lib/utils";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ThreadProps {
	messageId: Id<"messages">;
	onClose: () => void;
}

type CreateMessageValues = {
	channelId: Id<"channels">;
	workspaceId: Id<"workspaces">;
	parentMessageId: Id<"messages">;
	body: string;
	image?: Id<"_storage"> | undefined;
};

export const Thread = ({ messageId, onClose }: ThreadProps) => {
	const workspaceId = useWorkspaceId();
	const channelId = useChannelId();

	const [editingId, setEditingId] = useState<Id<"messages"> | null>(null);
	const [editorKey, setEditorKey] = useState(0);
	const [isPending, setIsPending] = useState(false);
	const editorRef = useRef<Quill | null>(null);

	const { data: thread, isLoading: loadingThread } = useGetMessage({
		id: messageId,
	});
	const { data: currentMember } = useCurrentMember({ workspaceId });

	const { mutate: generateUploadUrl } = useGenerateUploadUrl();
	const { mutate: createMessage } = useCreateMessage();
	const { status, loadMore, results } = useGetMessages({
		channelId,
		parentMessageId: messageId,
	});

	const canLoadMore = status === "CanLoadMore";
	const isLoadingMore = status === "LoadingMore";

	const groupedMessages = results?.reduce(
		(groups, message) => {
			const date = new Date(message._creationTime);
			const dateKey = format(date, "yyyy-MM-dd");

			if (!groups[dateKey]) groups[dateKey] = [];
			groups[dateKey].unshift(message);

			return groups;
		},
		{} as Record<string, typeof results>
	);

	const handleSubmit = async ({
		body,
		image,
	}: {
		body: string;
		image: File | null;
	}) => {
		try {
			setIsPending(true);
			editorRef?.current?.enable(false);

			const values: CreateMessageValues = {
				channelId,
				workspaceId,
				parentMessageId: messageId,
				body,
				image: undefined,
			};
			if (image) {
				const url = await generateUploadUrl({}, { throwError: true });
				if (!url) throw new Error("URL not found");

				const result = await fetch(url, {
					method: "POST",
					headers: { "Content-Type": image.type },
					body: image,
				});

				if (!result.ok) throw new Error("Failed to upload image");

				const { storageId } = await result.json();

				values.image = storageId;
			}

			await createMessage(values, { throwError: true });

			setEditorKey((prevKey) => prevKey + 1);
		} catch (error) {
			toast.error("Failed to send message");
		} finally {
			setIsPending(false);
			editorRef?.current?.enable(true);
		}
	};

	if (loadingThread || status === "LoadingFirstPage") {
		return (
			<div className="h-full flex flex-col">
				<div className="flex justify-between items-center h-[49px] px-4 border-b border-gray-500/80">
					<p className="text-lg font-bold">Thread</p>
					<Button onClick={onClose} size="iconSm" variant="ghost">
						<XIcon className="size-5 stoke-[1.5]" />
					</Button>
				</div>
				<Spinner />
			</div>
		);
	}
	if (!thread) {
		return (
			<div className="h-full flex flex-col">
				<div className="flex justify-between items-center h-[49px] px-4 border-b border-gray-500/80">
					<p className="text-lg font-bold">Thread</p>
					<Button onClick={onClose} size="iconSm" variant="ghost">
						<XIcon className="size-5 stoke-[1.5]" />
					</Button>
				</div>
				<div className="flex flex-col gap-y-2 h-full items-center justify-center">
					<AlertTriangle className="size-5 text-white" />
					<p className="text-muted-foreground text-sm">Thread not found</p>
				</div>
			</div>
		);
	}

	return (
		<div className="h-full flex flex-col">
			<div className="flex justify-between items-center h-[49px] px-4 border-b border-gray-500/80">
				<p className="text-lg font-bold">Thread</p>
				<Button onClick={onClose} size="iconSm" variant="ghost">
					<XIcon className="size-5 stoke-[1.5]" />
				</Button>
			</div>
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
										hideThreadButton={true}
										isCompact={isSameAuthor}
									/>
								);
							})}
						</div>
					))}
				<div
					className="h-[0.5px]"
					ref={(el) => {
						if (el) {
							const observer = new IntersectionObserver(
								([entry]) => {
									if (entry.isIntersecting && canLoadMore) {
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
						className="w-full"
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
				<Message
					hideThreadButton
					memberId={thread.memberId}
					authorImage={thread.user.image}
					authorName={thread.user.name}
					isAuthor={thread.memberId === currentMember?._id}
					body={thread.body}
					id={thread._id}
					reactions={thread.reactions}
					image={thread.image}
					createdAt={thread._creationTime}
					updatedAt={thread.updatedAt}
					isEditing={editingId === thread._id}
					setEditingId={setEditingId}
				/>
			</div>
			<div className="px-4">
				<Editor
					key={editorKey}
					innerRef={editorRef}
					onSubmit={handleSubmit}
					disabled={isPending}
					placeholder="Reply..."
				/>
			</div>
		</div>
	);
};
