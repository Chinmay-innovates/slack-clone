"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { TriangleAlert } from "lucide-react";
import { useGetOrCreateConversation } from "@/features/conversations/api/use-get-or-create-conversation";

import { useMemberId } from "@/hooks/use-member-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { Spinner } from "@/components/spinner";
import { Conversation } from "./conversation";

interface MemberIdPageProps {
	params: {
		memberId: Id<"members">;
	};
}
const MemberIdPage = ({ params: { memberId } }: MemberIdPageProps) => {
	const workspaceId = useWorkspaceId();
	const memberIdHook = useMemberId();
	const { mutate, isPending } = useGetOrCreateConversation();

	const [conversationId, setConversationId] =
		useState<Id<"conversations"> | null>(null);

	useEffect(() => {
		mutate(
			{
				memberId,
				workspaceId,
			},
			{
				onSuccess(data) {
					setConversationId(data);
				},
				onError() {
					toast.error("Failed to get or create conversation");
				},
			}
		);
	}, []);
	if (isPending) return <Spinner />;
	if (!conversationId)
		return (
			<div className="flex-1 flex flex-col gap-y-2 h-full items-center justify-center">
				<TriangleAlert className="size-5 text-muted-foreground" />
				<span className="text-muted-foreground text-sm">
					Conversation not found
				</span>
			</div>
		);
	return <Conversation id={conversationId} />;
};

export default MemberIdPage;