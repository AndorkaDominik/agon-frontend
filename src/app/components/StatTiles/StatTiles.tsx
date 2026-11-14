"use client";

import type { CSSProperties, ReactNode } from "react";
import { Box, Flex, Heading, Text } from "@radix-ui/themes";

type StatItem = { label: string; value: ReactNode };

type StatTilesProps = {
  items: StatItem[];
  gap?: string | number;
  wrap?: boolean;
  style?: CSSProperties;
  itemStyle?: CSSProperties;
};

export default function StatTiles({ items, gap = '0.85rem', wrap = true, style, itemStyle }: StatTilesProps) {
  return (
    <Flex
      style={{ display: 'flex', gap, flexWrap: wrap ? 'wrap' : 'nowrap', alignItems: 'stretch', ...style }}
    >
      {items.map((item) => (
        <Box
          key={item.label}
          style={{
            width: 'fit-content',
            minWidth: 180,
            flex: '0 0 auto',
            border: '1px solid var(--accent-6)',
            background: 'var(--accent-surface)',
            padding: '0.72rem 0.85rem',
            ...itemStyle,
          }}
        >
          <Heading size="8">{item.value}</Heading>
          <Text size="4" color="gray">
            {item.label}
          </Text>
        </Box>
      ))}
    </Flex>
  );
}
