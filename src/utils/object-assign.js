export default function (target, ...sources) {
    target = Object(target);

    sources.forEach(src => {
        src = Object(src);
        Object.keys(src).forEach(key => target[key] = src[key])
    });

    return target;
}

