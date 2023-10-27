import { c_ulong, Statvfs } from "./statvfs.ts"
import { load as runtime_load } from "./load_library_win.ts";
import { load as kernel32_load } from "./load_library_win_kernel32.ts";
import { NULL } from "./NULL.ts";

type c_uint32 = number;
type DWORD = c_uint32;

type DiskUsage = {
    available: c_ulong,
    free: c_ulong,
    total: c_ulong
}

const CP_UTF8 = 65001;


function get_diskusage(path: string): DiskUsage | undefined{
    const { malloc, free, library: runtime_library} = runtime_load();

    const {GetDiskFreeSpaceExW, FormatMessage, GetLastError, library: kernel32_library } = kernel32_load();

        // ,
        // GetLastError,

    // libclose();usingで最後に実行されることを後に保証。

    // const errno_pointer = _get_errno();
    // @ts-ignore
    // const errno_view = new Deno.UnsafePointerView(errno_pointer)
    // const errno = errno_view.getBigInt64();

    // C＋＋なので文字列の最後をnull文字にする必要があるのでは？
    // 
    const buf = new TextEncoder().encode(path + '0');

    buf[buf.length] = 0; // \0 terminator

    //     int size = MultiByteToWideChar(CP_UTF8, 0, str, -1, NULL, 0);
    // if (!size) throw std::runtime_error("MultiByteToWideChar failed");

    // std::wstring result;
    // result.resize(size);

    // size = MultiByteToWideChar(CP_UTF8, 0, str, -1, (LPWSTR)result.data(), result.size());
    // if (!size) throw std::runtime_error("MultiByteToWideChar failed");

    // 0なら失敗 それ以外なら成功
    let disk_result = 0;

    // lpDirectoryName
    let diskusage: DiskUsage | undefined;
    // 16ならエラーになる
    // 大きめに撮る必要がある。
    // 面倒くさいなら、2の倍数で取得しておくと間違いがない。

    //   [out, optional] PULARGE_INTEGER lpFreeBytesAvailableToCaller,
//   [out, optional] PULARGE_INTEGER lpTotalNumberOfBytes,
//   [out, optional] PULARGE_INTEGER lpTotalNumberOfFreeBytes

    let lpFreeBytesAvailableToCaller = malloc(16 * 8);
    let lpTotalNumberOfBytes = malloc(16 * 8);
    let lpTotalNumberOfFreeBytes = malloc(16 * 8);
    try {
        // disk_result = GetDiskFreeSpaceExW(buf, lpFreeBytesAvailableToCaller, lpTotalNumberOfBytes, lpTotalNumberOfFreeBytes);
        disk_result = GetDiskFreeSpaceExW(buf, lpFreeBytesAvailableToCaller, lpTotalNumberOfBytes, lpTotalNumberOfFreeBytes);
        if (disk_result === 0) {
            let lasterror = GetLastError();
            //         FormatMessage(
            // FORMAT_MESSAGE_ALLOCATE_BUFFER | 
            // FORMAT_MESSAGE_FROM_SYSTEM |
            // FORMAT_MESSAGE_IGNORE_INSERTS,
            // NULL,
            // lastError,
            // MAKELANGID(LANG_NEUTRAL, SUBLANG_DEFAULT),
            // (LPTSTR) &lpMsgBuf,
            // 0, NULL);
            // 勝手に値が変わるから
            // let err: number
            // if (typeof errno === 'number') {
            //     err = errno;
            // } else {
            //     err = Number(errno);
            // }
            // // EONETエラーみたいに文字列で書けるようにする。
            // throw  TypeError(`errno: ${err}`);
        }

//         typedef union _ULARGE_INTEGER {
//   struct {
//     DWORD LowPart;
//     DWORD HighPart;
//   } DUMMYSTRUCTNAME;
//   struct {
//     DWORD LowPart;
//     DWORD HighPart;
//   } u;
//   ULONGLONG QuadPart;
// } ULARGE_INTEGER;
        // 成功したので値取り出し。
        // @ts-ignore
        const lpFreeBytesAvailableToCaller_view = new Deno.UnsafePointerView(lpFreeBytesAvailableToCaller);

        const lpFreeBytesAvailableToCaller_QuadPart = lpFreeBytesAvailableToCaller_view.getBigUint64(8) as bigint;

        const lpTotalNumberOfBytes_view = new Deno.UnsafePointerView(lpTotalNumberOfBytes);

        const lpTotalNumberOfBytes_QuadPart = lpTotalNumberOfBytes_view.getBigUint64(8) as bigint;

        const lpTotalNumberOfFreeBytes_view = new Deno.UnsafePointerView(lpTotalNumberOfFreeBytes);

        const lpTotalNumberOfFreeBytes_QuadPart = lpTotalNumberOfFreeBytes_view.getBigUint64(8) as bigint;

        // 値設定。
        diskusage = {
            available: lpFreeBytesAvailableToCaller_QuadPart,
            free: lpTotalNumberOfFreeBytes_QuadPart,
            total: lpTotalNumberOfBytes_QuadPart
        }
    } finally {
        free(lpFreeBytesAvailableToCaller);
        free(lpTotalNumberOfBytes);
        free(lpTotalNumberOfFreeBytes);
        runtime_library.close();
        kernel32_library.close();
    }

    return diskusage;
}

export {
    type DiskUsage,
    get_diskusage,
}
