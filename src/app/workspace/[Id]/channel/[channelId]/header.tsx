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
import { Input } from "@/components/ui/input";
import { ChevronDown, Trash } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
	title: string;
}

export const Header = ({ title }: HeaderProps) => {
	const [value, setValue] = useState(title);
	const [editOpen, seteEditOpen] = useState(false);

	const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value.replace(/\s+/g, "-").toLowerCase();
		setValue(value);
	};

	return (
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
						<DialogTitle className="font-extrabold"># {title}</DialogTitle>
					</DialogHeader>
					<div className="px-4 pb-4 flex flex-col gap-y-2">
						<Dialog open={editOpen} onOpenChange={seteEditOpen}>
							<DialogTrigger asChild>
								<div className="px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50">
									<div className="flex items-center justify-between">
										<p className="text-sm font-semibold">Channel name</p>
										<p className="text-sm font-semibold text-[#1264A3]">Edit</p>
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
								<form className="space-y-4">
									<Input
										value={value}
										disabled={false}
										onChange={handleChange}
										required
										autoFocus
										minLength={3}
										maxLength={80}
										placeholder="e.g. plan-budget"
									/>
									<DialogFooter>
										<DialogClose asChild>
											<Button disabled={false} variant="outline">
												Cancel
											</Button>
										</DialogClose>
										<Button disabled={false}>Save</Button>
									</DialogFooter>
								</form>
							</DialogContent>
						</Dialog>
						<button
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
	);
};
