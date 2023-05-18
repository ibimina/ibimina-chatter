import { useAuthContext } from "@/store/store";
import { useRouter } from "next/router";
import { useEffect } from "react";

function Chatter() {
	const { state } = useAuthContext();
	const router = useRouter();
	useEffect(() => {
		if (state?.user?.uid?.length! <= 0) {
			router.push('/')
		}
	},[router, state.user]);
	return (
		<>
			<h1>hello</h1>
		</>
	);
}

export default Chatter;
