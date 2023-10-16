import { _load, CallSymbol } from './_load_library.ts';

function load() {

  const library = _load();

  const { 
    __errno_location,
    statvfs,
    free,
    malloc,
  } = library.symbols;

  return {
    __errno_location,
    statvfs,
    free,
    malloc,
    library,
  };
}

export {
  load,
}
