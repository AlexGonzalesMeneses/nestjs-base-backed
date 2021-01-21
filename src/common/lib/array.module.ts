export let removeAll = function (elements: Array<any>, list: Array<any>): Array<any> {
    for (var i = 0, l = elements.length; i < l; i++) {
        let ind: number;
        while ((ind = list.indexOf(elements[i])) > -1) {
            list.splice(ind, 1);
        }
    }
    return list;
}