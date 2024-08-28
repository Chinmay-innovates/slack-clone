import {
	MutableRefObject,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import Quill, { type QuillOptions } from "quill";
import "quill/dist/quill.snow.css";

import { ImageIcon, Smile, XIcon } from "lucide-react";
import { PiTextAa } from "react-icons/pi";
import { MdSend } from "react-icons/md";

import { Button } from "./ui/button";
import { Hint } from "./hint";
import { Delta, Op } from "quill/core";
import { cn } from "@/lib/utils";
import { EmojiPopover } from "./emoji-popover";
import Image from "next/image";

type EditorValue = {
	image: File | null;
	body: string;
};

interface EditorProps {
	onSubmit: ({ image, body }: EditorValue) => void;
	onCancel?: () => void;
	placeholder?: string;
	defaultValue?: Delta | Op[];
	disabled?: boolean;
	innerRef?: MutableRefObject<Quill | null>;
	variant?: "create" | "update";
}

const Editor = ({
	onCancel,
	onSubmit,
	disabled = false,
	innerRef,
	defaultValue = [],
	placeholder = "Write something...",
	variant = "create",
}: EditorProps) => {
	const [text, setText] = useState("");
	const [image, setImage] = useState<File | null>(null);
	const [isToolbarVisible, setIsToolbarVisible] = useState(true);

	const submitRef = useRef(onSubmit);
	const disabledRef = useRef(disabled);
	const defaultValueRef = useRef(defaultValue);
	const placeholderRef = useRef(placeholder);
	const quillRef = useRef<Quill | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const imageElementRef = useRef<HTMLInputElement>(null);

	useLayoutEffect(() => {
		submitRef.current = onSubmit;
		disabledRef.current = disabled;
		defaultValueRef.current = defaultValue;
		placeholderRef.current = placeholder;
	});

	useEffect(() => {
		if (!containerRef.current) return;

		const container = containerRef.current;
		const editorContainer = container.appendChild(
			container.ownerDocument.createElement("div")
		);
		const options: QuillOptions = {
			theme: "snow",
			placeholder: placeholderRef.current,
			modules: {
				toolbar: [
					["bold", "italic", "strike"],
					["link"],
					[{ list: "ordered" }, { list: ["bullet"] }],
				],
				keyboard: {
					bindings: {
						enter: {
							key: "Enter",
							handler: () => {
								const text = quill.getText();
								const addedImage = imageElementRef.current?.files?.[0] || null;
								const isEmpty =
									!addedImage &&
									text.replace(/<(.|\n)*?>/g, "").trim().length === 0;
								if (isEmpty) return;

								const body = JSON.stringify(quill.getContents());
								submitRef.current?.({ body, image: addedImage });
							},
						},
						shift_enter: {
							key: "Enter",
							shiftKey: true,
							handler: () => {
								quill.insertText(quill.getSelection()?.index || 0, "\n");
							},
						},
					},
				},
			},
		};
		const quill = new Quill(editorContainer, options);
		quillRef.current = quill;
		quillRef.current.focus();

		// if innerRef is passed append it to quill
		if (innerRef) innerRef.current = quill;

		// appending default Value to the editor if it exists
		quill.setContents(defaultValueRef.current);
		setText(quill.getText());

		// Refreshing the textafter every keystroke
		quill.on(Quill.events.TEXT_CHANGE, () => {
			setText(quill.getText());
		});

		// clean up
		return () => {
			// turing off the listener
			quill.off(Quill.events.TEXT_CHANGE);

			if (container) container.innerHTML = "";
			if (quillRef.current) quillRef.current = null;
			if (innerRef?.current) innerRef.current = null;
		};
	}, [innerRef]);

	const toggleToolbar = () => {
		setIsToolbarVisible((curr) => !curr);
		const toolbarElement = containerRef?.current?.querySelector(".ql-toolbar");

		if (toolbarElement) toolbarElement?.classList.toggle("hidden");
	};

	// regex to check empty states
	// For ex: html tags -> <br /> <p></p> are EMPTY but not exactly
	// it will be read as "<br /> <p></p>\n" which is not empty
	const isEmpty = !image && text.replace(/<(.|\n)*?>/g, "").trim().length === 0;
	// console.log({ isEmpty, text });

	const onEmojiSelect = (emoji: any) => {
		const quill = quillRef.current;

		quill?.insertText(quill?.getSelection()?.index || 0, emoji.native);
	};

	return (
		<div className="flex flex-col">
			<input
				type="file"
				accept="image/*"
				ref={imageElementRef}
				onChange={(e) => setImage(e.target.files![0])}
				className="hidden"
			/>
			<div
				className="flex flex-col border-slate-200 rounded-md overflow-hidden 
        focus-within:border-slate-300 focus-within:shadow-sm bg-white"
			>
				<div ref={containerRef} className="h-full ql-custom" />
				{!!image && (
					<div className="p-2">
						<div className="relative size-[62px] flex ic justify-center group/image ">
							<Hint label="Remove image">
								<button
									onClick={() => {
										setImage(null);
										imageElementRef.current!.value = "";
									}}
									className="hidden group-hover/image:flex rounded-full 
								bg-black/70 hover:bg-black absolute -top-2.5 -right-2.5 text-white size-6 z-[4] border-2 border-white items-center justify-center"
								>
									<XIcon className="size3.5" />
								</button>
							</Hint>
							<Image
								src={URL.createObjectURL(image)}
								alt="Uploaded"
								fill
								className="rounded-xl overflow-hidden border object-cover"
							/>
						</div>
					</div>
				)}
				<div className="flex px-2 z-[5]">
					<Hint
						label={isToolbarVisible ? "Hide formatting" : "Show formatting"}
					>
						<Button
							disabled={disabled}
							size="iconSm"
							variant="ghost"
							onClick={toggleToolbar}
						>
							<PiTextAa className="size-4" />
						</Button>
					</Hint>
					<EmojiPopover onEmojiSelect={onEmojiSelect}>
						<Button disabled={disabled} size="iconSm" variant="ghost">
							<Smile className="size-4" />
						</Button>
					</EmojiPopover>
					{variant === "create" && (
						<Hint label="Image">
							<Button
								disabled={disabled}
								size="iconSm"
								variant="ghost"
								onClick={() => imageElementRef.current?.click()}
							>
								<ImageIcon className="size-4" />
							</Button>
						</Hint>
					)}
					{/* CREATE VARIANT */}
					{variant === "create" ? (
						<Button
							size="iconSm"
							disabled={disabled || isEmpty}
							onClick={() =>
								onSubmit({
									body: JSON.stringify(quillRef.current?.getContents()),
									image,
								})
							}
							className={cn(
								"ml-auto",
								isEmpty
									? "bg-white hover:bg-white text-muted-foreground"
									: "bg-seagreen-100 hover:bg-seagreen-100/80 text-white"
							)}
						>
							<MdSend className="size-4" />
						</Button>
					) : (
						<div className="ml-auto flex items-center gap-x-2">
							{/* UPDATE VARIANT */}
							<Button
								disabled={disabled}
								onClick={onCancel}
								size="sm"
								variant="outline"
							>
								Cancel
							</Button>
							<Button
								disabled={disabled || isEmpty}
								onClick={() =>
									onSubmit({
										body: JSON.stringify(quillRef.current?.getContents()),
										image,
									})
								}
								size="sm"
								className="bg-seagreen-100  hover:bg-seagreen-100/80 text-white"
							>
								Save
							</Button>
						</div>
					)}
				</div>
			</div>
			{variant === "create" && (
				<div
					className={cn(
						"p-2 text-[10px] text-muted-foreground flex justify-end opacity-0 transition",
						!isEmpty && "opacity-100"
					)}
				>
					<p>
						<strong>Shift + Enter</strong> to add a new line
					</p>
				</div>
			)}
		</div>
	);
};

export default Editor;
