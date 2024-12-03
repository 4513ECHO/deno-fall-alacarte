import { getcompletion } from "@denops/std/function";
import { defineSource, type Source } from "@vim-fall/std/source";

type Detail = {
  colorscheme: string;
};

export function colorscheme(): Source<Detail> {
  return defineSource(async function* (denops) {
    let id = 0;
    for (const name of await getcompletion(denops, "", "color") as string[]) {
      yield {
        id: id++,
        value: name,
        detail: { colorscheme: name },
      };
    }
  });
}
