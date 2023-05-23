import useLogOut from "@/hooks/useLogout";

function User() {
    const { logoutUser } = useLogOut();
    return ( <>
    <button >logout</button>
    </> );
}

export default User;