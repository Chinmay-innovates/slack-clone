import { useParentMessageId } from "@/features/messages/store/use-parent-message-id";

export const usePanel = () => {
	const [parentMessageId, setParentMessageId] = useParentMessageId();

	const onOpenMessage = (messsageId: string) => {
		setParentMessageId(messsageId);
	};

	const onClose = () => {
		setParentMessageId(null);
	};
	return { parentMessageId, onOpenMessage, onClose };
};
