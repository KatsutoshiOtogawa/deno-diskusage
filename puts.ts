import { load as runtime_load } from "./load_library_win.ts";

function puts() {
    const { malloc, free, library: runtime_library} = runtime_load();
}

