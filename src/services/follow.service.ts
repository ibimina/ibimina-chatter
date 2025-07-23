import api from './base.service';


// follow request
export const followRequest = async (user_id: string) => {
    return await api.post(`/follow/users/${user_id}`)
}