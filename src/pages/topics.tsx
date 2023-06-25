import Link from "next/link";
import { firebaseStore } from "@/firebase/config";
import { useAuthContext } from "@/store/store";
import { setDoc, doc } from "firebase/firestore";
import { useState } from "react";
import styles from '../styles/tags.module.css'
import useCollection from "@/hooks/useCollection";
import Head from "next/head";


function Topics() {
	const { state, dispatch } = useAuthContext();
	const { data } = useCollection("users", state?.user?.uid)
	const [arr, setArr] = useState(data?.topics || [])
	const [topic, setTopic] = useState("")

	const [articleTags, setArticleTags] = useState([
		{ topic: "JavaScript", selected: false },
		{ topic: "HTML", selected: false },
		{ topic: "CSS", selected: false },
		{ topic: "React", selected: false },
		{ topic: "Vue", selected: false },
		{ topic: "cloud engineering", selected: false },
		{ topic: "accessibility", selected: false },
		{ topic: "nodejs", selected: false },
	])

	const getUserPreferredTag = async (e: React.FormEvent, topic: string) => {
		const userRef = doc(firebaseStore, 'users', state?.user?.uid);
		e.preventDefault()
		if (topic.length > 1) {
			const exist = articleTags.find((articleTag) => {
				return articleTag.topic.toLowerCase() === topic.toLowerCase()
			})
			if (!exist) {
				arr.push(topic)
				setDoc(userRef, {
					topics: arr
				}, { merge: true });
				setArticleTags([...articleTags, { topic, selected: true }])
				//dispatch to add to user topics
				dispatch({ type: "ADDTAG", payload: topic })
				setTopic("")
			}
		}

	}


	const addUserTags = async (e: React.MouseEvent, topic: string) => {
		e.preventDefault();
		let addBtn = e.currentTarget.getAttribute('aria-pressed');
		if (addBtn === 'false') {
			const userRef = doc(firebaseStore, 'users', state?.user?.uid);
			e.currentTarget.setAttribute('aria-pressed', 'true');
			const exist = arr.find((articleTag: string) => {
				return articleTag.toLowerCase() === topic.toLowerCase()
			})
			if (!exist) {
				arr.push(topic)
				setDoc(userRef, {
					topics: arr
				}, { merge: true });
				//dispatch to add to user topics
				dispatch({ type: "ADDTAG", payload: topic })
			}
		}
		else {
			const userRef = doc(firebaseStore, 'users', state?.user?.uid);
			e.currentTarget.setAttribute('aria-pressed', 'false');
			const updateArray = arr.filter((userTag: string) => userTag !== topic)
			setArr(updateArray)
			setDoc(userRef, {
				topics: arr
			}, { merge: true });
			//remove from user topics
			dispatch({ type: "REMOVETAG", payload: topic })
		}
	}
	return (
		<>
			<Head>
				<title>Add topics  on InkSpire</title>
				<meta charSet="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta http-equiv="X-UA-Compatible" content="IE=7" />
				<meta name="description" content="Add topics to personalise your feeds" />
			</Head>
			<section>
				<h1 className={`font-bold text-3xl font-serif ml-5 my-4 md:px-2 text-transparent bg-clip-text bg-gradient-to-br  from-purple-700 to-blue-400 `}>InkSpire</h1>
				<div className={`pb-3`}>
					<div className={`w-10/12 ml-5 md:px-2`}>
						<div className={`mb-5`}>
							<p className={`font-medium`}>Select your topics</p>
							<p className="text-slate-600">
								We use topics to personalise your feeds and make it easier for you to discover relevent content
							</p>
						</div>
						<form className={`flex rounded-xl items-stretch`} onSubmit={(e) => getUserPreferredTag(e, topic)}>
							<input type="text" name="topic" placeholder="Add your preferred topic" value={topic} onChange={(e) => setTopic(e.target.value)} className={`border-2 border-solid border-slate-300 basis-9/12 md:basis-6/12 lg:basis-2/5 p-2 rounded-s-xl`} />
							<input type="submit" value="Add topic" className={`bg-violet-500 font-medium block basis-1/4 text-white rounded-e-xl hover:bg-violet-800 cursor-pointer`} />
						</form>
						<div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-3 my-8`}>
							{articleTags.map((articleTag, index) =>
								<div key={index} className={`flex justify-between items-center bg-stone-200 hover:bg-zinc-500 hover:text-slate-100 cursor-pointer`} aria-selected='false'>
									<p className={`px-4 py-3 font-medium`}>{articleTag.topic} </p>
									<button onClick={(e) => addUserTags(e, articleTag.topic)} className={`bg-contain bg-no-repeat bg-center w-5 h-5 m-2 ${styles.add}`} aria-label="add tag" aria-pressed={articleTag.selected}></button>
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

export default Topics;
