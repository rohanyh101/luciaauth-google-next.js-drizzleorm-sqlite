"use client";

import { Button } from "./ui/button";
import { logout } from "@/app/authenticate/auth.action";

type Props = {
	children: React.ReactNode;
};

const SignOutButton = ({ children }: Props) => {
	return <Button className='text-base' onClick={() => logout()}>{children}</Button>;
};

export default SignOutButton;
