
export function isSameArray(a1: any[], a2: any[]) {
    const same = (a1.length === a2.length) && a1.every((element, index) => {
        return element === a2[index];
    });

    // if(!same) {
    //     console.log(a1, a2);
    // }

    return same;
}
