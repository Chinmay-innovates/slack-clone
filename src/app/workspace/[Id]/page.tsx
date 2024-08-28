"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Loader, TriangleAlert } from "lucide-react";

import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";

import { useWorkspaceId } from "@/hooks/use-workspace-id";

const WorkspaceIdPage = () => {
	const router = useRouter();
	const workspaceId = useWorkspaceId();
	const [open, setOpen] = useCreateChannelModal();

	const { data: member, isLoading: memberLoading } = useCurrentMember({
		workspaceId,
	});

	const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
		id: workspaceId,
	});
	const { data: channels, isLoading: channelsLoading } = useGetChannels({
		workspaceId,
	});

	const channelId = useMemo(() => channels?.[0]?._id, [channels]);
	const isAdmin = useMemo(() => member?.role === "admin", [member?.role]);

	useEffect(() => {
		if (
			workspaceLoading ||
			channelsLoading ||
			!workspace ||
			memberLoading ||
			!member
		)
			return;

		if (channelId)
			router.push(`/workspace/${workspaceId}/channel/${channelId}`);
		else if (!open && isAdmin) setOpen(true);
	}, [
		member,
		memberLoading,
		isAdmin,
		channelId,
		workspace,
		workspaceLoading,
		channelsLoading,
		open,
		setOpen,
		router,
		workspaceId,
	]);
	if (workspaceLoading || channelsLoading || memberLoading) {
		return (
			<div className="flex-1 flex flex-col bg-maroon-300 h-full items-center justify-center">
				<Loader className="size-5 animate-spin text-muted-foreground" />
			</div>
		);
	}
	if (!workspace || !member) {
		return (
			<div className="flex-1 flex flex-col bg-maroon-300 h-full items-center justify-center gap-y-2">
				<TriangleAlert className="size-5 text-muted-foreground" />
				<span className="text-muted-foreground text-sm">
					Workspace not found
				</span>
			</div>
		);
	}

	return (
		<div className="flex-1 flex flex-col bg-maroon-300 h-full items-center justify-center">
			<TriangleAlert className="size-5 text-muted-foreground" />
			<span className="text-muted-foreground text-sm">No channel found</span>
		</div>
	);
};

export default WorkspaceIdPage;
