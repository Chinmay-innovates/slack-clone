import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Trash } from "lucide-react";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { useConfirmation } from "@/hooks/use-confirmation";

import { useRemoveChannel } from "@/features/channels/api/use-remove-channel";
import { useUpdateChannel } from "@/features/channels/api/use-update-channel";
import { useCurrentMember } from "@/features/members/api/use-current-member";

interface HeaderProps {
	title: string;
}

export const Header = ({ title }: HeaderProps) => {
	const [ConfirmDialog, confirm] = useConfirmation(
		"Delete this channel",
		"You are about to delete this channel. This action irreversible"
	);
	const [value, setValue] = useState(title);
	const [editOpen, setEditOpen] = useState(false);
	const router = useRouter();

	const channelId = useChannelId();
	const workspaceId = useWorkspaceId();

	const { mutate: updatechannel, isPending: IsUpdatingChannel } =
		useUpdateChannel();
	const { mutate: removechannel, isPending: IsremovingChannel } =
		useRemoveChannel();
	const { data: member } = useCurrentMember({ workspaceId });

	const handleOpen = async (value: boolean) => {
		if (member?.role !== "admin") return;
		setEditOpen(value);
	};

	const handleRemove = async () => {
		const ok = await confirm();
		if (!ok) return;
		removechannel(
			{
				id: channelId,
			},
			{
				onSuccess() {
					toast.success("Channel deleted");
					router.push(`/workspace/${workspaceId}`);
				},
				onError() {
					if (member?.role !== "admin") {
						toast.error("You are not an admin");
						return;
					}
					toast.error("Failed to delete channel");
				},
			}
		);
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		updatechannel(
			{
				id: channelId,
				name: value,
			},
			{
				onSuccess() {
					toast.success("Channel updated");
					setEditOpen(false);
				},
				onError() {
					toast.error("Failed to update channel");
					setEditOpen(false);
				},
			}
		);
	};

	const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
		setValue(value);
	};

	return (
		<>
			<ConfirmDialog />
			<div className="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden">
				<Dialog>
					<DialogTrigger asChild>
						<Button
							className="text-lg font-extrabold px-2 overflow-hidden w-auto "
							variant="ghost"
							size="sm"
						>
							<span className="truncate"># {title}</span>
							<ChevronDown className="size-2.5 ml-2" />
						</Button>
					</DialogTrigger>
					<DialogContent className="p-0 bg-gray-50 overflow-hidden">
						<DialogHeader className="p-4 bg-white border-b">
							<DialogTitle className=" flex font-extrabold">
								# {title}
							</DialogTitle>
						</DialogHeader>
						<div className="px-4 pb-4 flex flex-col gap-y-2">
							<Dialog open={editOpen} onOpenChange={handleOpen}>
								<DialogTrigger asChild>
									<div className="px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50">
										<div className="flex items-center justify-between">
											<p className="text-sm font-semibold">Channel name</p>
											{member?.role === "admin" && (
												<p className="text-sm font-semibold text-[#1264A3]">
													Edit
												</p>
											)}
										</div>
										<p className="text-sm"># {title}</p>
									</div>
								</DialogTrigger>
								<DialogContent>
									<DialogHeader>
										<DialogTitle className="font-extrabold">
											Rename this channel
										</DialogTitle>
									</DialogHeader>
									<form onSubmit={handleSubmit} className="space-y-4">
										<Input
											value={value}
											disabled={IsUpdatingChannel}
											onChange={handleChange}
											required
											autoFocus
											minLength={3}
											maxLength={80}
											placeholder="e.g. plan-budget"
										/>
										<DialogFooter>
											<DialogClose asChild>
												<Button disabled={IsUpdatingChannel} variant="outline">
													Cancel
												</Button>
											</DialogClose>
											<Button disabled={IsUpdatingChannel}>Save</Button>
										</DialogFooter>
									</form>
								</DialogContent>
							</Dialog>
							<button
								onClick={handleRemove}
								disabled={IsremovingChannel}
								className="flex items-center gap-x-2 px-5 py-4 bg-white
                        cursor-pointer rounded-lg border hover:bg-gray-50 text-rose-600"
							>
								<Trash className="size-4" />
								<p className="text-sm font-semibold">Delete channel</p>
							</button>
						</div>
					</DialogContent>
				</Dialog>
			</div>
		</>
	);
};
