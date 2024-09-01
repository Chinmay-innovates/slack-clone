import Link from "next/link";
import { toast } from "sonner";
import { AlertTriangle, ChevronDown, MailIcon, XIcon } from "lucide-react";
import { Id } from "../../../../convex/_generated/dataModel";

import { useGetMember } from "@/features/members/api/use-get-member";
import { useUpdateMember } from "@/features/members/api/use-update-member";
import { useRemoveMember } from "@/features/members/api/use-remove-member";
import { useCurrentMember } from "@/features/members/api/use-current-member";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import { Separator } from "@/components/ui/separator";
import { useWorkspaceId } from "@/hooks/use-workspace-id";

interface ProfileProps {
	memberId: Id<"members">;
	onClose: () => void;
}

export const Profile = ({ memberId, onClose }: ProfileProps) => {
	const workspaceId = useWorkspaceId();
	

	const { data: member, isLoading: memberLoading } = useGetMember({
		id: memberId,
	});

	const { data: currentMember, isLoading: currentMemberLoading } =
		useCurrentMember({
			workspaceId,
		});

	const { mutate: updateMember, isPending: isUpdatingmember } =
		useUpdateMember();

	const { mutate: removeMember, isPending: isRemovingMember } =
		useRemoveMember();

	const onRemove = () => {
		removeMember(
			{
				id: memberId,
			},
			{
				onSuccess() {
					toast.success("Member removed");
					onClose();
				},
				onError() {
					toast.error("Failed to remove member");
				},
			}
		);
	};

	const onLeave = () => {
		removeMember(
			{
				id: memberId,
			},
			{
				onSuccess() {
					toast.success("You left the workspace");
					onClose();
				},
				onError() {
					toast.error("Failed to leave the workspace");
				},
			}
		);
	};

	const onUpdate = (role: "admin" | "member") => {
		updateMember(
			{
				id: memberId,
				role,
			},
			{
				onSuccess() {
					toast.success("Role changed");
					onClose();
				},
				onError() {
					toast.error("Failed to change role");
				},
			}
		);
	};

	if (memberLoading || currentMemberLoading) {
		return (
			<div className="h-full flex flex-col">
				<div className="flex justify-between items-center h-[49px] px-4 border-b border-gray-500/80">
					<p className="text-lg font-bold">Profile</p>
					<Button onClick={onClose} size="iconSm" variant="ghost">
						<XIcon className="size-5 stoke-[1.5]" />
					</Button>
				</div>
				<Spinner />
			</div>
		);
	}

	if (!member) {
		return (
			<div className="h-full flex flex-col">
				<div className="flex justify-between items-center h-[49px] px-4 border-b border-gray-500/80">
					<p className="text-lg font-bold">Profile</p>
					<Button onClick={onClose} size="iconSm" variant="ghost">
						<XIcon className="size-5 stoke-[1.5]" />
					</Button>
				</div>
				<div className="flex flex-col gap-y-2 h-full items-center justify-center">
					<AlertTriangle className="size-5 text-muted-foreground" />
					<p className="text-muted-foreground text-sm">Profile not found</p>
				</div>
			</div>
		);
	}

	const avatarFallback = member.user?.name?.[0] ?? "M";
	const isAdmin = currentMember?.role === "admin";

	return (
		<div className="h-full flex flex-col">
			<div className="flex justify-between items-center h-[49px] px-4 border-b border-gray-500/80">
				<p className="text-lg font-bold">Profile</p>
				<Button onClick={onClose} size="iconSm" variant="ghost">
					<XIcon className="size-5 stoke-[1.5]" />
				</Button>
			</div>
			<div className="flex flex-col items-center justify-center p-4">
				<Avatar className="max-w-[256px] max-h-[256px] size-full">
					<AvatarImage src={member.user.image} />
					<AvatarFallback className="aspect-square text-6xl">
						{avatarFallback}
					</AvatarFallback>
				</Avatar>
			</div>
			<div className="flex-col flex p-4">
				<p className="text-xl font-bold">{member.user.name}</p>
				{isAdmin && currentMember?._id !== memberId ? (
					<div className="flex items-center gap-2 mt-4">
						<Button variant="outline" className="w-full capitalize">
							{member.role} <ChevronDown className="size-4 ml-2" />
						</Button>
						<Button variant="outline" className="w-full">
							{member.role}
						</Button>
					</div>
				) : !isAdmin && currentMember?._id === memberId ? (
					<div className="mt-4">
						<Button variant="outline" className="w-full">
							Leave
						</Button>
					</div>
				) : null}
			</div>
			<Separator className="bg-gray-100/70" />
			<div className="flex-col flex p-4">
				<p className="text-sm font-bold mb-4">Contact Information</p>
				<div className="flex items-center gap-2">
					<div className="size-9 rounded-md bg-accent flex items-center justify-center">
						<MailIcon className="size-4" />
					</div>
					<div className="flex  flex-col">
						<p className="text-[13px] font-semibold text-accent-foreground">
							Email Address
						</p>
						<Link
							href={`mailto:${member.user.email}`}
							className="text-sm hover:underline text-[#1225a3]"
						>
							{member.user.email}
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
};
