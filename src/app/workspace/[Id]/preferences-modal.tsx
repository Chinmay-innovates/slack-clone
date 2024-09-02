import { useState } from "react";
import { useRouter } from "next/navigation";
import { TrashIcon } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useConfirmation } from "@/hooks/use-confirmation";
import { useUpdateWorkspace } from "@/features/workspaces/api/use-update-workspace ";
import { useRemoveWorkspace } from "@/features/workspaces/api/use-remove-workspace ";



interface PreferencesModalProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	initialValue: string;
}

export const PreferencesModal = ({
	initialValue,
	open,
	setOpen,
}: PreferencesModalProps) => {
	const workspaceId = useWorkspaceId();
	const router = useRouter();

	const [value, setValue] = useState(initialValue);
	const [editOpen, setEditOpen] = useState(false);
	const [ConfirmDialog, confirm] = useConfirmation(
		"are you sure?",
		"This action is irreversible."
	);

	const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } =
		useUpdateWorkspace();
	const { mutate: removeWorkspace, isPending: isremovingWorkspace } =
		useRemoveWorkspace();

	const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		updateWorkspace(
			{
				id: workspaceId,
				name: value,
			},
			{
				onSuccess: () => {
					setEditOpen(false);
					toast.success("Workspace updated");
				},
				onError: () => {
					toast.error("Failed to update workspace");
				},
			}
		);
	};
	const handleRemove = async () => {
		const ok = await confirm();
		if (!ok) return;
		removeWorkspace(
			{
				id: workspaceId,
			},
			{
				onSuccess: () => {
					toast.success("Workspace removed");
					router.replace("/");
				},
				onError: () => {
					toast.error("Failed to remove workspace");
				},
			}
		);
	};
	return (
		<>
		<ConfirmDialog/>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="p-0 bg-gray-50 overflow-hidden">
					<DialogHeader className="p-4 border-b bg-white">
						<DialogTitle>{value}</DialogTitle>
					</DialogHeader>
					<div className="px-4 pb-4 flex flex-col gap-y-2">
						<Dialog open={editOpen} onOpenChange={setEditOpen}>
							<DialogTrigger asChild>
								<div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
									<div className="flex items-center justify-between">
										<p className="text-sm font-bold">Workspace name</p>
										<p className="text-sm text-seablue-100 hover:underline font-semibold">
											Edit
										</p>
									</div>
									<p className="text-sm">{value}</p>
								</div>
							</DialogTrigger>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>Rename this workspace</DialogTitle>
								</DialogHeader>
								<form className="space-y-4" onSubmit={handleEdit}>
									<Input
										value={value}
										disabled={isUpdatingWorkspace}
										onChange={(e) => setValue(e.target.value)}
										required
										autoFocus
										minLength={3}
										maxLength={80}
										placeholder="Workspace name e.g. 'Work' , 'Personal' , 'Home'"
									/>
									<DialogFooter>
										<DialogClose asChild>
											<Button variant="outline" disabled={isUpdatingWorkspace}>
												Cancel
											</Button>
										</DialogClose>
										<Button disabled={isUpdatingWorkspace}>Save</Button>
									</DialogFooter>
								</form>
							</DialogContent>
						</Dialog>

						<button
							onClick={handleRemove}
							disabled={isremovingWorkspace}
							className="flex rounded-lg items-center gap-x-2 px-5 py-4 bg-white border cursor-pointer hover:bg-gray-50 text-rose-600"
						>
							<TrashIcon className="size-4" />
							<p className="text-sm font-bold">Delete Workspace</p>
						</button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};
