// src/types.ts

// Define các Category key cứng để tránh typo
export type CategoryKey = 'dopamine' | 'oxytocin' | 'serotonin' | 'endorphins';

// Define structure cho một Element (ô vuông)
export interface HappyElement {
  id: number;
  name: string;
  // Type có thể là union type hoặc string tùy độ strict bạn muốn
  type: string; 
  level: number; // 1 -> 5
  category: CategoryKey;
  icon: string; // Tên file hoặc đường dẫn
}

export interface CategoryDef {
  key: CategoryKey;
  label: string;
  colorClass: string; // Class tailwind cho border/text
}

export interface TypeDef {
  key: string;
  label: string;
}
export interface HappyElement {
  id: number;
  name: string;
  type: string;
  level: number;
  category: CategoryKey;
  icon: string;
  // Layout positioning
  colStart?: number; // Cột bắt đầu (1-12)
  row?: number;      // Hàng (để sort cho dễ)
  recommendation?: string;
  mainEffect?: string;
}
