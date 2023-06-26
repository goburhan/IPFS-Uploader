// @ Use this hook to get sign message for each user
// @ for now its timestamp but it will change in future
export const useSignatureMessage = () => {
  const msg = Date.now().toString();
  return msg;
};
