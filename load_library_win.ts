import { _load } from './_load_library_win.ts';

function load() {

  const library = _load();

  const { 
    // GetDiskFreeSpaceExW,
    puts,
    free,
    malloc,
  } = library.symbols;

  return {
    // GetDiskFreeSpaceExW,
    puts,
    free,
    malloc,
    library,
  };
}

export {
  load,
}
