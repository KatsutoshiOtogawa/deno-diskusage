/// <reference lib="deno.unstable" />

const CallSymbol = {
  // https://learn.microsoft.com/ja-jp/windows/win32/api/winbase/nf-winbase-formatmessage

  "FormatMessageA": {
    // errno変数へのアドレスが入ったポインタ。
    name: "FormatMessageA",
    parameters: [
  //   [in]           DWORD   dwFlags,
      "u32",
      // optionalはnullpointer
      // [in, optional] LPCVOID lpSource,
      "pointer",
  // [in]           DWORD   dwMessageId,
      "u32",
  // [in]           DWORD   dwLanguageId,
      "u32",
  // [out]          LPTSTR  lpBuffer,
      "pointer",
  // [in]           DWORD   nSize,
      "pointer",
  // [in, optional] va_list *Arguments
      "pointer",
    ],
    // DWORDはu32
    result: "u32"
  },
  "GetDiskFreeSpaceExA": {
    name: "GetDiskFreeSpaceExA",
    parameters: [
      "buffer",
      "pointer",
      "pointer",
      "pointer",
    ],
    // 関数が失敗すると０、成功すると0以外の値。
    result: "i8"

  },
  // https://learn.microsoft.com/ja-jp/windows/win32/api/fileapi/nf-fileapi-getdiskfreespaceexw
  //  [in, optional]  LPCWSTR         lpDirectoryName,
  // [out, optional] PULARGE_INTEGER lpFreeBytesAvailableToCaller,
  // [out, optional] PULARGE_INTEGER lpTotalNumberOfBytes,
  // [out, optional] PULARGE_INTEGER lpTotalNumberOfFreeBytes
  "GetDiskFreeSpaceExW": {
    name: "GetDiskFreeSpaceExW",
    parameters: [
      "buffer",
      "pointer",
      "pointer",
      "pointer",
    ],
    // 関数が失敗すると０、成功すると0以外の値。
    result: "i8"

  },

  "MultiByteToWideChar": {
    name: "MultiByteToWideChar",
    parameters: [
//   [in]            UINT                              CodePage,
      "u32",
//   [in]            DWORD                             dwFlags,
      "u32",
//   [in]            _In_NLS_string_(cbMultiByte)LPCCH lpMultiByteStr,
      "buffer",
//   [in]            int                               cbMultiByte, 負の数字もありうる。
      "i32",
//   [out, optional] LPWSTR                            lpWideCharStr,
      "pointer",
//   [in]            int                               cchWideChar
      "i32",
    ],
    // 関数が失敗すると０、成功すると0以外の値。
    result: "i8"

  },
  "GetLastError": {
    // errno変数へのアドレスが入ったポインタ。
    name: "GetLastError",
    parameters: [
    ],
    // DWORDはu32
    result: "u32"
  },
//   int MultiByteToWideChar(
// );
     
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
    libname = `C:/Windows/System32/kernel32.dll`;
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
