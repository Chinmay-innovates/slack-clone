import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useRemoveWorkspace } from "@/features/auth/workspaces/api/use-remove-workspace ";
import { useUpdateWorkspace } from "@/features/auth/workspaces/api/use-update-workspace ";
import { TrashIcon } from "lucide-react";
import { useState } from "react";

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
	const [value, setValue] = useState(initialValue);
	const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } =
		useUpdateWorkspace();
	const { mutate: removeWorkspace, isPending: isremovingWorkspace } =
		useRemoveWorkspace();
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent className="p-0 bg-gray-50 overflow-hidden">
				<DialogHeader className="p-4 border-b bg-white">
					<DialogTitle>{value}</DialogTitle>
				</DialogHeader>
				<div className="px-4 pb-4 flex flex-col gap-y-2">
					<div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
						<div className="flex items-center justify-between">
							<p className="text-sm font-bold">Workspace name</p>
							<p className="text-sm text-[#1274A3] hover:underline font-semibold">
								Edit
							</p>
						</div>
						<p className="text-sm">{value}</p>
					</div>
					<button
						disabled={false}
						className="flex rounded-lg items-center gap-x-2 px-5 py-4 bg-white border cursor-pointer hover:bg-gray-50 text-rose-600"
					>
						<TrashIcon className="size-4" />
						<p className="text-sm font-bold">Delete Workspace</p>
					</button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
