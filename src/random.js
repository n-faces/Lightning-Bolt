/**
 * Generate random data
 *
 * @static
 * @class Random
 */
class Random {
    constructor() {
        throw new Error('This is a static class');
    }

    static int(max) {
        return Math.floor(max * Math.random());
    };

    static range(min, max) {
        return (min + (Math.random() * (max - min)));
    };

    static intRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    static choice(choices) {
        return choices[this.intRange(0, choices.length - 1)];
    };

    static bool() {
        return this.choice([true, false]);
    };

    static property(obj) {
        var keys = Object.keys(obj);
        return obj[keys[this.intRange(0, keys.length - 1)]];
    }
}