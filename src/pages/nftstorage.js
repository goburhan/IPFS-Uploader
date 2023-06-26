import Button from "@/components/Buttons";
import { Flex, Input } from "@/styles/styled";
import React, { useState, useEffect } from "react";
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
  const msg = useSignatureMessage();
  const userAddress = useAccount();

  const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage({
    message: msg,
  });

  const [nftInfo, setNftInfo] = useState({
    name: "",
    description: "",
    collection: "",
    type: "",
    external: "Default URL",
  });

  useEffect(() => {
    if (!convertedLink) return;

    const payload = {
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
      auth: {
        signedMessage: data,
        signature: "",
      },
    };

    $.ajax({
      url: process.env.NEXT_PUBLIC_NFT_INSERT_REQ2,
      type: "POST",
      data: JSON.stringify(data),
      contentType: "application/json",
      success: function (response) {
        console.log(response);
      },
      error: function (error) {
        console.error("Error:", error);
      },
    });
  }, [cid]);

  // const submitFunc = async () => {
  //   const data = {
  //     contractAddress: process.env.NEXT_PUBLIC_PROLL_CONTRACT,
  //     name: nftInfo.name,
  //     description: nftInfo.description,
  //     type: nftInfo.type,
  //     tokenId: 10,
  //     image: convertedLink,
  //     attributes: fields.map((field) => ({
  //       trait_type: field.key,
  //       value: field.value,
  //     })),
  //     auth: {
  //       signature: "",
  //       address: "",
  //     },
  //   };

  //   $.ajax({
  //     url: process.env.NEXT_PUBLIC_NFT_INSERT_REQ,
  //     type: "POST",
  //     data: JSON.stringify(data),
  //     contentType: "application/json",
  //     success: function (response) {
  //       console.log(response);
  //     },
  //     error: function (error) {
  //       console.error("Error:", error);
  //     },
  //   });
  // };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      // Prepare FormData for AJAX request
      const formData = new FormData();
      if (file.type === "application/zip" || file.name.endsWith(".zip")) {
        console.log("its in zip condition");
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
          const filename = file.path.split("/").pop(); // Gets the filename from the path
          formData.append("file", file.content, filename);
        });
      } else if (file.type.startsWith("image/")) {
        // If it's an image file, add it to the FormData directly
        formData.append("file", new Blob([reader.result]), file.name);
        console.log("its in image condition");
      }
      // AJAX request to NFT.Storage
      $.ajax({
        url: process.env.NEXT_PUBLIC_NFT_STORAGE_API,
        type: "POST",
        headers: {
          Authorization:
            "Bearer " + process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY, // Replace with your NFT.Storage API key
        },
        data: formData,
        processData: false,
        contentType: false,
        success: function (data, textStatus, jqXHR) {
          console.log("File uploaded successfully to NFT.Storage");
          console.log(data); // This will contain the IPFS CID of your uploaded data
          setCid(data.value.cid);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log("ERRORS: " + textStatus);
          // handle errors here
        },
      });
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <StyledMain>
      <Flex column>
        <NftWrapper>
          <img src={nft} alt="nft" />
        </NftWrapper>
        <Button text={"Submit "}></Button>

        <div>
          <button disabled={isLoading} onClick={() => signMessage()}>
            Sign message
          </button>
          {isSuccess && <div>Signature: {data}</div>}
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
          id="imageUpload"
          onChange={handleImageUpload}
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
