//functions (common utilities)

export const isNullOrUndefinedOrEmpty = (...list) =>
    list == null || list == undefined || list.length == 0 || (list.length == 1 && (list[0] == null || list[0] == ''));

export const single = (...list) =>
    new Promise((resolve, reject) =>
        list != null && list.length == 1
            ? resolve(list[0])
            : reject('list is either null/empty or has more than one element')
    );


export const remainder = (...list) =>
    isNullOrUndefinedOrEmpty(...list) || (list.length == 1 && (list[0] == null || list[0] == []))
        ? null
        : list.slice().splice(1, list.length - 1);

export const coalesce = (input, alt) => input == undefined ? alt : input;
export const coalesceExt = (input, alt) => input == null || input == '' || input == undefined ? alt : input;
export const coalesce2 = (input, ...alt) =>
    input != null
        ? input
        : isNullOrUndefinedOrEmpty(alt) || (alt[0] == null && alt.length == 1) //single(alt).then((elem) => elem )== null  //
            ? null
            : coalesce2(alt[0], remainder(alt));


//export function contains<T>(input: Array<T>, elem: T) {
//    input.find(x => x == elem) != undefined;
//}

//export const areEqual = (obj1, obj2) =>
//    Object.keys(obj1).every((key) => obj2.hasOwnProperty(key) && (obj1[key] === obj2[key]));

export function areEqual(obj1, obj2) {
    return Object.keys(obj1).every((key) => obj2.hasOwnProperty(key) && (obj1[key] === obj2[key]));
}

export const contains = (input: Array<Object>, elem) =>
    input.find(x => areEqual(x, elem)) != undefined;


export const findEntryInMap = (map, key) =>
    Array.from(map).find(x => x[0] == key);

export function clone<T>(obj: T) {
	var cloneObj = JSON.parse(JSON.stringify(obj));
	return Object.create(cloneObj) as T;
}

export const compare = <T>(a: T, b: T) : -1 | 0 | 1 => {
    let result: -1 | 0 | 1 =
        a < b
            ? -1
            : a == b
                ? 0
                : 1;
    return result;
}

export const tail = <T>(list: Array<T>): Array<T> =>
    isNullOrUndefinedOrEmpty(list) || (list.length == 1 && list[0] == null)
        ? null
        : list.slice().splice(1, list.length - 1); //IMPORTANT: slice() will first clone the array so that it does not mutate the input array

export const compareFn = <T>(a: T, b: T, fns: Array<(x: T) => any>): -1 | 0 | 1 => {
    let h = fns[0]; //head of array
    let t = tail(fns); //tail of array (remainder) 
    let c = isNullOrUndefinedOrEmpty(t);

    let result: -1 | 0 | 1 =
        h(a) < h(b)
            ? -1
            : h(a) === h(b)
                ? (c ? 0 : compareFn(a, b, t))
                : 1;
    return result;
}

//the main function that sorts an array of complex objects by an ordered list of one or more properties/keyes
export const orderBy = <T>(input: Array<T>, fns: Array<(o: T) => any>): Array<T> => 
    input.sort((a, b) => compareFn(a,b,fns));


export let log: any = function (target: Function, propertyKey: string, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any> {
    console.log(`----> Calling: ${propertyKey}`);
    //this.isRequesting = false;
    return descriptor;
};

//export function cmd(ctype: string)  {
//    return function(target: Function, key: string, descriptor: TypedPropertyDescriptor<any>): TypedPropertyDescriptor<any>{
//        // save a reference to the original method this way we keep the values currently in the
//        // descriptor and don't overwrite what another decorator might have done to the descriptor.
//        if (descriptor === undefined) {
//            descriptor = Object.getOwnPropertyDescriptor(target, key);
//        }
//        var originalMethod = descriptor.value;

//        //editing the descriptor/value parameter
//        descriptor.value = function () {
//            var args = [];
//            for (var _i = 0; _i < arguments.length; _i++) {
//                args[_i - 0] = arguments[_i];
//            }
//            var a = args.map(function (a) { return JSON.stringify(a); }).join();
//            // note usage of originalMethod here
//            var result = originalMethod.apply(this, args);
//            var r = JSON.stringify(result);
//            console.log("Call: " + key + "(" + a + ") => " + r);
//            return result;
//        };

//        // return edited descriptor as opposed to overwriting the descriptor
//        return descriptor;
//    };
//}


