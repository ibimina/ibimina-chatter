import { useAuthContext } from '@/store/store';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useLogOut from '@/hooks/useLogout';
import Image from 'next/image';
import styles from '@/styles/chatter.module.css';
import { Header } from '@/components/index';
function Chatter() {
	const { state } = useAuthContext();
	const [isvisible, seIsVisible] = useState('false');
	const { logoutUser } = useLogOut();
	const router = useRouter();
	const handleNav = () => {
		seIsVisible(!isvisible);
	};
	useEffect(() => {
		if (state?.user === null) {
			router.push('/');
		}
	}, [router, state.user]);

	return (
		<>
			<Header handleNav={handleNav} />
			<section
				className={`relative  lg:grid lg:grid-cols-5 lg:gap-9 p-4  ${styles.grid}`}
			>
				<aside className={` ${styles.aside}`} data-visible={isvisible}>
					<ul
						className={`h-full w-9/12 lg:w-full p-10 bg-slate-100 lg:rounded-xl ${styles.ul}`}
					>
						<li className={`flex items-center gap-1 mb-3`}>
							<Image
								src='/images/icons8-article.svg'
								height={44}
								width={34}
								alt='notification'
							/>
							My article
						</li>
						<li className={`flex items-center gap-1 mb-3`}>
							<Image
								src='/images/icons8-draft-64.png'
								height={34}
								width={34}
								alt='notification'
							/>
							Drafts
						</li>
						<li className={`flex items-center gap-1 mb-3`}>
							<Image
								src='/images/icons8-bookmark-64.png'
								height={24}
								width={34}
								alt='notification'
							/>
							Bookmark
						</li>
						<li className={`flex items-center gap-1`}>
							<Image
								src='/images/icons8-message-50.png'
								height={44}
								width={34}
								alt='notification'
							/>
							message
						</li>
					</ul>
					<button
						className={`bg-blue-100 top-0 right-0 absolute lg:hidden`}
						onClick={() => seIsVisible(!isvisible)}
					>
						close
					</button>
				</aside>
				<main className={`lg:col-span-4`}>
					<p>no article</p>
				</main>
			</section>
		</>
	);
}

export default Chatter;
