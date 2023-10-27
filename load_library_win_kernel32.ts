import { _load } from './_load_library_win_kernel32.ts';

function load() {

  const library = _load();

  const { 
    GetDiskFreeSpaceExW,
    // FormatMessage,
    GetLastError,
  } = library.symbols;

  return {
    GetDiskFreeSpaceExW,
    // FormatMessage,
    GetLastError,
    library,
  };
}

export {
  load,
}
