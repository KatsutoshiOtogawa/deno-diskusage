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
  // https://manpages.debian.org/testing/manpages-ja-dev/statvfs.2.ja.html
  // エラーコード一覧
  // https://debimate.jp/2019/02/24/linux-kernel-%E3%82%A8%E3%83%A9%E3%83%BC%E7%95%AA%E5%8F%B7%E3%81%AE%E4%B8%80%E8%A6%A7/
  "statvfs": {
    name: "statvfs",
    parameters: [
      // 情報が知りたいファイルへのパスを渡す。
      "buffer",
      // struct statvfsのポインタを渡す。
      "pointer"
    ],
    result: "i8"
  },
  "__errno_location": {
    // errno変数へのアドレスが入ったポインタ。
    name: "__errno_location",
    parameters: [
    ],
    // raise OSError(e)
    // int pointer
    result: "pointer"
  },
     
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
