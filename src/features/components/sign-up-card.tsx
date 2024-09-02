import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { SignInFlow } from "../types";
import { useState } from "react";
import { TriangleAlert } from "lucide-react";
import { useAuthActions } from "@convex-dev/auth/react";

interface SignUpCardProps {
	setState: (state: SignInFlow) => void;
}

export const SignUpCard = ({ setState }: SignUpCardProps) => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [pending, setPending] = useState(false);
	const [error, setError] = useState("");

	const { signIn } = useAuthActions();

	const credentialSignUp = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return;
		}
		setPending(true);
		signIn("password", { name, email, password, flow: "signUp" })
			.catch(() => {
				setError("Something went wrong");
			})
			.finally(() => {
				setPending(false);
			});
	};

	const onProvider = (value: "github" | "google") => {
		setPending(true);
		signIn(value).finally(() => {
			setPending(false);
		});
	};

	return (
		<Card className="w-full h-full p-8">
			<CardHeader className="px-0 pt-0">
				<CardTitle>Sign up to continue</CardTitle>
				<CardDescription>
					Use your email or another service to continue
				</CardDescription>
			</CardHeader>
			{!!error && (
				<div className="bg-destructive/15 p-3 rounded-md flex items-center text-destructive mb-6">
					<TriangleAlert className="size-4 mr-2" />
					<p> {error} </p>
				</div>
			)}
			<CardContent className="space-y-5 px-0 pb-0">
				<form onSubmit={credentialSignUp} className="space-y-2.5">
					<Input
						disabled={pending}
						onChange={(e) => setName(e.target.value)}
						value={name}
						placeholder="Full Name"
						required
					/>
					<Input
						disabled={pending}
						onChange={(e) => setEmail(e.target.value)}
						value={email}
						placeholder="Email"
						type="email"
						required
					/>
					<Input
						disabled={pending}
						onChange={(e) => setPassword(e.target.value)}
						value={password}
						placeholder="Password"
						type="password"
						required
					/>
					<Input
						disabled={pending}
						onChange={(e) => setConfirmPassword(e.target.value)}
						value={confirmPassword}
						placeholder=" Confirm password"
						type="password"
						required
					/>
					<Button type="submit" className="w-full" size="lg" disabled={pending}>
						Continue
					</Button>
				</form>
				<Separator />
				<div className="flex flex-col gap-y-2.5">
					<Button
						size="lg"
						variant="outline"
						className="w-full relative"
						disabled={pending}
						onClick={() => onProvider("google")}
					>
						<FcGoogle className="size-5 absolute top-3 left-2.5" />
						Continue with Google
					</Button>
					<Button
						size="lg"
						variant="outline"
						className="w-full relative"
						disabled={pending}
						onClick={() => onProvider("github")}
					>
						<FaGithub className="size-5 absolute top-3 left-2.5" />
						Continue with Github
					</Button>
				</div>
				<p className="text-xs text-muted-foreground">
					Already have an account?{" "}
					<span
						onClick={() => setState("signIn")}
						className="text-sky-700 hover:underline cursor-pointer"
					>
						Sign in
					</span>
				</p>
			</CardContent>
		</Card>
	);
};
