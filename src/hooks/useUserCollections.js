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

    fetch(
      "http://groll2.eu-central-1.elasticbeanstalk.com/direct/0x8323B1A1057B76476eed77E98a35Ed7B26D50a7F/f_ownedTokenIds/0xA55Ec1Ccc5877A4A24D8D9435f8B3Ba196CB5D4a",
      requestOptions
    )
      .then((response) => response.json()) // if the response is a JSON object
      .then((result) => {
        setData(result);
      })
      .catch((error) => {
        setError(error);
      });
  }, []);

  return { data, error };
};

export default useUserCollections;
