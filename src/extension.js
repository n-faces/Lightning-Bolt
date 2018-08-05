Math.clamp = (x, min, max) => {
    return Math.max(min, Math.min(max, x));
};

/**
 * Returns a number whose value is limited to the given range.
 *
 * @method Number.prototype.clamp
 * @param {Number} min The lower boundary
 * @param {Number} max The upper boundary
 * @return {Number} A number in the range (min, max)
 */
Number.prototype.clamp = (min, max) => {
    return Math.clamp(this, min, max);
};

Object.defineProperty(Array.prototype, 'last', {
    get() {
        return this[this.length - 1];
    },
    configurable: true
});