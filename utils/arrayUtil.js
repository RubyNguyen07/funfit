/** When new item is pushed, use this function to shift the new item to the index indicated
 * @param { [string] } arr: The array 
 * @param { number } start: The index you want to shift the new item to 
 * @param { number } size: Length of the array 
 * @param { string } newItem: The new value pushed 
 */
var pushBack = (arr, start, size, newItem) => {
    let j = size
    while (j > start) {
        arr[j] = arr[j-1]; 
        j--; 
    }
    arr[start] = newItem; 
} 

/** Use this function to re-arrange the array based on the order of time scheduled
 * @param { [string] } arr: The array 
 * @param { number } start: The start of the reminder list in the array 
 * @param { number } size: The length of the array 
 * @param { string } newItem: The new item pushed 
 * @returns nothing
 */
var cmpTime = (arr, start, size, newItem) => {
    if (size < start) {
        return; 
    }
    if (size == start) {
        return arr.push(newItem); 
    }

    let timeNewItem = newItem.substring(3, 8);
    if (timeNewItem <= arr[start].substring(3, 8)) {
        arr.push(newItem); 
        pushBack(arr, start, size, newItem);
        return; 
    } 

    if (size - start == 1 || arr[size - 1].substring(3, 8) <= timeNewItem) {
        arr.push(newItem); 
        return; 
    } 

    let i = start + 1; 
    while (i < size) {
        let timeBigger = arr[i].substring(3, 8);
        let timeLess = arr[i-1].substring(3, 8);
        if (timeNewItem > timeLess && timeNewItem < timeBigger) {
            arr.push(newItem); 
            pushBack(arr, i, size, newItem); 
            return; 
        }
        i++; 
    }
}

/** Use this function to find the suitable position for the new item pushed 
 * @param { [string] } arr: The array 
 * @param { string } newItem: The new item
 * @param { number } size: The length of the array 
 * @param { boolean } typeC: Whether the new item is a completed item or a reminder item 
 * @returns nothing
 */
var findPos = (arr, newItem, size, typeC) => {
    if (!typeC) {
        let start = size; 
        let i = 0; 
        while (i < size) {
            if (arr[i][0] == "R") {
                start = i; 
                break; 
            }
            i++; 
        }
        cmpTime(arr, start, size, newItem);
    } else {
        let i = 0; 
        while (i < size) {
            if (newItem[1] > arr[i][1]) {
                arr.push(newItem); 
                pushBack(arr, i, size, newItem);
                return; 
            }
            i++; 
        }
        arr.push(newItem); 
    }
}

module.exports = findPos; 
