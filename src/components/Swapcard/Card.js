import React, { useState } from "react";
import styled from "styled-components";
import Swapcontainer from "./Swapcontainer";
import Image from "next/image";
import { Divider, Flex } from "@/styles/styled";
import Slide from "../Slider";
import Tooltip from "../Tooltip";
import Button from "../Buttons";

const StyledCard = styled.div`
  display: flex;
  flex-direction: column;
  background: ${(props) => props.theme.swapcard};
  border-radius: 20px;
  color: #fff;
  padding: 1rem;
  width: 462px;
  height: 805px;
  gap: 6px;
  img {
    place-self: center;
  }
`;


export default function Card() {
  const [swapObject, setSwapObject] = useState({
    coin: "ETH",
    amount: "0.0",
    chain: "Ethereum",
    percentage: "50%",
  });

  return (
    <StyledCard>
      <Swapcontainer
        setSwapObject={setSwapObject}
        swapObject={swapObject}
        fromTo={"From"}
      />
      <Image
        src="/assets/svg/arrow.svg"
        width={20}
        height={24}
        alt="arrow"
        style={{ placeSelf: "center" }}
      />
      <Swapcontainer
        setSwapObject={setSwapObject}
        swapObject={swapObject}
        fromTo={"to"}
      />
      <Divider />
      <InfoContainer />
      <Slide />
      <EstimateContainer />
      <Divider />
      <Button disabled={false} text={"Buy"} />
    </StyledCard>
  );
}

function InfoContainer() {
  return (
    <Flex width="100%" gap="6px" column>
      <Flex width="100%" justify="space-between" align="flex-start">
        <span style={{ display: "flex", alignItems: "center" }}>
          Price Impact
          <Tooltip />
        </span>
        <p>0.0%</p>
      </Flex>

      <Flex width="100%" justify="space-between">
        <span>Price Impact</span>
        <p>0.0%</p>
      </Flex>
    </Flex>
  );
}
function EstimateContainer() {
  return (
    <Flex width="100%" gap="6px" column>
      <Flex width="100%" justify="space-between" align="flex-start">
        <span style={{ display: "flex", alignItems: "center" }}>
          Fees
          <Tooltip />
        </span>
        <p>0.0060032 WETH</p>
      </Flex>

      <Flex width="100%" justify="space-between">
        <span>Estimated Received</span>
        <p>11.5660032 WETH</p>
      </Flex>
    </Flex>
  );
}
