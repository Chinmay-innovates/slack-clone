import { Id } from "../../../../convex/_generated/dataModel";
import {
	AlertTriangle,
	HashIcon,
	Loader,
	MessageSquareText,
	SendHorizonal,
} from "lucide-react";

import { useWorkspaceId } from "@/hooks/use-workspace-id";

import { WorkspaceHeader } from "./workspace-header";
import { SidebarItem } from "./sidebar-item";

import { useGetChannels } from "@/features/channels/api/use-get-channels";
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";

import { WorkspaceSection } from "./workspace-section";
import { UserItem } from "./user-item";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";

export const WorkspaceSidebar = () => {
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
		return (
			<div className="flex flex-col bg-maroon-300 h-full items-center justify-center">
				<Loader className="size-5 animate-spin text-white" />
			</div>
		);
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
					/>
				))}
			</WorkspaceSection>
		</div>
	);
};
