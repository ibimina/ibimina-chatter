import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from './base.service';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

export const getBookmarks = async () => {
    return await api.get('/bookmarks');
};

export const requestBookmark = async (articleId: string) => {
    return await api.post(`/bookmarks/${articleId}`);
};

export const useGetAllBookmarks = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['bookmarks'],
        queryFn: () => getBookmarks(),
    });

    const bookmarks = data?.data || [];

    return {
        bookmarks,
        isLoading,
        error,
    };
};

//bookmark hook
export const useBookmarkArticle = (query: string) => {
	const queryClient = useQueryClient();

	const { mutate, isPending } = useMutation({
		mutationFn: requestBookmark,
		onSuccess: async (response) => {
			toast.success(response.data.message);
			queryClient.invalidateQueries({ queryKey: [query] });
		},
		onError: (error: AxiosError) => {
			toast.error('An error occurred'), console.error(error);
		},
	});
	return { mutate, isPending };
};