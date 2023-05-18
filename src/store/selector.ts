import { UserProps } from '@/types/user';

export const userUid = (state: { user: UserProps }) => state.user.uid;
export const selectUser = (state: { user: UserProps }) => state.user;
