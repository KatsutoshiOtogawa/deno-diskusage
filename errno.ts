
// statvfsに関連するerrnoの番号のみ集めました。

// (statvfs() の場合) path で参照されるファイルが存在しない。
const EONET = 2;
// (statvfs() の場合) path のディレクトリ部分に検索許可が与えられていない (path_resolution(7) も参照すること)。
const EACCES  = 13;
// (fstatvfs() の場合) fd が有効なオープンファイルディスクリプターではない。
const EBADF = 9;
// buf または path が無効なアドレスを指している。
const EFAULT = 14;
// この呼び出しがシグナルで中断された。
const EINTR = 4
// ファイルシステムからの読み込みの間に I/O エラーが発生した。
const EIO = 5;
// (statvfs() の場合) path にシンボリックリンクが多すぎる。
const ELOOP = 40;
// (statvfs() の場合) path が長すぎる。
const ENAMETOOLONG = 36;
// 十分なカーネルメモリーがない。
const ENOMEM = 12;
// ファイルシステムがこの呼び出しをサポートしていない。
const ENOSYS = 38;
// (statvfs() の場合) path のディレクトリ部分がディレクトリでない。
const ENOTDIR = 20;
// いくつかの値が大き過ぎて、返り値の構造体で表現できない。
const EOVERFLOW = 75;
