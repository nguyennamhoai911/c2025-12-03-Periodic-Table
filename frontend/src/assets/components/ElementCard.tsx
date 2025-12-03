// src/assets/components/ElementCard.tsx

import React from "react";
import styled, { css, keyframes } from "styled-components";
import type { HappyElement } from "../../types";
import { CATEGORY_COLORS } from "../../constants";

// Interface Props: Chấp nhận activeFilter và event là string hoặc number
interface ElementCardProps {
  data: HappyElement;
  activeFilter: string | number | null; 
  onHover: (key: string | number) => void;
  onClick: (key: string | number) => void;
  isDemo?: boolean;
}

const CARD_SIZE = "90px";
const ICON_SIZE = "40px";

// Animation cho Popup hiện ra mượt mà
const popIn = keyframes`
  from { opacity: 0; transform: translate(10px, -50%) scale(0.9); }
  to { opacity: 1; transform: translate(0, -50%) scale(1); }
`;

// --- STYLED COMPONENTS ---

// Popup hiển thị Recommendation & Main Effect
const InfoPopup = styled.div`
  position: absolute;
  left: 105%; /* Hiện bên phải ô */
  top: 50%;
  transform: translateY(-50%);
  width: 220px;
  background-color: white;
  border: 1px solid #bfbfbf;
  border-radius: 12px;
  padding: 12px;
  z-index: 100;
  box-shadow: 4px 4px 0px rgba(255, 255, 255, 0.2);
  text-align: left;
  animation: ${popIn} 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  pointer-events: none; /* Tránh chuột tương tác làm mất hover cha */

  /* Mũi tên tam giác trỏ vào ô */
  /* &::before {
    content: "";
    position: absolute;
    left: -8px;
    top: 50%;
    transform: translateY(-50%);
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-right: 8px solid #ffffff;
  } */
`;

const InfoTitle = styled.div`
  font-size: 11px;
  margin-bottom: 4px;
  line-height: 1.4;
  color: #333;
  
  strong {
    font-weight: 800;
    color: black;
    display: block; 
  }
`;

const CardContainer = styled.div<{
  $borderColor: string;
  $isDimmed: boolean;
  $isDemo: boolean;
  $isHighlight: boolean;
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

  /* State: Dimmed (Mờ đi khi không được chọn) */
  ${(props) =>
    props.$isDimmed &&
    css`
      opacity: 0.3;
      transform: scale(0.95);
      filter: grayscale(100%);
    `}

  /* State: Normal */
  ${(props) =>
    !props.$isDimmed &&
    css`
      opacity: 1;
      transform: scale(1);
    `}

  /* State: Highlight (Active + Glow) */
  ${(props) =>
    props.$isHighlight &&
    css`
      box-shadow: 0 0 15px ${props.$borderColor};
      z-index: 50; /* Đè lên các ô khác */
    `}

  /* Hover Effect */
  &:hover {
    ${(props) =>
      !props.$isDemo &&
      css`
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15);
        z-index: 60;
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
  font-size: 9px;
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

// --- MAIN COMPONENT ---

const ElementCard: React.FC<ElementCardProps> = ({
  data,
  activeFilter,
  onHover,
  onClick,
  isDemo = false,
}) => {
  const isDefault = activeFilter === null;

  // [LOGIC FIXED] --- Quan trọng nhất ---
  // Tách biệt logic so sánh: Number so với Number, String so với String.
  // Điều này ngăn chặn việc chọn Level "2" (string) làm sáng ID 2 (number).
  const isMatch =
    (typeof activeFilter === "number" && activeFilter === data.id) || // Chỉ active ID nếu filter là số
    (typeof activeFilter === "string" && ( // Chỉ active nhóm nếu filter là chuỗi
      activeFilter === data.category || 
      (data.type && data.type.includes(activeFilter)) || 
      data.level.toString() === activeFilter
    ));

  const isDimmed = !isDemo && !(isDefault || isMatch);
  
  // Chuyển thành Boolean để tránh warning của styled-components
  const isHighlight = Boolean(!isDemo && !isDefault && isMatch);

  // [POPUP LOGIC]: Chỉ hiện Popup khi click vào đúng ID ô đó (chế độ lock)
  const showPopup = !isDemo && 
                    (activeFilter === data.id) && // activeFilter phải bằng đúng ID
                    (data.recommendation || data.mainEffect);

  const iconName = data.icon.replace(".png", ".svg");
  const borderColor = CATEGORY_COLORS[data.category] || CATEGORY_COLORS.default;

  return (
    <CardContainer
      $borderColor={borderColor}
      $isDimmed={isDimmed}
      $isDemo={isDemo}
      $isHighlight={isHighlight}
      // Pass ID (number) vào hàm handler
      onMouseEnter={() => !isDemo && onHover(data.id)}
      onClick={(e) => {
        if (!isDemo) {
          e.stopPropagation();
          onClick(data.id);
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

      {/* RENDER POPUP */}
      {showPopup && (
        <InfoPopup>
          {data.recommendation && (
            <InfoTitle>
              <strong>Recommendation :</strong> {data.recommendation}
            </InfoTitle>
          )}
          {data.mainEffect && (
            <InfoTitle>
              <strong>Main Effect :</strong> {data.mainEffect}
            </InfoTitle>
          )}
        </InfoPopup>
      )}

    </CardContainer>
  );
};

export default ElementCard;