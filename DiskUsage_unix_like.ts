import { c_ulong, Statvfs } from "./statvfs.ts"
import { load } from "./load_library_unix_like.ts";

type DiskUsage = {
    available: c_ulong,
    free: c_ulong,
    total: c_ulong
}

function get_diskusage(path: string): DiskUsage | undefined{
    const {statvfs, malloc, free, __errno_location, library } = load();

    // libclose();usingで最後に実行されることを後に保証。

    const errno_pointer = __errno_location();
    // @ts-ignore
    const errno_view = new Deno.UnsafePointerView(errno_pointer)
    const errno = errno_view.getBigInt64();

    // 
    const buf = new TextEncoder().encode(path);

    // 0なら成功 -1なら失敗
    let stat_result = -1 | 0;

    let diskusage: DiskUsage | undefined;
    // 11, 12, 13ならエラーになる。
    // 大きめに撮る必要がある。
    // 面倒くさいなら、2の倍数で取得しておくと間違いがない。
    let statvfs_ptr = malloc(16 * 8);
    try {
        stat_result = statvfs(buf, statvfs_ptr);
        // statvfs false;
        if (stat_result === -1) {
            // 勝手に値が変わるから
            let err: number
            if (typeof errno === 'number') {
                err = errno;
            } else {
                err = Number(errno);
            }
            // EONETエラーみたいに文字列で書けるようにする。
            throw  TypeError(`errno: ${err}`);
        }

        // 成功したので値取り出し。
        // @ts-ignore
        const statvfs_view = new Deno.UnsafePointerView(statvfs_ptr);

        const f_bsize = statvfs_view.getBigUint64(0) as bigint;
        const f_frsize = statvfs_view.getBigUint64(8) as bigint;
        const f_blocks = statvfs_view.getBigUint64(16) as bigint;
        const f_bfree = statvfs_view.getBigUint64(24) as bigint;
        const f_bafvail = statvfs_view.getBigUint64(32) as bigint;
        const f_files = statvfs_view.getBigUint64(40) as bigint;
        const f_ffree = statvfs_view.getBigUint64(48) as bigint;
        const f_favail = statvfs_view.getBigUint64(56) as bigint;
        const f_fsid = statvfs_view.getBigUint64(64) as bigint;
        const f_flag = statvfs_view.getBigUint64(72) as bigint;
        const f_namemax = statvfs_view.getBigUint64(80) as bigint;

        const statvs_result: Statvfs = {
            f_bsize,
            f_frsize,
            f_blocks,
            f_bfree,
            f_bafvail,
            f_files,
            f_ffree,
            f_favail,
            f_fsid,
            f_flag,
            f_namemax
        }

        // 値設定。
        diskusage = {
            available: statvs_result.f_bafvail * statvs_result.f_frsize,
            free: statvs_result.f_bfree * statvs_result.f_frsize,
            total: statvs_result.f_blocks * statvs_result.f_frsize
        }
    } finally {
        free(statvfs_ptr);
        library.close();
    }

    return diskusage;
}

export {
    type DiskUsage,
    get_diskusage,
}
