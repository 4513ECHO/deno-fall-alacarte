import { defineRenderer, type Renderer } from "@vim-fall/std/renderer";

type Detail = {
  path: string;
};

export type TildePathOptions = {
  home?: string;
};

/**
 * Creates a Renderer that replace home directory of file path in the label to tilde.
 *
 * @returns A Renderer that replace home directory of file path in the label to tilde.
 */
export function tildePath(options: TildePathOptions = {}): Renderer<Detail> {
  return defineRenderer((_, { items }, { signal }) => {
    const home = options.home ?? Deno.env.get("HOME")!;
    const pattern = new RegExp(`^${home}`);
    signal?.throwIfAborted();
    for (const item of items) {
      const path = item.detail.path.replace(pattern, "~");
      item.label = item.label.replace(item.detail.path, path);
      if (!item.label.startsWith("~")) {
        continue;
      }
      item.decorations = item.decorations
        .map((deco) => ({
          ...deco,
          // ______     home.length
          // 1234567890 item.label
          //    ^       deco.column
          //    |-----| deco.length
          // Shift deco.column to the left by home.length
          // Unless deco.length is protruded after the shift, deco will disappear
          column: Math.max(deco.column - home.length + 1, 1),
          length: deco.column < home.length
            ? deco.column + deco.length - home.length
            : deco.length,
        }))
        .filter(({ length }) => length > 0);
    }
  });
}
