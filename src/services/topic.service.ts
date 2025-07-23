import { useQuery } from "@tanstack/react-query";
import api from "./base.service";

export const getTopics = async () => {
  return await api.get("/topics");
};

export const addUserTopicsReq = async (topic_id: string) => {
  return await api.post(`/topics/follow/${topic_id}`);
};

export const useGetAllTopics = () => {
  const { data, isLoading, error  } = useQuery({
    queryKey: ['topics'],
    queryFn: () => getTopics(),

  });

  const topics = data?.data || [];

  return {
    topics,
    isLoading,
    error,
  };
};