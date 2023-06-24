import styled from "styled-components";

export const Flex = styled.div`
  display: flex;
  flex-direction: ${(props) => props.column && "column"};
  justify-content: ${(props) => props.justify || "center"};
  width: ${(props) => props.width};
  gap: ${(props) => props.gap || "0"};
  align-items: ${(props) => props.align || "center"};
`;
export const Input = styled.input`
  background: ${(props) =>
    props.transparent === true ? "transparent" : props.theme.heavy};
  border: none;
  border-radius: 16px;
  font-size: 1.5rem;
  color: ${(props) => props.theme.input};
  width: 100%;
  text-align: ${(props) => props.align || "flex-start"};
  padding: 0.5rem 1rem;
`;
export const Divider = styled.div`
  width: 100%;
  border-top: 1px dashed #666077;
  margin: 1rem 0;
`;
