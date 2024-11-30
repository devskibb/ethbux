import React, { useState } from 'react';
import styled from 'styled-components';

const TooltipWrapper = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
  margin-left: 4px;
`;

const QuestionMark = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 12px;
  border: 1px solid #000;
  border-radius: 50%;
  font-size: 8px;
  cursor: help;
  background: #ffffe1;
`;

const TooltipContent = styled.div`
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  background: #ffffe1;
  border: 1px solid #000;
  padding: 8px;
  width: 200px;
  font-size: 11px;
  z-index: 1000;
  box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.1);
  word-break: keep-all;
  overflow-wrap: break-word;
  hyphens: none;
  white-space: pre-wrap;
`;

export function Tooltip({ text }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <TooltipWrapper
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <QuestionMark>?</QuestionMark>
      {showTooltip && <TooltipContent>{text}</TooltipContent>}
    </TooltipWrapper>
  );
} 