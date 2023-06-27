import { useEffect, useState } from "react";
import { useAccount, useContract } from "wagmi";

const useUserCollections = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const user = useAccount();
  const userAddress = user?.address;

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(process.env.NEXT_PUBLIC_GET_COLLECTION + userAddress, requestOptions)
      .then((response) => response.json()) // if the response is a JSON object
      .then((result) => {
        setData(result);
      })
      .catch((error) => {
        setError(error);
      });
  }, [userAddress]);

  return { data, error };
};

export default useUserCollections;
