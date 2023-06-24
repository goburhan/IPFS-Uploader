import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Flex, Input } from "@/styles/styled";
import styled from "styled-components";
import Image from "next/image";
import { MockTokens } from "@/mock";
import { useAddressSlice } from "@/hooks/useAddressSlice";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const DropdownButton = styled.button`
  display: inline-block;
  background: ${(props) => props.theme.primary};
  color: white;
  padding: 10px;
  border: none;
  border-radius: 23px;
`;

const ModalWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background: ${(props) => props.theme.background};
  color: #fff;
  width: 454px;
  height: 604px;
  border-radius: 45px;

  p {
    font-size: 1rem;
    font-weight: 500;
    margin: 0.5rem 0;
    color: ${(props) => props.theme.gray};
  }
`;

export default function SelectTokenModal() {
  const [isopen, setIsOpen] = React.useState(false);
  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <div>
      <DropdownButton onClick={handleOpen}>
        <Flex justify="space-between" gap="6px">
          Dropdown
          <Image
            width={14}
            isOpen={isopen}
            height={14}
            src="/assets/svg/dropdown.svg"
            alt="dropdown"
          />
        </Flex>
      </DropdownButton>
      <Modal
        open={isopen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ModalWrapper sx={style}>
          <h2>Select Token</h2>
          <InputWrapper transparent={false} />
          <PopularTokens />
          <TokenList MockTokens={MockTokens} />
        </ModalWrapper>
      </Modal>
    </div>
  );
}

const StyledInput = styled(Flex)`
  background: ${(props) => props.theme.heavy};
  border: none;
  border-radius: 16px;
  justify-content: space-between;
  padding-right: 1rem;
  margin: 1.2rem 0;
  input {
    font-size: 1rem;
    font-weight: 500;
  }
`;
function InputWrapper() {
  return (
    <StyledInput>
      <Input placeholder="Search name or mint address" />

      <Image
        width={20}
        height={20}
        src="/assets/svg/search.svg"
        alt="dropdown"
      />
    </StyledInput>
  );
}

const ButtonWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 70px));
  grid-gap: 4px;
  padding-bottom: 1.4rem;
  border-bottom: 1px solid ${(props) => props.theme.gray};
`;

const PerButton = styled.button`
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  background: ${(props) => props.theme.minibutton};
  border-radius: 20px;
  font-size: 1rem;
  color: ${(props) => props.theme.primaryText};
  letter-spacing: 0.04em;
  border: none;
  font-weight: 700;
  padding: 0.5rem 0rem;
`;

function PopularTokens() {
  const [selectedFav, setSelectedFav] = useState(null);
  /*TODO: token object will have 4 properties: name, symbol, logo , address */

  return (
    <>
      <p>Popular tokens</p>
      <ButtonWrapper>
        {MockTokens.slice(0, 6).map((favorite, key) => (
          <PerButton
            key={key}
            selected={selectedFav === favorite.name}
            onClick={() => setSelectedFav(favorite.name)}
          >
            {favorite.symbol}
          </PerButton>
        ))}
      </ButtonWrapper>
      <Flex justify="space-between">
        <p>Tokens</p>
        <p>Balance / Address</p>
      </Flex>
    </>
  );
}

function formatString(str) {
  if (str.length > 8) {
    return `${str.slice(0, 4)}...${str.slice(-4)}`;
  } else {
    return str;
  }
}

const TokenSelect = styled(Flex)`
  width: 100%;
  a:hover {
    background: ${(props) => props.theme.heavy};
    border-radius: 16px;
    cursor: pointer;
    padding: 6px 6px 2px 6px;
    transition: all 0.2s ease-in-out;
  }
`;

function TokenList({ MockTokens }) {
  return (
    <Flex gap="10px" justify="space-between" column>
      {MockTokens.slice(0, 6).map((token, key) => {
        const slicedAddress = formatString(token.address);
        return (
          <TokenSelect key={key}>
            <a
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Flex justify="space-between" width="100%">
                <TokenWrapper gap="6px">
                  <Image
                    width={32}
                    height={32}
                    src={`/assets/token/${token.symbol?.toLocaleLowerCase(
                      "tr"
                    )}.svg`}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/mock/defaulttoken.svg";
                    }}
                    alt="dropdown"
                  />
                  <Flex align="flex-start" gap="2px" column>
                    <div variant="body1">{token.name}</div>
                    <div variant="body2">{token.symbol}</div>
                  </Flex>
                </TokenWrapper>
                <div variant="body1">{slicedAddress}</div>
              </Flex>
            </a>
          </TokenSelect>
        );
      })}
    </Flex>
  );
}

const TokenWrapper = styled(Flex)`
  img {
    place-self: flex-start;
  }
  & div div:first-child {
    color: ${(props) => props.theme.primaryText};
  }
  color: ${(props) => props.theme.gray};
`;
