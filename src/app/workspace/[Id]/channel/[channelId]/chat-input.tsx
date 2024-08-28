import { useRef } from "react";
import Quill from "quill";
import dynamic from "next/dynamic";

import { useCreateMessage } from "@/features/messages/api/use-create-message";

import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });
interface ChatInputProps {
	placeholder: string;
}

export const ChatInput = ({ placeholder }: ChatInputProps) => {
	const editorRef = useRef<Quill | null>(null);
	const workspaceId = useWorkspaceId();
	const channelId = useChannelId();

	const { mutate: createMessage } = useCreateMessage();

	const handleSubmit = ({
		body,
		image,
	}: {
		body: string;
		image: File | null;
	}) => {
		console.log({ image, body });
		createMessage({
			workspaceId,
			channelId,
			body,
		});
	};
	return (
		<div className="px-5 w-full ">
			<Editor
				variant="create"
				placeholder={placeholder}
				onSubmit={handleSubmit}
				disabled={false}
				innerRef={editorRef}
			/>
		</div>
	);
};
