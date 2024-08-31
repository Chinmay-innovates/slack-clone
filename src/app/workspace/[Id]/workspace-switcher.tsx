import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {  Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCreateWorkspaceModal } from "@/features/workspaces/store/use-create-workspace-modal";
import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { Spinner } from "@/components/spinner";

export const WorkspaceSwitcher = () => {
	const router = useRouter();
	const workspaceId = useWorkspaceId();
	const [_open, setOpen] = useCreateWorkspaceModal();

	const { data: workspaces, isLoading: workspacesLoading } = useGetWorkspaces();
	const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
		id: workspaceId,
	});
	const filteredWorkspaces = workspaces?.filter(
		(workspace) => workspace._id !== workspaceId
	);
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					className="size-9 relative overflow-
                 bg-gray-100 hover:bg-gray-100/80 font-bold"
				>
					{workspaceLoading ? (
						<Spinner />
					) : (
						workspace?.name.charAt(0).toUpperCase()
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent side="bottom" align="start" className="w-64">
				<DropdownMenuItem
					onClick={() => router.push(`/workspace/${workspaceId}`)}
					className="cursor-pointer flex-col items-start capitalize"
				>
					{workspace?.name}
					<span className=" text-xs text-muted-foreground">
						Active workspace
					</span>
				</DropdownMenuItem>
				{filteredWorkspaces?.map((ws) => (
					<DropdownMenuItem
						key={ws._id}
						onClick={() => router.push(`/workspace/${ws._id}`)}
						className="cursor-pointer capitalize overflow-hidden"
					>
						<div className=" shrink-0 size-9 bg-gray-200 relative overflow-hidden text-fade-100 font-semibold text-lg rounded-md flex items-center justify-center m-1">
							{ws?.name.charAt(0).toUpperCase()}
						</div>
						<p className="truncate">{ws.name}</p>
					</DropdownMenuItem>
				))}
				<DropdownMenuItem
					className="cursor-pointer"
					onClick={() => setOpen(true)}
				>
					<div className="size-9 bg-white-100 relative overflow-hidden text-slate-800 font-semibold text-lg rounded-md flex items-center justify-center m-2">
						<Plus />
					</div>
					Create a new workspace
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
