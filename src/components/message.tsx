import { toast } from "sonner";
import dynamic from "next/dynamic";

import { format, isToday, isYesterday } from "date-fns";
import { Doc, Id } from "../../convex/_generated/dataModel";

import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import { Hint } from "./hint";
import { Toolbar } from "./toolbar";
import { Thumbnail } from "./thumbnail";

import { useUpdateMessage } from "@/features/messages/api/use-update-message";
import { cn } from "@/lib/utils";
import { Divide } from "lucide-react";

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
			memberId: Id<"members">;
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
}: MessageProps) => {
	const avatarFallback = authorName.charAt(0).toUpperCase();

	const { mutate: updateMessage, isPending: isUpdatingMessage } =
		useUpdateMessage();

	const isPending = isUpdatingMessage;

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
			<div
				className={cn(
					"flex flex-col gap-2 px-5 p-1.5 hover:bg-[#e7e7e7]/60 group relative",
					isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]"
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
							{updatedAt ? (
								<span className="text-xs text-muted-foreground">(edited)</span>
							) : null}
						</div>
					)}
				</div>
				{!isEditing && (
					<Toolbar
						isAuthor={isAuthor}
						isPending={isPending}
						handelEdit={() => setEditingId(id)}
						handleThread={() => {}}
						handleDelete={() => {}}
						handleReaction={() => {}}
						hideThreadButton={hideThreadButton}
					/>
				)}
			</div>
		);
	}

	// ELSE
	return (
		<div
			className={cn(
				"flex flex-col gap-2 px-5 p-1.5 hover:bg-[#e7e7e7]/60 group relative",
				isEditing && "bg-[#f2c74433] hover:bg-[#f2c74433]"
			)}
		>
			<div className="flex items-center gap-2">
				<button>
					<Avatar>
						<AvatarImage src={authorImage} />
						<AvatarFallback>{avatarFallback}</AvatarFallback>
					</Avatar>
				</button>
				{/* IS EDITING */}
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
								onClick={() => {}}
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
						{updatedAt ? (
							<span className="text-xs text-muted-foreground">(edited)</span>
						) : null}
					</div>
				)}
			</div>
			{!isEditing && (
				<Toolbar
					isAuthor={isAuthor}
					isPending={isPending}
					handelEdit={() => setEditingId(id)}
					handleThread={() => {}}
					handleDelete={() => {}}
					handleReaction={() => {}}
					hideThreadButton={hideThreadButton}
				/>
			)}
		</div>
	);
};
