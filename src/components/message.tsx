import { Doc, Id } from "../../convex/_generated/dataModel";

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
	return <div>{JSON.stringify(body)}</div>;
};
