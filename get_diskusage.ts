import { statvfs as statvfs_unix_like } from './unix_like/statvfs.ts';

type DiskUsage = {
    available: c_ulong,
    free: c_ulong,
    total: c_ulong
}

function get_diskusage(path: string): DiskUsage | undefined {
    const buf = new TextEncoder().encode(path);
    const statvfs_result = statvfs_unix_like(buf);

    let diskusage: DiskUsage | undefined;
    // 値設定。
    diskusage = {
        available: statvfs_result.f_bafvail * statvfs_result.f_frsize,
        free: statvfs_result.f_bfree * statvfs_result.f_frsize,
        total: statvfs_result.f_blocks * statvfs_result.f_frsize
    }

    return diskusage;
}