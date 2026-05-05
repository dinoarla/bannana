"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { PublicBlock } from "@/types";

type EditorState = {
  selectedBlockId?: string;
  blocks: PublicBlock[];
  setBlocks: (blocks: PublicBlock[]) => void;
  selectBlock: (id?: string) => void;
  upsertBlock: (block: PublicBlock) => void;
};

export const useEditorStore = create<EditorState>()(
  immer((set) => ({
    blocks: [],
    setBlocks: (blocks) => set((state) => { state.blocks = blocks; }),
    selectBlock: (id) => set((state) => { state.selectedBlockId = id; }),
    upsertBlock: (block) => set((state) => {
      const index = state.blocks.findIndex((item) => item.id === block.id);
      if (index >= 0) state.blocks[index] = block;
      else state.blocks.push(block);
    })
  }))
);
