import styled from "styled-components";


const ToolTip = ({ children, toolTipText }) => (
  <ToolTipBox>
    {children}
    <ToolTipText>{toolTipText}</ToolTipText>
  </ToolTipBox>
);

export default ToolTip;

const ToolTipText = styled.span`
  visibility: hidden;
  background-color: rgba(0, 0, 0, 0.8);
  color: #fff;
  text-align: center;
  border-radius: 4px;
  padding: 8px 8px;
  position: absolute;
  z-index: 100;
  bottom: 150%;
  margin-right: 100px;
  white-space: pre;
  :after {
    content: "";
    position: absolute;
    top: 100%;

  }
`;

const ToolTipBox = styled.div`
  position: relative;
  display: inline-block;
  :hover span {
    visibility: visible;
  }
`;
