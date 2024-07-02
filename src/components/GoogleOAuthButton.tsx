"use client";

import React from "react";
import { Button } from "./ui/button";
import { RiGoogleFill } from "@remixicon/react";
import { getGoogleOAuthConsentUrl } from "@/app/authenticate/auth.action";
import { toast } from "sonner";


// this is the url that we get from the getGoogleOAuthConsentUrl function

// "https://accounts.google.com/o/oauth2/v2/auth?
// response_type=code&
// client_id=47225525599-gndhqmrisg3koic4lfem5vba53i94b31.apps.googleusercontent.com&
// state=CzCI9WsVZlHXYKbcpZ2f5RkaAevjnxAnIP4Q_-TGmtI&
// scope=email+profile+openid&
// redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fgoogle%2Fcallback&code_challenge=DaooBvSCLNxkHP8mj3d5ggPEUYyGidwiyObVyXMdZSo&code_challenge_method=S256"


// redirect response 

// http://localhost:3000/api/auth/google/callback?
// state=CzCI9WsVZlHXYKbcpZ2f5RkaAevjnxAnIP4Q_-TGmtI&
// code=4%2F0ATx3LY534UbDqbqSTqDhLpzpuiT-T6fcGxJTy4gPOBbhYsYDZXeh4uCFbIo7XpBVH73ajA&
// scope=email+profile+openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&
// authuser=0&
// prompt=consent

// http://localhost:3000/api/auth/google/callback?state=AXoVY-EAjxYWCE8mDQ2lBXt4ti_OcxRKaHCLaebA6Sk&code=4%2F0ATx3LY4xkHpdBNOJ_H8gJJgQsHwMwa0NkJCfDEZtL5fPfCoT227XW9UNKfl2ut5zu1kwGw&scope=email+profile+openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&authuser=0&prompt=consent

const GoogleOAuthButton = () => {
	return (
		<Button onClick={async () => {
            const res = await getGoogleOAuthConsentUrl();
            if (res?.url) {
                window.location.href = res.url;
            } else {
                toast.error("Something went wrong");
            }
        }}>
			<RiGoogleFill className="w-4 h-4 mr-2" />
			Continue with Google
		</Button>
	);
};

export default GoogleOAuthButton;
