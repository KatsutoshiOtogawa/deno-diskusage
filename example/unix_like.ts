import { checkSync, check } from "../check.ts";

// const path = '/usr/lib'
const path = 'C:/Users/katsutoshi/Downloads'

try {
    const info = checkSync(path);

    console.log(info);
} catch (err) {
    console.error(err);
}


// check(path, (err, info) => {
//     if (err) {
//         console.error(err);
//     } else {

//     }
// })

const info = checkSync(path);
console.log(info);