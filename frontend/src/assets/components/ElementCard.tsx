import React from "react";
import styled, { css } from "styled-components";
import type { HappyElement } from "../../types";
import { CATEGORY_COLORS } from "../../constants";

interface ElementCardProps {
  data: HappyElement;
  activeFilter: string | null;
  onHover: (key: string) => void;
  onClick: (key: string) => void; // Prop xử lý click
  isDemo?: boolean;
}

const CARD_SIZE = "90px";
const ICON_SIZE = "40px";

// --- STYLED COMPONENTS ---

const CardContainer = styled.div<{
  $borderColor: string;
  $isDimmed: boolean;
  $isDemo: boolean;
  $isHighlight: boolean; // Prop bật hiệu ứng Glow
}>`
  position: relative;
  width: ${CARD_SIZE};
  height: ${CARD_SIZE};
  flex-shrink: 0;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 4px;
  transition: all 300ms ease-in-out;
  cursor: ${(props) => (props.$isDemo ? "default" : "pointer")};

  border: 3px solid ${(props) => props.$borderColor};
  box-sizing: border-box;

  /* State: Dimmed (Mờ đi) */
  ${(props) =>
    props.$isDimmed &&
    css`
      opacity: 0.3;
      transform: scale(0.95);
      filter: grayscale(100%);
    `}

  /* State: Normal (Hiển thị rõ) */
  ${(props) =>
    !props.$isDimmed &&
    css`
      opacity: 1;
      transform: scale(1);
    `}

  /* State: Highlight (Active + Glow Effect) */
  ${(props) =>
    props.$isHighlight &&
    css`
      /* Fix lỗi TS: Dùng trực tiếp props.$borderColor */
      box-shadow: 0 0 15px ${props.$borderColor};
      z-index: 20; 
    `}

  /* Hover Effect */
  &:hover {
    ${(props) =>
      !props.$isDemo &&
      css`
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15);
        z-index: 50;
        transform: scale(1.1);
      `}
  }
`;

const NameText = styled.div`
  font-weight: 700;
  text-transform: uppercase;
  width: 100%;
  text-align: left;
  z-index: 10;
  white-space: normal;
  word-break: break-word;
  line-height: 1.1;
  font-size: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const IconWrapper = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: none;

  img {
    width: ${ICON_SIZE};
    height: ${ICON_SIZE};
    object-fit: contain;
    opacity: 0.8;
  }
`;

const FooterInfo = styled.div`
  position: absolute;
  bottom: 4px;
  left: 6px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  z-index: 10;
`;

const LevelText = styled.span`
  font-weight: 700;
  line-height: 1;
  margin-bottom: 1px;
  font-size: 14px;
`;

const TypeText = styled.span`
  font-weight: 700;
  line-height: 1;
  font-size: 9px;
`;

const ElementCard: React.FC<ElementCardProps> = ({
  data,
  activeFilter,
  onHover,
  onClick,
  isDemo = false,
}) => {
  const isDefault = activeFilter === null;
  const isMatch =
    activeFilter === data.category ||
    (data.type && data.type.includes(activeFilter || ""));

    const isDimmed = !isDemo && !(isDefault || isMatch);
  
  // Logic Glow: Không phải demo, không phải default và đang match filter
  const isHighlight = Boolean(!isDemo && !isDefault && isMatch);

  const iconName = data.icon.replace(".png", ".svg");
  const borderColor = CATEGORY_COLORS[data.category] || CATEGORY_COLORS.default;

  return (
    <CardContainer
      $borderColor={borderColor}
      $isDimmed={isDimmed}
      $isDemo={isDemo}
      $isHighlight={isHighlight}
      onMouseEnter={() => !isDemo && onHover(data.category)}
      onClick={(e) => {
        if (!isDemo) {
          e.stopPropagation(); // Chặn click lan ra background
          onClick(data.category);
        }
      }}
    >
      <NameText>{data.name}</NameText>
      <IconWrapper>
        <img
          src={`/icons/${iconName}`}
          alt={data.name}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </IconWrapper>
      <FooterInfo>
        <LevelText>{data.level}</LevelText>
        <TypeText>{data.type}</TypeText>
      </FooterInfo>
    </CardContainer>
  );
};

export default ElementCard;