import { _load } from './_load_library.ts';

function load() {

  const library = _load();

  const { 
    free,
    malloc,
    statvfs,
    __errno_location,
  } = library.symbols;

  return {
    free,
    malloc,
    statvfs,
    __errno_location,
    library,
  };
}

export {
  load,
}
