import { useMemberId } from "@/hooks/use-member-id";

import { Id } from "../../../../../../convex/_generated/dataModel";
import { useGetMember } from "@/features/members/api/use-get-member";
import { useGetMessages } from "@/features/messages/api/use-get-messages";

import { Spinner } from "@/components/spinner";
import { MessageList } from "@/components/message-list";

import { Header } from "./header";
import { ChatInput } from "./chat-input";
import { usePanel } from "@/hooks/use-panel";

interface ConversationProps {
	id: Id<"conversations">;
}

export const Conversation = ({ id }: ConversationProps) => {
	const memberId = useMemberId();
	const { onOpenProfile } = usePanel();
	const { data: member, isLoading: memberLoading } = useGetMember({
		id: memberId,
	});
	const { loadMore, results, status } = useGetMessages({
		conversationId: id,
	});

	if (memberLoading || status === "LoadingFirstPage") return <Spinner />;

	return (
		<div className="flex flex-col h-full bg-fade-100">
			<Header
				memberName={member?.user.name}
				memberImage={member?.user.image}
				onClick={() => onOpenProfile(memberId)}
			/>
			<MessageList
				data={results}
				loadMore={loadMore}
				variant="conversation"
				memberImage={member?.user.image}
				memberName={member?.user.name}
				isLoadingMore={status === "LoadingMore"}
				canLoadMore={status === "CanLoadMore"}
			/>
			<ChatInput
				placeholder={`Message ${member?.user.name}`}
				conversationId={id}
			/>
		</div>
	);
};
