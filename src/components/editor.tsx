import {
	MutableRefObject,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import Quill, { type QuillOptions } from "quill";
import "quill/dist/quill.snow.css";

import { ImageIcon, Smile } from "lucide-react";
import { PiTextAa } from "react-icons/pi";
import { MdSend } from "react-icons/md";

import { Button } from "./ui/button";
import { Hint } from "./hint";
import { Delta, Op } from "quill/core";
import { cn } from "@/lib/utils";

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
	disabled,
	innerRef,
	defaultValue = [],
	placeholder = "Write something...",
	variant = "create",
}: EditorProps) => {
	const [text, setText] = useState("");

	const submitRef = useRef(onSubmit);
	const disabledRef = useRef(disabled);
	const defaultValueRef = useRef(defaultValue);
	const placeholderRef = useRef(placeholder);
	const quillRef = useRef<Quill | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);

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
								// TODO Submit Form
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

	// regex to check empty states
	// For ex: html tags -> <br /> <p></p> are EMPTY but not exactly
	// it will be read as "<br /> <p></p>\n" which is not empty
	const isEmpty = text.replace(/<(.|\n)*?>/g, "").trim().length === 0;
	console.log({ isEmpty, text });

	return (
		<div className="flex flex-col">
			<div
				className="flex flex-col border-slate-200 rounded-md overflow-hidden 
        focus-within:border-slate-300 focus-within:shadow-sm bg-white"
			>
				<div ref={containerRef} className="h-full ql-custom" />
				<div className="flex px-2 z-[5]">
					<Hint label="Hide formatting">
						<Button
							disabled={false}
							size="iconSm"
							variant="ghost"
							onClick={() => {}}
						>
							<PiTextAa className="size-4" />
						</Button>
					</Hint>
					<Hint label="Emoji">
						<Button
							disabled={false}
							size="iconSm"
							variant="ghost"
							onClick={() => {}}
						>
							<Smile className="size-4" />
						</Button>
					</Hint>
					{variant === "create" && (
						<Hint label="Image">
							<Button
								disabled={false}
								size="iconSm"
								variant="ghost"
								onClick={() => {}}
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
							onClick={() => {}}
							className={cn(
								" ml-auto",
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
								disabled={false}
								onClick={() => {}}
								size="sm"
								variant="outline"
							>
								Cancel
							</Button>
							<Button
								disabled={false}
								onClick={() => {}}
								size="sm"
								className="bg-seagreen-100  hover:bg-seagreen-100/80 text-white"
							>
								Save
							</Button>
						</div>
					)}
				</div>
			</div>
			<div className="p-2 text-[10px] text-muted-foreground flex justify-end">
				<p>
					<strong>Shift + Enter</strong> to add a new line
				</p>
			</div>
		</div>
	);
};

export default Editor;
