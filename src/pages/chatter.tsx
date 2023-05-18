import useLogOut from "@/hooks/useLogout";
import { useAuthContext } from "@/store/store";
import { useRouter } from "next/router";
import { useEffect } from "react";

function Chatter() {
	const { state } = useAuthContext();
	const { logoutUser } = useLogOut();
	const router = useRouter();
	useEffect(() => {
		if (state?.user === null) {
			router.push('/')
		} 
	}, [router, state]);
	return (
		<>
			<h1>hello</h1>
			<button onClick={logoutUser}>logout</button>
		</>
	);
}

export default Chatter;
