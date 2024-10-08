"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {  LogOut } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useCurrentUser } from "../auth/api/use-current-user";
import { Spinner } from "@/components/spinner";

export const UserButton = () => {
	const { signOut } = useAuthActions();
	const { data, isLoading } = useCurrentUser();

	if (isLoading)
		return <Spinner  />;

	if (!data) return null;

	const { email, image, name } = data;

	const avatarFallback = name!.charAt(0).toUpperCase();

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger className="outline-none relative">
				<Avatar className="size-10 hover:opacity-75 transition">
					<AvatarImage alt={name} src={image} />
					<AvatarFallback>{avatarFallback}</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="center" side="right" className="w-80">
				<DropdownMenuItem onClick={() => signOut()} className="h-10">
					<LogOut className="mr-2 size-4" />
					Log Out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
