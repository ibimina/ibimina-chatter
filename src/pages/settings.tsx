import { useAuthContext } from "@/store/store";
import Image from "next/image";


function User() {
const {state} = useAuthContext()
    return (<>
        <form >
      <div className="flex gap-2">
                <div>
                    <label>
                        <span>Full name</span>
                        <input type="text" />
                    </label>
                    <label>
                        <span>Profile Tagline</span>
                        <input type="text" />
                    </label>
                    <label>
                        <span>Profile Photo</span>
                        <Image src={state?.user?.photoURL || "/images/icons8-user.svg"} width={40} height={40} alt={state?.user?.displayName}/>
                        <input type="file" />
                    </label>
                    <label>
                        <input type="location" />
                    </label>
                    <label>
                        <span>About you</span>
                        <span>Profile Bio</span>
                        <input type="text" />
                    </label>
                    <label>
                        <input type="text" />
                    </label>
                    <label>
                        <input type="text" />
                    </label>
                    <label>
                        <input type="file" />
                    </label>
                    <label>
                        <input type="location" />
                    </label>
                    <label>
                        <span>About you</span>
                        <span>Profile Bio</span>
                        <input type="text" />
                    </label>
                    <label>
                        <span>Topics</span>
                        <input type="location" />
                    </label>
                </div>
                <div>
                    <label>
                        <input type="location" />
                    </label>
                    <label>
                        <input type="location" />
                    </label>
                    <label>
                        <input type="location" />
                    </label>
                    <label>
                        <input type="location" />
                    </label>
                    <label>
                        <input type="location" />
                    </label>
                </div>

      </div>
            <input type="submit" value="Update" />
        </form>
    </>);
}

export default User;