import api from './base.service';
import Cookies from 'js-cookie';

export const login = async (data: FormData) => {
	const res = await api.post('/auth/login', 
		data, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		}
	);
	Cookies.set('loggedin', 'true');
	
	return res;
};

export const signUp = async (data: {
	username: string;
	email: string;
	password: string;
}) => {
	const res = await api.post('/users', data);
	Cookies.set('loggedin', 'true');

	return res;
};
