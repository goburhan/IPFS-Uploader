import Button from "@/components/Buttons";
import { Flex, Input } from "@/styles/styled";
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useAccount, useContract, useSignMessage } from "wagmi";
import useUserCollections from "@/hooks/useUserCollections";
import $ from "jquery";
import JSZip from "jszip";
import { NFTStorage, File } from "nft.storage";
import path from "path";
import { useSignatureMessage } from "@/hooks/useSignMessage";

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
  const [cid, setCid] = useState();
  const [convertedLink, setConvertedLink] = useState();
  const { msg } = useSignatureMessage();
  const userAddress = useAccount();
  const fileInputRef = useRef(); // At the start of your component
  const [extension, setExtension] = useState();
  const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage({
    message: msg,
  });
  const pTokenId = useRef();

  const [nftInfo, setNftInfo] = useState({
    name: "",
    description: "",
    collection: "",
    type: "",
    external: "Default URL",
    tokenId: "",
  });

  useEffect(() => {
    let gokhan = nftInfo.collection === "Select a collection" ? "" : nftInfo.collection;
    pTokenId.current = "collection_" + gokhan + nftInfo.tokenId;

    console.log(pTokenId.current);
  }, [nftInfo]);

  const handleSubmit = async (msg) => {
    signMessage({ message: msg });
  };

  // This function is makes a request to ipfs with nft.storage and returns the cid
  // This function is detected if its a zip file or image file
  const handleImageUpload = async (event) => {
    const file = fileInputRef.current.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const formData = new FormData();
      const fileType = file.type;
      const fileName = file.name;
      const fileExtension = fileName.split(".").pop().toLowerCase();

      if (fileType === "application/zip" || fileName.endsWith(".zip")) {
        console.log("its in zip condition");
        setExtension("/scene.gltf");
        const zip = new JSZip();
        const contents = await zip.loadAsync(reader.result);

        const filePromises = [];
        contents.forEach((relativePath, zipEntry) => {
          if (!zipEntry.dir) {
            const filePromise = zipEntry.async("blob").then((content) => ({
              path: relativePath,
              content,
            }));
            filePromises.push(filePromise);
          }
        });
        const files = await Promise.all(filePromises);
        files.forEach((file) => {
          formData.append("file", file.content, file.path); // This will include the path (folders) in the filename
        });
      } else if (
        fileType.startsWith("image/") ||
        fileType.startsWith("video/") ||
        ["gif", "jpg", "jpeg", "png", "mp4", "webm", "ogg"].includes(
          fileExtension
        )
      ) {
        console.log("its in image/video/gif condition");
        setExtension("/" + fileName);
        formData.append("file", file);
      } else {
        console.error("Unsupported file type: " + fileType);
        return;
      }

      // AJAX request to NFT.Storage
      $.ajax({
        url: process.env.NEXT_PUBLIC_NFT_STORAGE_API,
        type: "POST",
        headers: {
          Authorization:
            "Bearer " + process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY,
        },
        data: formData,
        processData: false,
        contentType: false,
        success: function (data, textStatus, jqXHR) {
          console.log("File uploaded successfully to NFT.Storage");
          console.log(data);
          setCid(data.value.cid);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log("ERRORS: " + textStatus);
        },
      });
    };
    reader.readAsArrayBuffer(file);
  };

  // this block will run when we recieve the signature
  useEffect(() => {
    data && handleImageUpload();
  }, [data]);

  // this block will run when we recieve the cid
  useEffect(() => {
    if (!cid) return;

    const payload = {
      isEstimate: "true",
      contractAddress: process.env.NEXT_PUBLIC_PROLL_CONTRACT,
      name: nftInfo.name,
      description: nftInfo.description,
      type: nftInfo.type,
      tokenId: pTokenId.current,
      image: "https://" + cid + ".ipfs.nftstorage.link" + extension,
      sender: userAddress.address,
      buyer: userAddress.address,
      attributes: fields.map((field) => ({
        trait_type: field.key,
        value: field.value,
      })),
      auth: {
        signedMessage: msg,
        signature: data,
      },
    };

    $.ajax({
      url: process.env.NEXT_PUBLIC_NFT_INSERT_REQ,
      type: "POST",
      data: JSON.stringify(payload),
      contentType: "application/json",
      success: function (response) {
        console.log(response);
      },
      error: function (error) {
        console.error("Error:", error);
      },
    });
  }, [cid, data]);

  return (
    <StyledMain>
      <Flex column>
        <NftWrapper>
          <img src={nft} alt="nft" />
        </NftWrapper>
        <Button onClick={() => handleSubmit(msg)} text={"Submit "}></Button>

        <div>
          {/* <button disabled={isLoading} onClick={() => signMessage()}>
            Sign message
          </button> */}
          {isSuccess && (
            <div style={{ flexWrap: "wrap" }}>Signature: {data}</div>
          )}
          {isError && <div>Error signing message</div>}
        </div>
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
          ref={fileInputRef}
          id="imageUpload"
          webkitdirectory
          multiple
        />

        {cid && (
          <div>
            <a
              target="_blank"
              href={"https://" + cid + ".ipfs.nftstorage.link"}
            >
              {" "}
              {cid + ".ipfs.nftstorage.link"}
            </a>
          </div>
        )}
      </Flex>
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

  const handleNameChange = (event) => {
    const newName = event.target.value;

    // remove special characters and whitespaces, keep duplicated numbers and letters
    const alphanumericName = newName.replace(/[^a-zA-Z0-9]/g, "");

    setNftInfo({
      ...nftInfo,
      name: newName,
      tokenId: alphanumericName,
    });
  };

  return (
    <>
      <FormWrapper>
        <Flex align="flex-start" column>
          <label>Name</label>
          <Input
            name="name"
            placeholder="Put a Description here"
            onChange={handleNameChange}
          />
        </Flex>
        <Flex align="flex-start" column>
          <label>Token Id</label>
          <Input
            name="name"
            value={nftInfo.tokenId}
            placeholder="Token Id"
            onChange={(event) =>
              setNftInfo({
                ...nftInfo,
                tokenId: event.target.value,
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
                type: event.target.value,
              })
            }
          />
        </Flex>

        <Flex align="flex-start" column>
          <label>External Link</label>
          <Input
            name="type"
            placeholder="external link"
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
                collection: event.target.value + "_",
              })
            }
          >
            <option>Select a Collection</option>
            {data
              ?.filter(
                (collection) => (collection.match(/_/g) || []).length === 1
              )
              .map((collection, key) => {
                const parts = collection.split("_"); // split at underscore
                const value = parts[1]; // get the second part
                return (
                  <option key={key} value={value}>
                    {value}
                  </option>
                );
              })}
          </select>
        </Flex>
        <Button text={"Add Properties"} onClick={handleAddField} />
      </FormWrapper>
    </>
  );
}
