import { toast } from "sonner";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

import { format, isToday, isYesterday } from "date-fns";
import { Doc, Id } from "../../convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import { Hint } from "./hint";
import { Toolbar } from "./toolbar";
import { Thumbnail } from "./thumbnail";
import { Reactions } from "./reactions";
import { UpdatedAtText } from "./updated-at-text";

import { useUpdateMessage } from "@/features/messages/api/use-update-message";
import { useRemoveMessage } from "@/features/messages/api/use-remove-message";
import { useToggleReaction } from "@/features/reactions/api/use-toggle-reaction";
import { useConfirmation } from "@/hooks/use-confirmation";
import { usePanel } from "@/hooks/use-panel";
import { ThreadBar } from "./thread-bar";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });
const Renderer = dynamic(() => import("@/components/renderer"), { ssr: false });

interface MessageProps {
	id: Id<"messages">;
	memberId: Id<"members">;
	authorImage?: string;
	authorName?: string;
	isAuthor: boolean;
	reactions: Array<
		Omit<Doc<"reactions">, "memberId"> & {
			count: number;
			memberIds: Id<"members">[];
		}
	>;
	body: Doc<"messages">["body"];
	image: string | null | undefined;
	createdAt: Doc<"messages">["_creationTime"];
	updatedAt: Doc<"messages">["updatedAt"];
	isEditing: boolean;
	isCompact?: boolean;
	setEditingId: (id: Id<"messages"> | null) => void;
	hideThreadButton?: boolean;
	threadCount?: number;
	threadImage?: string;
	threadName?: string;
	threadTimestamp?: number;
}

const formatFullTime = (date: Date) => {
	return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")} at ${format(date, "h:mm:ss a")}`;
};

export const Message = ({
	body,
	createdAt,
	updatedAt,
	id,
	image,
	threadTimestamp,
	threadImage,
	isAuthor,
	authorImage,
	authorName = "Member",
	isEditing,
	isCompact,
	setEditingId,
	hideThreadButton,
	threadCount,
	memberId,
	reactions,
	threadName,
}: MessageProps) => {
	const { onOpenMessage, onClose, parentMessageId, onOpenProfile } = usePanel();

	const [ConfirmDialog, confirm] = useConfirmation(
		"Delete message",
		"Are you sure you want to delete this message? This action cannot be undone."
	);
	const avatarFallback = authorName.charAt(0).toUpperCase();

	const { mutate: updateMessage, isPending: isUpdatingMessage } =
		useUpdateMessage();
	const { mutate: removeMessage, isPending: isRemovingMessage } =
		useRemoveMessage();
	const { mutate: toggleReaction, isPending: isTogglingReaction } =
		useToggleReaction();

	const isPending =
		isUpdatingMessage || isRemovingMessage || isTogglingReaction;

	const handleReaction = (value: string) => {
		toggleReaction(
			{ messageId: id, value },
			{
				onError: () => {
					toast.error("Failed to toggle reaction");
				},
			}
		);
	};

	const handleRemove = async () => {
		const ok = await confirm();

		if (!ok) return;

		removeMessage(
			{ id },
			{
				onSuccess() {
					toast.success("Message deleted");

					if (parentMessageId === id) onClose();
				},
				onError() {
					toast.error("Failed to delete message");
				},
			}
		);
	};

	const handleUpdate = ({ body }: { body: string }) => {
		updateMessage(
			{
				id,
				body,
			},
			{
				onSuccess: () => {
					toast.success("Message updated");
					setEditingId(null);
				},
				onError: () => {
					toast.error("Failed to update message");
				},
			}
		);
	};

	if (isCompact) {
		return (
			<>
				<ConfirmDialog />
				<div
					className={cn(
						"flex flex-col gap-2 px-5 p-1.5 hover:bg-fade-200/60 group relative",
						isEditing && "bg-paleyellow-100 hover:bg-paleyellow-100",
						isRemovingMessage &&
							"bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
					)}
				>
					<div className="flex items-start gap-2">
						<Hint label={formatFullTime(new Date(createdAt))}>
							<button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline">
								{format(new Date(createdAt), "hh:mm")}
							</button>
						</Hint>
						{isEditing ? (
							<div className="size-full">
								<Editor
									onSubmit={handleUpdate}
									disabled={isPending}
									defaultValue={JSON.parse(body)}
									onCancel={() => setEditingId(null)}
									variant="update"
								/>
							</div>
						) : (
							<div className="flex flex-col w-full overflow-hidden">
								<Renderer value={body} />
								<Thumbnail url={image} />
								<UpdatedAtText text={updatedAt} />
								<Reactions data={reactions} onChange={handleReaction} />
								<ThreadBar
									count={threadCount}
									image={threadImage}
									timestamp={threadTimestamp}
									name={threadName}
									onClick={() => onOpenMessage(id)}
								/>
							</div>
						)}
					</div>
					{!isEditing && (
						<Toolbar
							isAuthor={isAuthor}
							isPending={isPending}
							handelEdit={() => setEditingId(id)}
							handleThread={() => onOpenMessage(id)}
							handleDelete={handleRemove}
							handleReaction={handleReaction}
							hideThreadButton={hideThreadButton}
						/>
					)}
				</div>
			</>
		);
	}

	// ELSE
	return (
		<>
			<ConfirmDialog />
			<div
				className={cn(
					"flex flex-col gap-2 px-5 p-1.5 hover:bg-fade-200/60 group relative",
					isEditing && "bg-paleyellow-100 hover:bg-paleyellow-100",
					isRemovingMessage &&
						"bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200"
				)}
			>
				<div className="flex items-center gap-2">
					<button onClick={() => onOpenProfile(memberId)}>
						<Avatar>
							<AvatarImage src={authorImage} />
							<AvatarFallback>{avatarFallback}</AvatarFallback>
						</Avatar>
					</button>
					{isEditing ? (
						<div className="size-full">
							<Editor
								onSubmit={handleUpdate}
								disabled={isPending}
								defaultValue={JSON.parse(body)}
								onCancel={() => setEditingId(null)}
								variant="update"
							/>
						</div>
					) : (
						//  IS NOT EDITING
						<div className="flex flex-col w-full overflow-hidden">
							<div className="text-sm">
								<button
									onClick={() => onOpenProfile(memberId)}
									className="font-semibold text-primary hover:underline"
								>
									{authorName}
								</button>
								<span>&nbsp;&nbsp;</span>
								<Hint label={formatFullTime(new Date(createdAt))}>
									<button className="text-xs text-muted-foreground hover:underline">
										{format(new Date(createdAt), "h:mm a")}
									</button>
								</Hint>
							</div>
							<Renderer value={body} />
							<Thumbnail url={image} />
							<UpdatedAtText text={updatedAt} />
							<Reactions data={reactions} onChange={handleReaction} />
							<ThreadBar
								count={threadCount}
								image={threadImage}
								name={threadName}
								timestamp={threadTimestamp}
								onClick={() => onOpenMessage(id)}
							/>
						</div>
					)}
				</div>
				{!isEditing && (
					<Toolbar
						isAuthor={isAuthor}
						isPending={isPending}
						handelEdit={() => setEditingId(id)}
						handleThread={() => onOpenMessage(id)}
						handleDelete={handleRemove}
						handleReaction={handleReaction}
						hideThreadButton={hideThreadButton}
					/>
				)}
			</div>
		</>
	);
};
