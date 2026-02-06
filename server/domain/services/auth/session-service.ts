export type Session = {
  user: {
    id: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
  };
};

export type SessionService = {
  getSession(): Promise<Session | null>;
};
