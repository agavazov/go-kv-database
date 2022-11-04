interface SharedData {
  user: {
    id: string | null;
    email: string;
    name: string;
    userToken: string | null;
  };
}

export const sharedData: SharedData = {
  user: {
    id: null,
    email: `greenstak-test-user-${(new Date()).getTime()}@afy.li`,
    name: 'Test User',
    userToken: null
  }
};
