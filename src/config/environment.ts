interface IENVIRONMENT {
  BASE_URL: {
    API: string;
  };
}

export const ENVIRONMENTS: IENVIRONMENT = {
  BASE_URL: {
    API: process.env.NEXT_PUBLIC_BASE_URL as string,
  },
};
