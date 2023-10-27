import { _load } from './_load_library_unix_like.ts';

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
