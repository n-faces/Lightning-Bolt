//-----------------------------------------------------------------------------
/**
 * A clone from the C# Vector2 class.
 *
 * @class Vector2
 */
class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    negative() {
        this.x *= -1;
        this.y *= -1;
        return this;
    };

    toAngles() {
        return -Math.atan2(-this.y, this.x);
    };

    angleTo(a) {
        return Math.acos(this.dot(a) / (this.length() * a.length()));
    };

    add(v) {
        if (v instanceof Vector2) {
            this.x += v.x;
            this.y += v.y;
        } else {
            this.x += v;
            this.y += v;
        }
        return this;
    };

    subtract(v) {
        if (v instanceof Vector2) {
            this.x -= v.x;
            this.y -= v.y;
        } else {
            this.x -= v;
            this.y -= v;
        }
        return this;
    };

    multiply(v) {
        if (v instanceof Vector2) {
            this.x *= v.x;
            this.y *= v.y;
        } else {
            this.x *= v;
            this.y *= v;
        }
        return this;
    };

    divide(v) {
        if (v instanceof Vector2) {
            if (v.x !== 0) this.x /= v.x;
            if (v.y !== 0) this.y /= v.y;
        } else {
            if (v !== 0) {
                this.x /= v;
                this.y /= v;
            }
        }
        return this;
    };

    equals(v) {
        return this.x === v.x && this.y === v.y;
    };

    dot(v) {
        return this.x * v.x + this.y * v.y;
    };

    cross(v) {
        return this.x * v.y - this.y * v.x
    };

    length() {
        return Math.sqrt(this.dot(this));
    };

    normalize() {
        return this.divide(this.length());
    };

    min() {
        return Math.min(this.x, this.y);
    };

    max() {
        return Math.max(this.x, this.y);
    };

    setAngle(angle) {
        let length = this.length();
        this.x = Math.cos(angle) * length;
        this.y = Math.sin(angle) * length;
    };

    turnLeft() {
        //This method is used for unit vector only.
        let medium = this.x;
        this.x = -this.y;
        this.y = medium;
        return this;
    }

    // Utilities ----------------------------------------------
    clone() {
        return new Vector(this.x, this.y);
    };

    toString() {
        return 'x: ' + this.x + ', y: ' + this.y;
    };

    toObject() {
        return {x: this.x, y: this.y};
    };

    toArray(n) {
        return [this.x, this.y].slice(0, n || 2);
    };

    //==============================================================================================
    // Static methods

    static negative(v) {
        return new Vector2(-v.x, -v.y);
    };

    static add(a, b) {
        if (b instanceof Vector2) return new Vector2(a.x + b.x, a.y + b.y);
        else return new Vector2(a.x + b, a.y + b);
    };

    static subtract(a, b) {
        if (b instanceof Vector2) return new Vector2(a.x - b.x, a.y - b.y);
        else return new Vector2(a.x - b, a.y - b);
    };

    static multiply(a, b) {
        if (b instanceof Vector2) return new Vector2(a.x * b.x, a.y * b.y);
        else return new Vector2(a.x * b, a.y * b);
    };

    static divide(a, b) {
        if (b instanceof Vector2) return new Vector2(a.x / b.x, a.y / b.y);
        else return new Vector2(a.x / b, a.y / b);
    };

    static equals(a, b) {
        return a.x === b.x && a.y === b.y;
    };

    static dot(a, b) {
        return a.x * b.x + a.y * b.y;
    };

    static cross(a, b) {
        return a.x * b.y - a.y * b.x;
    };

    static normalize(v) {
        return this.divide(v, v.length());
    }
}