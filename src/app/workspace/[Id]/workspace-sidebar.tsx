import { Id } from "../../../../convex/_generated/dataModel";
import {
	AlertTriangle,
	HashIcon,
	MessageSquareText,
	SendHorizonal,
} from "lucide-react";

import { WorkspaceSection } from "./workspace-section";
import { WorkspaceHeader } from "./workspace-header";
import { SidebarItem } from "./sidebar-item";
import { UserItem } from "./user-item";

import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { Spinner } from "@/components/spinner";

import { useChannelId } from "@/hooks/use-channel-id";
import { useMemberId } from "@/hooks/use-member-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

export const WorkspaceSidebar = () => {
	const memberId = useMemberId();
	const channelId = useChannelId();

	const workspaceId: Id<"workspaces"> = useWorkspaceId();
	const [_open, setOpen] = useCreateChannelModal();

	const { data: channels, isLoading: channelsLoading } = useGetChannels({
		workspaceId,
	});
	const { data: member, isLoading: memberLoading } = useCurrentMember({
		workspaceId,
	});
	const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
		id: workspaceId,
	});
	const { data: members, isLoading: membersLoading } = useGetMembers({
		workspaceId,
	});

	if (workspaceLoading || memberLoading) {
		return <Spinner />;
	}
	if (!workspace || !member) {
		return (
			<div className="flex flex-col gap-y-2 bg-maroon-300 h-full items-center justify-center">
				<AlertTriangle className="size-5 text-white" />
				<p className="text-white text-sm">Workspace not found</p>
			</div>
		);
	}
	return (
		<div className="flex flex-col bg-maroon-300 h-full">
			<WorkspaceHeader
				workspace={workspace}
				isAdmin={member.role === "admin"}
			/>
			<div className="flex flex-col px-2 mt-3">
				<SidebarItem label="Threads" icon={MessageSquareText} id="threads" />
				<SidebarItem label="Drafts & Sent" icon={SendHorizonal} id="drafts" />
			</div>
			<WorkspaceSection
				label="Channels"
				hint="New channel"
				onNew={member.role === "admin" ? () => setOpen(true) : undefined}
			>
				{channels?.map((item) => (
					<SidebarItem
						key={item._id}
						label={item.name}
						icon={HashIcon}
						id={item._id}
						variant={channelId === item._id ? "active" : "default"}
					/>
				))}
			</WorkspaceSection>
			<WorkspaceSection
				label="Direct Messages"
				hint="New direct message"
				onNew={() => {}}
			>
				{members?.map((mem) => (
					<UserItem
						key={mem._id}
						id={mem._id}
						label={mem.user.name}
						image={mem.user.image}
						variant={mem._id === memberId ? "active" : "default"}
					/>
				))}
			</WorkspaceSection>
		</div>
	);
};
