import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

/* eslint-disable @next/next/no-img-element */
interface ThumbnailProps {
	url: string | null | undefined;
}

export const Thumbnail = ({ url }: ThumbnailProps) => {
	if (!url) return null;
	return (
		<Dialog>
			<DialogTrigger>
				<div className="relative overflow-hidden  max-w-[260px] border rounded-lg my-2 cursor-zoom-in">
					<img
						src={url}
						className="rounded-md object-cover size-full"
						alt="Message img"
					/>
				</div>
			</DialogTrigger>
			<DialogContent className="max-w-[800px] border-none bg-transparent p-0 shadow-none">
				<img
					src={url}
					className="rounded-md object-cover size-full"
					alt="Message img"
				/>
			</DialogContent>
		</Dialog>
	);
};
