export interface SignUpType {
	username: string;
	email: string;
	password: string;
	topics: string[];
}

export interface TLoginType {
    email: string;
    password: string;
}

export type ApiResponse = {
  status: string;
  message: string;
  error?: {
    [key: string]: string[];
  };
  response: {
    [key: string]: {
      [x: string]: string;
    };
  };
};