/// <reference lib="deno.unstable" />

const CallSymbol = {
  "free": {
    name: "free",
    parameters: ["pointer"],
    result: "void"
  },
  "malloc": {
    name: "malloc",
    // usizeだけど、denoは64bitのみなのでキメ打ち。
    parameters: ["u64"],
    result: "pointer"
  },
  "puts": {
    name: "puts",
    parameters: ["buffer"],
    result: "i32",
  }
     
} as const

function _load() {

  let cpu =  "" 
  if (Deno.build.arch == 'aarch64') {
      cpu = 'aarch64'
  } else if (Deno.build.arch == 'x86_64') {
      cpu = 'x86_64'
  } else {
    throw TypeError("Not supported cpu");
  }

  let libname = "";

  if (Deno.build.os === 'linux') {
    libname = `/lib/${cpu}-linux-gnu/libc.so.6`;
  // darwin not supported yet deno.
  // } else if (Deno.build.os === 'darwin') {
    // libname = `/lib/${cpu}-linux-gnu/libc.so.6`;
  } else if (Deno.build.os === 'windows') {
    // libname = "C:/Users/katsutoshi/src/miyuu_ssh_core_windows/miyuu_ssh_core_windows/bin/Release/net7.0/win-x64/publish/miyuu_ssh_core_windows.dll"
    // windowsの場合は右のようになるので、最初の一文字とバス。/C:/Users/msvcrt.dll
    libname = `C:/Windows/System32/msvcrt.dll`;
    // libname = (new URL(`../dotnet_sample/bin/Release/net7.0/win-${cpu}/publish/dotnet_sample.dll`, import.meta.url)).pathname.substring(1);
  } else {
    throw TypeError("Not supported os");
  }

  const library = Deno.dlopen(libname, CallSymbol);

  return library;
}

export {
  type CallSymbol,
  _load
}
