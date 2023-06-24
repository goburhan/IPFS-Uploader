import Button from "@/components/Buttons";
import { Flex, Input } from "@/styles/styled";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { create } from "ipfs-http-client";
import CircularProgress from "@mui/material/CircularProgress";
import Moralis from "moralis";
import { useAccount, useContract } from "wagmi";
import useUserCollections from "@/hooks/useUserCollections";
import $ from "jquery";
import JSZip from "jszip";

const StyledMain = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: 100vw;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.primaryText};
  text-align: center;
`;

const NftWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  align-items: center;
  justify-content: center;
  img {
    width: 100%;
    height: 100%;
    border-radius: 1rem;
    max-width: 500px;
    max-height: 500px;
  }
`;
const FormWrapper = styled.div`
  display: grid;
  grid-template-columns: minmax(100px, 600px);
  grid-template-row: repeat(4, 1fr);
  grid-gap: 2rem;
  border-radius: 1rem;
`;

const FormItem = styled.div`
  display: flex;
  width: 100%;
  gap: 6px;
`;

export default function Nft() {
  const [nft, setNft] = useState([]);
  const url =
    "http://groll2.eu-central-1.elasticbeanstalk.com/nft/json/0x8323B1A1057B76476eed77E98a35Ed7B26D50a7F/gallery_01_01";
  const [fields, setFields] = React.useState([{ key: "", value: "" }]);
  const [convertedLink, setConvertedLink] = useState();

  const [nftInfo, setNftInfo] = useState({
    name: "",
    description: "",
    collection: "",
    type: "",
    external: "Default URL",
  });

  const handleClick = async () => {
    const imageUrl = nft;
    const abi = [
      {
        path: "boss.png",
        content: imageUrl,
      },
    ];
    console.log(abi);
    const response = await Moralis.EvmApi.ipfs.uploadFolder(
      { abi },
      { encoding: "base64" }
    );

    const splitLink = response.jsonResponse[0].path.split("/");
    const ipfsHash = splitLink.slice(-2).join("/");

    const httpLink = `https://ipfs.io/ipfs/${ipfsHash}`;
    setConvertedLink(httpLink);
  };

  // UNCOMMENT THİS USEEFFECT TO MAKE AUTOMATİCALLY UPLOAD TO IPFS
  //const [nftUrl, setNftUrl] = useState();

  // useEffect(() => {
  //   const handleClick = async () => {
  //     const imageUrl = convertedLink;
  //     const abi = [
  //       {
  //         path: "metadata.json",
  //         content: {
  //           image: imageUrl,
  //           name: nftInfo.name,
  //           description: nftInfo.description,
  //           collection: nftInfo.collection,
  //           attributes: [
  //             fields.map((field) => ({
  //               key: field.key,
  //               value: field.value,
  //             })),
  //           ],
  //         },
  //       },
  //     ];
  //     const response = await Moralis.EvmApi.ipfs.uploadFolder({ abi });

  //     const splitLink = response.jsonResponse[0].path.split("/");
  //     const ipfsHash = splitLink.slice(-2).join("/");

  //     const httpLink = `https://ipfs.io/ipfs/${ipfsHash}`;
  //     setNftUrl(httpLink);
  //   };
  //   handleClick();
  // }, [convertedLink]);

  useEffect(() => {
    if (!convertedLink) return;
    const data = {
      contractAddress: process.env.NEXT_PUBLIC_PROLL_CONTRACT,
      name: nftInfo.name,
      description: nftInfo.description,
      type: nftInfo.type,
      tokenId: 10,
      image: convertedLink,
      attributes: fields.map((field) => ({
        trait_type: field.key,
        value: field.value,
      })),
    };

    // $.ajax({
    //   url: process.env.NEXT_PUBLIC_NFT_INSERT_REQ2,
    //   type: "POST",
    //   data: JSON.stringify(data),
    //   contentType: "application/json",
    //   success: function (response) {
    //     console.log(response);
    //   },
    //   error: function (error) {
    //     console.error("Error:", error);
    //   },
    // });
  }, [convertedLink]);

  //htt ps://ipfs.io/ipfs/<your-ipfs-hash>/test.zip
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const zip = new JSZip();
      const contents = await zip.loadAsync(reader.result);

      const filePromises = [];
      contents.forEach((relativePath, zipEntry) => {
        if (!zipEntry.dir) {
          const filePromise = zipEntry.async("base64").then((content) => ({
            path: relativePath,
            content,
          }));
          filePromises.push(filePromise);
        }
      });

      const files = await Promise.all(filePromises);

      // Upload each file individually to IPFS.

      const uploadPromises = files.map(async (file) => {
        const response = await Moralis.EvmApi.ipfs.uploadFolder(
          { abi: [file] }, // Wrap each file in its own abi array
          { encoding: "base64" }
        );

        const splitLink = response.jsonResponse[0].path.split("/");
        const ipfsHash = splitLink.slice(-2).join("/");
        return `https://ipfs.io/ipfs/${ipfsHash}`; // Return the http link for this file
      });

      const httpLinks = await Promise.all(uploadPromises);

      // Now httpLinks is an array of links to the individual files in the zip.
      // Do what you wish with them.
      console.log(httpLinks);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <StyledMain>
      <Flex column>
        <NftWrapper>
          <img src={nft} alt="nft" />
        </NftWrapper>
        <Button onClick={handleClick} text={"Submit "}></Button>
      </Flex>

      <NftForm
        setNftInfo={setNftInfo}
        nftInfo={nftInfo}
        fields={fields}
        setFields={setFields}
      />
      <Flex gap="24px" column>
        <Input
          type="file"
          id="imageUpload"
          onChange={handleImageUpload}
          webkitdirectory
          multiple
        />
        {/* 
        {nftUrl && (
          <div>
            <p> {nftUrl}</p>
          </div>
        )} */}
      </Flex>

      {/* {convertedLink && (
        <div>
          <p> {convertedLink}</p>
        </div>
      )} */}
    </StyledMain>
  );
}

function NftForm({ fields, setFields, setNftInfo, nftInfo }) {
  const { data } = useUserCollections();

  const handleAddField = () => {
    setFields([...fields, { key: "", value: "" }]);
  };

  const handleChange = (index, event) => {
    const values = [...fields];
    if (event.target.name === "key") {
      values[index].key = event.target.value;
    } else {
      values[index].value = event.target.value;
    }
    setFields(values);
  };

  return (
    <>
      <FormWrapper>
        <Flex align="flex-start" column>
          <label>Name</label>
          <Input
            name="name"
            placeholder="Put a Description here"
            onChange={(event) =>
              setNftInfo({
                ...nftInfo,
                name: event.target.value,
              })
            }
          />
        </Flex>

        <Flex align="flex-start" column>
          <label>Description</label>
          <Input
            name="description"
            placeholder="Put a Description here"
            onChange={(event) =>
              setNftInfo({
                ...nftInfo,
                description: event.target.value,
              })
            }
          />
        </Flex>
        <Flex align="flex-start" column>
          <label>Type</label>
          <Input
            name="type"
            placeholder="Type of nft"
            onChange={(event) =>
              setNftInfo({
                ...nftInfo,
                external: event.target.value,
              })
            }
          />
        </Flex>
        <Flex align="flex-start" column>
          <label>External Link</label>
          <Input
            name="type"
            placeholder="Type of nft"
            onChange={(event) =>
              setNftInfo({
                ...nftInfo,
                external: event.target.value,
              })
            }
          />
        </Flex>

        {fields.map((field, index) => (
          <FormItem key={`${field}-${index}`}>
            <Flex align="flex-start" column>
              <label>Key</label>
              <Input
                name="key"
                placeholder="Key"
                value={field.key}
                onChange={(event) => handleChange(index, event)}
              />
            </Flex>
            <Flex align="flex-start" column>
              <label>Value</label>
              <Input
                name="value"
                placeholder="Value"
                value={field.value}
                onChange={(event) => handleChange(index, event)}
              />
            </Flex>
          </FormItem>
        ))}
        <Flex align="flex-start" column>
          <label>Collections</label>
          <select
            onChange={(event) =>
              setNftInfo({
                ...nftInfo,
                collection: event.target.value,
              })
            }
          >
            <option>Select a Collection</option>
            {data?.map((collection, key) => (
              <option key={key} value={collection}>
                {collection}
              </option>
            ))}
          </select>
        </Flex>
        <Button text={"Add Properties"} onClick={handleAddField} />
      </FormWrapper>
    </>
  );
}
