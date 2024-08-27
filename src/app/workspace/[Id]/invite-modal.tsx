import { toast } from "sonner";
import { CopyIcon, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useNewJoinCode } from "@/features/workspaces/api/use-new-join-code";
import { Id } from "../../../../convex/_generated/dataModel";
import { useConfirmation } from "@/hooks/use-confirmation";

interface InviteModalProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	name: string;
	joinCode: string;
	workspaceId: Id<"workspaces">;
}

export const InviteModal = ({
	open,
	setOpen,
	joinCode,
	name,
	workspaceId,
}: InviteModalProps) => {
	const { mutate, isPending } = useNewJoinCode();
	const [ConfirmDialog, confirm] = useConfirmation(
		"Are you sure?",
		"This will deactivate the current invite code and generate a new one."
	);

	const handleNewCode = async () => {
		const ok = await confirm();

		if (!ok) return;

		mutate(
			{ workspaceId },
			{
				onSuccess() {
					toast.success("Invite code regenerated");
				},
				onError() {
					toast.error("Failed to generate invite code");
				},
			}
		);
	};
	const handleCopy = () => {
		const inviteLink = `${window.location.origin}/join/${workspaceId}`;

		navigator.clipboard
			.writeText(inviteLink)
			.then(() => toast.success("Invite link copied to clipboard"));
	};

	return (
		<>
			<ConfirmDialog />
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Invite people to your work</DialogTitle>
						<DialogDescription>
							Use the code to invite people to your workspace
						</DialogDescription>
					</DialogHeader>
					<div className="flex flex-col gap-y-4 items-center justify-center py-10">
						<p className="text-5xl font-extrabold tracking-widest uppercase">
							{joinCode}
						</p>
						<Button onClick={handleCopy} variant="ghost" size="sm">
							Copy link
							<CopyIcon className="ml-2 size-4" />
						</Button>
					</div>
					<div className="flex items-center justify-between w-full">
						<Button
							disabled={isPending}
							variant="outline"
							onClick={handleNewCode}
						>
							New Code
							<RefreshCcw className="size-4 ml-2" />
						</Button>
						<DialogClose asChild>
							<Button>Close</Button>
						</DialogClose>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};
