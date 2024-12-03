import { type Action, defineAction } from "@vim-fall/std/action";

type Detail = {
  colorscheme: string;
};

export function colorscheme(): Action<Detail> {
  return defineAction(async (denops, { item, selectedItems }, { signal }) => {
    const colorscheme = selectedItems?.at(-1) ?? item;
    signal?.throwIfAborted();
    if (colorscheme) {
      await denops.cmd(`colorscheme ${colorscheme.detail.colorscheme}`);
    }
  });
}

export const defaultColorschemeAction: {
  colorscheme: Action<Detail>;
} = {
  colorscheme: colorscheme(),
};
