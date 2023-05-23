import { useAuthContext } from '@/store/store';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useLogOut from '@/hooks/useLogout';
function Chatter() {
	const { state } = useAuthContext();
	const { logoutUser } = useLogOut();
	const router = useRouter();
	useEffect(() => {
		if (state?.user === null) {
			router.push('/');
		}
	}, [router, state.user]);

	return (
		<>
			<button onClick={logoutUser}>logout</button>
		</>
	);
}

export default Chatter;
