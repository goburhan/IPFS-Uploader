import Image from "next/image";
import React from "react";
import styled from "styled-components";

const Alert = styled.div`
  display: flex;
  background-color: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.warning};
  padding: 10px;
  gap: 10px;
  border: 1px solid ${({ theme }) => theme.warning};
  border-radius: 20px;
  font-size: 1rem;
  font-weight: 500;
`;

export default function Alerts() {

 //@TODO: SHOULD take in props to determine the type of alert to display
 //@TODO : create  useIconSize hooks to change icon size according to viewport

  return (
    <Alert>
      <Image
        src="/assets/svg/yellowwarn.svg"
        alt="alert"
        width={20}
        height={20}
      />

      <p>
        Insufficient balance to cover the cost of tx. Please add ETH to pay for
        tx fees or reduce the amount by approximately 12.000152 ETH
      </p>
    </Alert>
  );
}
