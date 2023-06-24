import { useEffect, useState } from "react";

export const useCustomIpfs = (ipfsLink) => {
  const [convertedLink, setConvertedLink] = useState("");

  useEffect(() => {
    const convertToHTTP = async () => {
      const ipfsPath = ipfsLink?.replace("https://ipfs.moralis.io:2053", "");
      const httpLink = `http://ipfs.io/ipfs${ipfsPath}`;
      setConvertedLink(httpLink);
    };

    convertToHTTP();
  }, [ipfsLink]);

  return convertedLink;
};
