import { useCurrentMember } from "@/features/auth/members/api/use-current-member";
import { useGetWorkspace } from "@/features/auth/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { AlertTriangle, Loader, MessageSquareText, SendHorizonal } from "lucide-react";
import { WorkspaceHeader } from "./workspace-header";
import { SidebarItem } from "./sidebar-item";

export const WorkspaceSidebar = () => {
	const workspaceId = useWorkspaceId();
	const { data: member, isLoading: memberLoading } = useCurrentMember({
		workspaceId,
	});
	const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
		id: workspaceId,
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
				<SidebarItem
				 label="Threads"
				  icon={MessageSquareText} 
				  id="threads"
				  />
				<SidebarItem
				 label="Drafts & Sent"
				  icon={SendHorizonal} 
				  id="drafts"
				  />
			</div>
		</div>
	);
};
