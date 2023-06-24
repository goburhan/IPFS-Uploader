import React, { useState } from "react";
import { Flex, Input } from "@/styles/styled";
import styled from "styled-components";
import Dropdown from "../Dropdown";
import SelectTokenModal from "./SelectTokenModal";

export default function Swapcontainer({ setSwapObject, swapObject, fromTo }) {
  return (
    <StyledSwapcontainer>
      <Flex justify="space-between">
        <div>{fromTo}</div>
        <SelectTokenModal />
      </Flex>

      <Flex justify="space-between" gap="20px">
        <Dropdown />
        <PriceContainer />
      </Flex>
      <Flex justify="space-between">
        <PercentageTabs setSwapObject={setSwapObject} swapObject={swapObject} />
        <div>balance:</div>
      </Flex>
    </StyledSwapcontainer>
  );
}

function PriceContainer() {
  return (
    <Flex justify="space-between" gap="10px">
      <Input type="number" placeholder="0" align="right" transparent />
      <div>Token</div>
    </Flex>
  );
}

const Percentages = ["100%", "50%", "25%", "5%"];
function PercentageTabs({ setSwapObject, swapObject }) {
  const [selectedPercentage, setSelectedPercentage] = useState(null);

  return (
    <Flex justify="space-between" gap="6px">
      {Percentages.map((percentage, key) => (
        <PerButton
          key={key}
          selected={selectedPercentage === percentage}
          onClick={() =>
            setSelectedPercentage(percentage) &&
            setSwapObject({
              ...swapObject,
              percentage: percentage,
            })
          }
        >
          {percentage}
        </PerButton>
      ))}
    </Flex>
  );
}

const PerButton = styled.button`
  background: ${(props) =>
    props.selected ? props.theme.pink : props.theme.swapcard};
  border-radius: 20px;
  color: ${(props) =>
    props.selected ? props.theme.primaryText : props.theme.gray};
  border: none;
  font-weight: 700;
  padding: 0.5rem 1rem;
`;

const StyledSwapcontainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.theme.heavy};
  width: 100%;
  font-size: 1rem;
  height: max-content;
  color: #fff;
  border-radius: 20px;
  border: 1px solid ${(props) => props.theme.swapborder};
  padding: 1rem 1.8rem;
  gap: 10px;
`;
