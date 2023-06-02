import Link from "next/link";
import { firebaseStore } from "@/firebase/config";
import { useAuthContext } from "@/store/store";
import { setDoc, doc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from '../styles/tags.module.css'
import useCollection from "@/hooks/useCollection";


function Chatter() {
	const { state } = useAuthContext();
	const { data } = useCollection("users",state?.user?.uid)
	const [arr,setArr] = useState(data?.tags || [])
	const [tag, setTag] = useState("")
	const router = useRouter();

	const [articleTags, setArticleTags] = useState([
		{ tag: "JavaScript", selected: false },
		{ tag: "HTML", selected: false },
		{ tag: "CSS", selected: false },
		{ tag: "React", selected: false },
		{ tag: "Vue", selected: false },
		{ tag: "cloud engineering", selected: false },
		{ tag: "accessibility", selected: false },
		{ tag: "nodejs", selected: false },
	])
	console.log(arr)
	const getUserPreferredTag = async (e: React.FormEvent, tag: string) => {
		const userRef = doc(firebaseStore, 'users', state?.user?.uid);
		e.preventDefault()
		if (tag.length > 1) {
			const exist = articleTags.find((articleTag) => {
				return articleTag.tag.toLowerCase() === tag.toLowerCase()
			})
			if (exist) {
				console.log(arr)
				return
			} else {
				arr.push(tag)
				console.log(arr)
				setDoc(userRef, {
					tags: arr
				}, { merge: true });
				setArticleTags([...articleTags, { tag, selected: true }])
				setTag("")
			}
		}

	}


	const addUserTags = async (e: React.MouseEvent, tag: string) => {
		e.preventDefault();

		let addBtn = e.currentTarget.getAttribute('aria-pressed');
		if (addBtn === 'false') {
			const userRef = doc(firebaseStore, 'users', state?.user?.uid);
			e.currentTarget.setAttribute('aria-pressed', 'true');
			const exist = arr.find((articleTag: string) => {
				return articleTag.toLowerCase() === tag.toLowerCase()
			})
			if (exist) {
				return
			}
			else {
				arr.push(tag)
				setDoc(userRef, {
					tags: arr
				}, { merge: true });
			}
		}
		else {
			const userRef = doc(firebaseStore, 'users', state?.user?.uid);
			e.currentTarget.setAttribute('aria-pressed', 'false');
			const updateArray = arr.filter((userTag: string) => userTag !== tag)
			setArr(updateArray)
			setDoc(userRef, {
				tags: arr
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
			<section>
				<h1 className={`text-3xl font-bold underline ml-5 my-4 md:px-2`}>Chatter</h1>
				<div className={`pb-3`}>
					<div className={`w-10/12 ml-5 md:px-2`}>
						<div className={`mb-5`}>
							<p className={`font-medium`}>Select your tags</p>
							<p className="text-slate-600">
								We use tags to personalise your feeds and make it easier for you to discover relevent content
							</p>
						</div>
						<form className={`flex rounded-xl items-stretch`} onSubmit={(e) => getUserPreferredTag(e, tag)}>
							<input type="text" name="tag" placeholder="Add your preferred tag" value={tag} onChange={(e) => setTag(e.target.value)} className={`border-2 border-solid border-slate-300 basis-9/12 md:basis-6/12 lg:basis-2/5 p-2 rounded-s-xl`} />
							<input type="submit" value="Add tag" className={`bg-violet-500 font-medium block basis-1/4 text-white rounded-e-xl hover:bg-violet-800 cursor-pointer`} />
						</form>
						<div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-3 my-8`}>
							{articleTags.map((articleTag, index) =>
								<div key={index} className={`flex justify-between items-center bg-stone-200 hover:bg-zinc-500 hover:text-slate-100 cursor-pointer`} aria-selected='false'>
									<p className={`px-4 py-3 font-medium`}>{articleTag.tag} </p>
									<button onClick={(e) => addUserTags(e, articleTag.tag)} className={`bg-contain bg-no-repeat bg-center w-5 h-5 m-2 ${styles.add}`} aria-label="add tag" aria-pressed={articleTag.selected}></button>
								</div>
							)}
						</div>
					</div>
					<Link href="/chatter" className={`bg-violet-700 text-white px-9 py-3 mx-auto mb-4 font-medium block w-max hover:bg-purple-600 `}>Next</Link>
				</div>
			</section>
		</>
	);
}

export default Chatter;


