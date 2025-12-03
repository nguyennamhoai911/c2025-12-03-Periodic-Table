import React, { useState } from "react";
import styled, { css } from "styled-components"; // Thêm css vào import
import ElementCard from "../../components/ElementCard";
import { CATEGORY_COLORS } from "../../../constants";
import { elements, categories, types } from "../../../data";

// ... (Các phần CONSTANTS và Styled Layout cũ GIỮ NGUYÊN) ...
const CELL_SIZE = "90px";
const GAP_SIZE = "6px";
const SIDEBAR_WIDTH = "60px";

const PageWrapper = styled.div`
  height: 100vh;
  width: 100%;
  gap: 0;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: sans-serif;
  overflow: hidden;
`;
// ... (ScrollContainer, Header, MainContent, GridSystem... GIỮ NGUYÊN) ...
const ScrollContainer = styled.div`
  flex: 1;
  width: 100%;
  overflow: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Header = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 50px;
  h1 {
    font-size: 32px;
    font-weight: 900;
    margin-bottom: 10px;
    text-transform: uppercase;
    text-align: center;
  }
  img {
    height: 90px;
    object-fit: contain;
  }
`;
const MainContent = styled.div`
  display: flex;
  position: relative;
  min-width: fit-content;
  padding-top: 20px;
  padding-bottom: 20px;
`;
const GridSystem = styled.div`
  display: grid;
  grid-template-columns: ${SIDEBAR_WIDTH} 1fr;
  gap: ${GAP_SIZE};
`;
const SidebarColumn = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
`;
const SidebarLabel = styled.div`
  position: absolute;
  top: -54px;
  right: 0;
  transform: translateX(50%);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  white-space: nowrap;
`;
const SidebarGrid = styled.div`
  display: grid;
  grid-template-rows: repeat(4, ${CELL_SIZE});
  gap: ${GAP_SIZE};
  position: relative;
`;
const ArrowLine = styled.div`
  position: absolute;
  top: -30px;
  bottom: -20px;
  right: 0;
  width: 2px;
  background-color: black;
`;
const ArrowHead = styled.div`
  position: absolute;
  top: -2px;
  left: -3px;
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 8px solid black;
`;
const NumberBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 12px;
  span {
    background-color: white;
    padding: 0 4px;
    font-size: 14px;
    font-weight: 700;
  }
`;
const TableColumn = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 40px;
`;
const TableGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, ${CELL_SIZE});
  grid-auto-rows: ${CELL_SIZE};
  gap: ${GAP_SIZE};
`;
const CellWrapper = styled.div<{ $colStart?: string | number }>`
  grid-column-start: ${(props) => props.$colStart || "auto"};
  width: ${CELL_SIZE};
  height: ${CELL_SIZE};
`;
const FooterSection = styled.div`
  min-width: fit-content;
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding-bottom: 40px;
  background-color: #ffffff;
`;
const TypesLegend = styled.div`
  display: flex;
  gap: 40px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  color: #9ca3af;
  letter-spacing: 1px;
`;

// --- [UPDATE 1] LegendItem: Thêm text-shadow khi active ---
const LegendItem = styled.div<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 200ms;

  opacity: ${(props) => (props.$isActive ? 1 : 0.6)};
  transform: ${(props) => (props.$isActive ? "scale(1.1)" : "none")};
  color: ${(props) => (props.$isActive ? "black" : "#9ca3af")};

  ${(props) =>
    props.$isActive &&
    css`
      /* Thêm shadow nhẹ cho chữ khi active */
      text-shadow: 0 0 1px black;
    `}

  &:hover {
    opacity: 1;
    color: black;
    transform: scale(1.1);
  }

  span:first-child {
    font-size: 14px;
    /* Kế thừa màu từ cha để active thì đen, không thì xám */
    color: inherit; 
  }
`;

const FilterItemWrapper = styled.div<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 200ms;
  opacity: ${(props) => (props.$isActive ? 1 : 0.7)};
  transform: ${(props) => (props.$isActive ? "scale(1.05)" : "none")};

  &:hover {
    opacity: 1;
    transform: scale(1.05);
  }
`;

// --- [UPDATE 2] FilterColorBox: Nhận màu vào props để tạo Shadow ---
const FilterColorBox = styled.div<{ $color: string; $isActive: boolean }>`
  width: 80px;
  height: 80px;
  background-color: white;
  flex-shrink: 0;
  
  /* Sử dụng màu truyền vào làm border */
  border: 3px solid ${(props) => props.$color};

  /* Logic Glow cho ô Footer giống ô trên bảng */
  ${(props) =>
    props.$isActive &&
    css`
      box-shadow: 0 0 15px ${props.$color};
      z-index: 10;
    `}
`;

const FilterLabel = styled.span`
  font-weight: 900;
  text-transform: uppercase;
  font-size: 16px;
  color: black;
`;

const PeriodicTable: React.FC = () => {
  const [hoveredFilter, setHoveredFilter] = useState<string | null>(null);
  const [lockedFilter, setLockedFilter] = useState<string | null>(null);

  const activeFilter = lockedFilter || hoveredFilter;

  const handleMouseEnter = (key: string) => setHoveredFilter(key);
  const handleMouseLeave = () => setHoveredFilter(null);

  const toggleLockFilter = (key: string) => {
    if (lockedFilter === key) {
      setLockedFilter(null);
    } else {
      setLockedFilter(key);
    }
  };

  const handleBackgroundClick = () => setLockedFilter(null);

  return (
    <PageWrapper onClick={handleBackgroundClick}>
      <ScrollContainer>
        <Header>
          <h1>Periodic Table of Happy Hormones</h1>
          <img src="/illustration/instruction.svg" alt="Instruction" />
        </Header>

        <MainContent>
          <GridSystem>
            <SidebarColumn>
              <SidebarGrid>
                <ArrowLine><ArrowHead /></ArrowLine>
                <SidebarLabel>Impact Level</SidebarLabel>
                <NumberBox><span>5</span></NumberBox>
                <NumberBox><span>4</span></NumberBox>
                <NumberBox><span>3</span></NumberBox>
                <NumberBox><span>2</span></NumberBox>
              </SidebarGrid>
            </SidebarColumn>

            <TableColumn>
              <TableGrid>
                {elements.map((el) => (
                  <CellWrapper key={el.id} $colStart={el.colStart}>
                    <ElementCard
                      data={el}
                      activeFilter={activeFilter}
                      onHover={handleMouseEnter}
                      onClick={toggleLockFilter}
                    />
                  </CellWrapper>
                ))}
              </TableGrid>
            </TableColumn>
          </GridSystem>
        </MainContent>

        <FooterSection>
          <TypesLegend onMouseLeave={handleMouseLeave}>
            {types.map((t) => (
              <LegendItem
                key={t.key}
                $isActive={activeFilter === t.key}
                onMouseEnter={() => handleMouseEnter(t.key)}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLockFilter(t.key);
                }}
              >
                <span>{t.key}</span>
                <span>{t.label}</span>
              </LegendItem>
            ))}
          </TypesLegend>

          <div
            style={{ display: "flex", gap: "40px" }}
            onMouseLeave={handleMouseLeave}
          >
            {categories.map((cat) => {
              // Lấy màu tương ứng
              const color = CATEGORY_COLORS[cat.key] || CATEGORY_COLORS.default;
              
              return (
                <FilterItemWrapper
                  key={cat.key}
                  $isActive={activeFilter === cat.key}
                  onMouseEnter={() => handleMouseEnter(cat.key)}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLockFilter(cat.key);
                  }}
                >
                  {/* Truyền color và isActive vào FilterColorBox */}
                  <FilterColorBox
                    $color={color}
                    $isActive={activeFilter === cat.key}
                  />
                  <FilterLabel>{cat.key}</FilterLabel>
                </FilterItemWrapper>
              );
            })}
          </div>
        </FooterSection>
      </ScrollContainer>
    </PageWrapper>
  );
};

export default PeriodicTable;