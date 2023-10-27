// import { get_diskusage, DiskUsage } from "./DiskUsage_unix_like.ts";
import { get_diskusage, DiskUsage } from "./DiskUsage_win.ts";

// function check(path: string) {

//     if (callback) { 

//     }
// }


async function check(path: string): Promise<DiskUsage | undefined> {

    return checkSync(path);

}

function checkSync(path: string): DiskUsage | undefined {
    return get_diskusage(path);
}

export {
    check,
    checkSync,
}