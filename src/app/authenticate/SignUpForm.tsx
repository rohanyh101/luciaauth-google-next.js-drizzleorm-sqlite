"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import React from "react";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";

import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signUp } from "./auth.action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const SignUpSchema = z
	.object({
		name: z.string().min(5),
		email: z.string().email(),
		password: z.string().min(4),
		confirmPassword: z.string().min(4),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

const SignUpForm = () => {
	const router = useRouter();
	const form = useForm<z.infer<typeof SignUpSchema>>({
		resolver: zodResolver(SignUpSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	async function onSubmit(values: z.infer<typeof SignUpSchema>) {
		const res = await signUp(values);
		if (res.success) {
			toast.success("Account created successfully");
			router.push("/dashboard");
		} else {
			toast.error(res.error);
		}

		// console.log(values);
	}
	return (
		<Card className="min-w-[450px]">
			<CardHeader>
				<CardTitle>Begin your journey...</CardTitle>
				<CardDescription>
					Sign up for an account to get started.
				</CardDescription>
			</CardHeader>

			<CardContent className="space-y-2">
				<Form {...form}>
					<form
						className="flex flex-col gap-2"
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input type="text" placeholder="username" {...field}
										onChange={(e) => {
											e.target.value = e.target.value.trim();
											field.onChange(e);
										}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											// type="email"
											placeholder="user@domain.com"
											{...field}
											onChange={(e) => {
												e.target.value = e.target.value.trim();
												field.onChange(e);
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input type="password" placeholder="password" {...field} onChange={(e) => {
											e.target.value = e.target.value.trim();
											field.onChange(e);
										}}/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="confirmPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Confirm Password</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="confirm password"
											{...field}
											onChange={(e) => {
												e.target.value = e.target.value.trim();
												field.onChange(e);
											}}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button type="submit" className="self-start mt-2">
							Sign up
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
};

export default SignUpForm;
