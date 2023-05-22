import { firebaseStore } from "@/firebase/config";
import useLogOut from "@/hooks/useLogout";
import { useAuthContext } from "@/store/store";
import { setDoc, doc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from '../styles/tags.module.css'

function Chatter() {
	interface tagProps {
		tag: string;
		selected: boolean;
	}
	const { state } = useAuthContext();
	const { logoutUser } = useLogOut();
	const router = useRouter();
	const [userTags, setUserTags] = useState<tagProps[]>([]);

	
	const articleTags = [
		{ tag: "JavaScript",  selected: false },
		{ tag: "HTML", selected: false },
		{ tag: "CSS",  selected: false },
		{ tag: "React",  selected: false },
		{ tag: "Vue", selected: false },
		{ tag: "cloud engineering", selected: false },
		{ tag: "accessibility",  selected: false },
		{ tag: "nodejs",  selected: false },
	]
	const addUserTags = async (e: React.MouseEvent, tag: { tag: string; selected: boolean; }) => {
		e.preventDefault();

		let addBtn = e.currentTarget.getAttribute('aria-pressed');

		if (addBtn === 'false') {
			e.currentTarget.setAttribute('aria-pressed', 'true');
			setUserTags([...userTags, tag])
			const userRef = doc(firebaseStore, 'users', state?.user?.uid);
			await setDoc(userRef, {
				tags: userTags
			}, { merge: true });
		} else {
			e.currentTarget.setAttribute('aria-pressed', 'false');
			setUserTags(userTags.filter((userTag) => userTag.tag !== tag.tag))
			const userRef = doc(firebaseStore, 'users', state?.user?.uid);
			await setDoc(userRef, {
				tags: userTags
			}, { merge: true });
		}
	}
	useEffect(() => {
		if (state?.user === null) {
			router.push('/')
		}

	}, [router, state]);
	return (
		<>
			<button onClick={logoutUser}>logout</button>
			<section>
				<h1 className={`text-3xl font-bold underline`}>Chatter</h1>
				<div>
					<div className={`w-10/12 mx-auto`}>
						<p>select your tags</p>
						<p>
							We use tags to personalise your feeds and make it easier for you to discover relevent content
						</p>
						<form className={`flex`}>
							<input type="text" className={`border-2 border-solid border-black basis-9/12 md:basis-6/12 lg:basis-2/5`} />
							<input type="submit" value="Add tag" className={`bg-blue-500 block basis-1/4`} />
						</form>
						<div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-3 my-8`}>
							{articleTags.map((articleTag, index) =>
								<div key={index} className={`flex justify-between items-center bg-stone-200`} aria-selected='false'>
									<p className={`px-4 py-3`}>{articleTag.tag} </p>
									<button onClick={(e) => addUserTags(e, articleTag)} className={`bg-contain bg-no-repeat bg-center w-5 h-5 m-2  ${styles.add}`} aria-label="add tag" aria-pressed="false"></button>
								</div>
							)}
						</div>
					</div>


					<button className={`bg-blue-200 px-4 py-3 mx-auto block basis-1/4 grow`}>Next</button>
				</div>
			</section>
		</>
	);
}

export default Chatter;


