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
import { useAuthActions } from "@convex-dev/auth/react";
import { TriangleAlert } from "lucide-react";

interface SignInCardProps {
	setState: (state: SignInFlow) => void;
}

export const SignInCard = ({ setState }: SignInCardProps) => {
	const { signIn } = useAuthActions();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [pending, setPending] = useState(false);
	const [error, setError] = useState("");

	const credentialSignIn = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setPending(true);
		signIn("password", { email, password, flow: "signIn" })
			.catch(() => {
				setError("Invalid email or password");
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
				<CardTitle>Login to continue</CardTitle>
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
				<form onSubmit={credentialSignIn} className="space-y-2.5">
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
					Don&apos;t have an account?{" "}
					<span
						onClick={() => setState("signUp")}
						className="text-sky-700
                    hover:underline cursor-pointer"
					>
						Sign up
					</span>
				</p>
			</CardContent>
		</Card>
	);
};
