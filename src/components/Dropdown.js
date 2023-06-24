import useDropdown from "@/hooks/useDropdown";
import React, { useState } from "react";
import styled, { css, keyframes } from "styled-components";
import Image from "next/image";
import { Flex } from "@/styles/styled";

// The Dropdown component
function Dropdown() {
  const { ref, isOpen, setIsOpen } = useDropdown();

  // @TODO this component SHOULD recieve setItem and items as props

  return (
    <div ref={ref}>
      <DropdownButton onClick={() => setIsOpen(!isOpen)}>
        <Flex justify="space-between" gap="6px">
          Dropdown
          <DropArrow
            width={14}
            isOpen={isOpen}
            height={14}
            src="/assets/svg/dropdown.svg"
            alt="dropdown"
          />
        </Flex>
      </DropdownButton>
      <DropdownMenu isOpen={isOpen}>
        <DropdownItem href="#">Link 1</DropdownItem>
        <DropdownItem href="#">Link 2</DropdownItem>
        <DropdownItem href="#">Link 3</DropdownItem>
      </DropdownMenu>
    </div>
  );
}

export default Dropdown;
// Define the keyframes for the animation
const slideDown = keyframes`
  0% {
    transform: translateY(-20px) translateX(16%);
    opacity: 0;
  }
  100% {
    transform: translateY(0) translateX(16%);
    opacity: 1;
  }
`;

// Styles for the dropdown button
const DropdownButton = styled.button`
  display: inline-block;
  background: ${(props) => props.theme.primary};
  color: white;
  padding: 10px;
  border: none;
  border-radius: 23px;
`;

// Styles for the dropdown menu
const DropdownMenu = styled.div`
  display: ${(props) => (props.isOpen ? "block" : "none")};
  position: absolute;
  background: ${(props) => props.theme.primary};
  color: ${(props) => props.theme.primaryText};
  border: 1px solid #ccc;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  width: max-content;
  animation: ${(props) =>
    props.isOpen
      ? css`
          ${slideDown} 0.3s ease forwards
        `
      : "none"};
`;

// Styles for the dropdown item
const DropdownItem = styled.a`
  display: block;
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  &:hover {
    background-color: #f1f1f1;
  }
`;

const DropArrow = styled(Image)`
  ${(props) => props.isOpen && "transform: rotate(180deg);"}
  transition: transform 0.3s ease;
`;
