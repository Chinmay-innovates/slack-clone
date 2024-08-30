import {
	MessageSquareTextIcon,
	PencilIcon,
	SmileIcon,
	Trash2Icon,
} from "lucide-react";
import { Button } from "./ui/button";
import { Hint } from "./hint";
import { EmojiPopover } from "./emoji-popover";

interface ToolbarProps {
	isAuthor: boolean;
	isPending: boolean;
	handelEdit: () => void;
	handleThread: () => void;
	handleDelete: () => void;
	handleReaction: (value: string) => void;
	hideThreadButton?: boolean;
}

export const Toolbar = ({
	handelEdit,
	handleDelete,
	handleThread,
	handleReaction,
	hideThreadButton,
	isAuthor,
	isPending,
}: ToolbarProps) => {
	return (
		<div className="absolute top-0 right-5">
			<div className="group-hover:opacity-100 opacity-0 border transition-opacity bg-white rounded-md shadow-sm">
				<EmojiPopover
					hint="Add reaction"
					onEmojiSelect={(emoji) => handleReaction(emoji.native)}
				>
					<Button variant="ghost" size="iconSm" disabled={isPending}>
						<SmileIcon className="size-4" />
					</Button>
				</EmojiPopover>
				{!hideThreadButton && (
					<Hint label="Reply in thread">
						<Button
							onClick={handleThread}
							variant="ghost"
							size="iconSm"
							disabled={isPending}
						>
							<MessageSquareTextIcon className="size-4" />
						</Button>
					</Hint>
				)}
				{isAuthor && (
					<>
						<Hint label="Edit message">
							<Button
								onClick={handelEdit}
								variant="ghost"
								size="iconSm"
								disabled={isPending}
							>
								<PencilIcon className="size-4" />
							</Button>
						</Hint>
						<Hint label="Delete message">
							<Button
								onClick={handleDelete}
								variant="ghost"
								size="iconSm"
								disabled={isPending}
							>
								<Trash2Icon className="size-4" />
							</Button>
						</Hint>
					</>
				)}
			</div>
		</div>
	);
};
