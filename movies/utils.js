const debounce = (func, delay=1000) => {
    let timeoutID;
    return (...arg) => {
        if (timeoutID) {
            clearTimeout(timeoutID);
        }
        timeoutID = setTimeout(() =>  {
            func.apply(null, arg);
        }, delay)
    };
};