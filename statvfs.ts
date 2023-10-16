

type c_ulong = bigint;
type fsblkcnt_t = c_ulong;
type fsfilcnt_t = c_ulong;

// statfsとstatvfsがあるので中尉。
type Statvfs = {
    f_bsize: c_ulong,
    f_frsize: c_ulong,
    f_blocks: fsblkcnt_t,
    f_bfree: fsblkcnt_t,
    f_bafvail: fsblkcnt_t,
    f_files: fsfilcnt_t,
    f_ffree: fsfilcnt_t,
    f_favail: fsfilcnt_t,
    f_fsid: c_ulong,
    f_flag: c_ulong,
    f_namemax: c_ulong
}
// ACCES
// EBADF
// EFAULT
// EINTR
// ELOOP
// ENAMETOOLONG
// ENOENT
// ENOMEM
// ENOSYS
// ENOTDIR
// EOVERFLOW


export {
    type c_ulong,
    type fsblkcnt_t,
    type fsfilcnt_t,
    type Statvfs,
}
