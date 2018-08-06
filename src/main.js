//=============================================================================
// main.js
//=============================================================================

'use strict';

/*
* 1. PIXI.ParticleContainer
* 2. Sấm sét nhiều nhành
* 3. Hiệu ứng lightning text.
* 4. Interactivity và User Input.
* */
const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 600;
const SWAY = 60;
const JAGGEDNESS = 1 / SWAY;

let app = new PIXI.Application({
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    antialias: true,
    view: $('#monitor').get(0)
});
app.stage.interactive = true;

// Work around for PIXI issue with container.
app.stage.hitArea = new PIXI.Rectangle(0, 0, app.screen.width, app.screen.height);
document.body.appendChild(app.view);

(function updateResolution() {
    let resizeWidth = SCREEN_WIDTH - window.innerWidth;
    let resizeHeight = SCREEN_HEIGHT - window.innerHeight;
    // window.moveBy(-1 * resizeWidth / 2, -1 * resizeHeight / 2);
    // window.resizeBy(resizeWidth, resizeHeight);
    app.renderer.resize(SCREEN_WIDTH, SCREEN_HEIGHT);
})();

function spriteBatch(texture = throwError(), position = throwError(),
                     color = 0, rotation = 0, scale = 1, anchorX = 0, anchorY = 0) {
    let sprite = new PIXI.Sprite(texture);
    sprite.tint = color;
    sprite.position.set(position.x, position.y);
    sprite.rotation = rotation;
    if (scale instanceof Vector2) {
        sprite.scale.set(scale.x, scale.y);
    } else {
        sprite.scale.set(scale);
    }
    sprite.anchor.set(anchorX, anchorY);
    return sprite;
}

class Segment {
    /**
     *
     * @param A
     * @type Point
     * @desc The Starting Point
     *
     * @param B
     * @type Point
     * @desc The End Point
     *
     * @param thickness
     * @type Number
     * @desc The thickness of the segment
     */
    constructor(A, B, thickness) {
        this.A = A;
        this.B = B;
        this.thickness = thickness || 1;
        this.children = [];
        this._capTexture = PIXI.loader.resources['Cap'].texture;
        this._segmentTexture = PIXI.loader.resources['Segment'].texture;
    }

    render(color) {
        color = color || 0xffffff;

        let A = this.A,
            B = this.B,
            tangent = Vector2.subtract(B, A),
            rotation = tangent.toAngles(),
            imageThickness = 12,
            thicknessScale = this.thickness / imageThickness,
            middleScale = new Vector2(tangent.length() / this._segmentTexture.width, thicknessScale);

        this.addChild(
            // Left cap
            spriteBatch(this._capTexture, A, color, rotation, thicknessScale, 1, 0.5),
            // Right cap
            spriteBatch(this._capTexture, B, color, rotation + Math.PI, thicknessScale, 1, 0.5),
            // Middle
            spriteBatch(this._segmentTexture, A, color, rotation, middleScale, 0, 0.5)
        );
    };

    addChild(args) {
        for (let child of arguments) {
            this.children.push(child);
        }
    }
}

class LightningBolt {
    constructor(A, B, thickness) {
        this.A = A;
        this.B = B;
        this.thickness = thickness;
        this.fadeRate = 0.04;
        this.container = new PIXI.Container();
        this.bolt = [];
        this._rendered = false;
        this.createLightningBolt();
    }

    get alpha() {
        return this.container.alpha;
    }

    set alpha(value) {
        this.container.alpha = value;
    }

    createLightningBolt() {
        let positions = [], A = this.A, B = this.B,
            tangent = Vector2.subtract(B, A),
            normal = Vector2.normalize(tangent),
            length = tangent.length(),
            prevPoint = A, prevDisplacement = 0;

        positions.push(0);
        for (let i = 0; i < length / 4; i++) {
            positions.push(Math.random());
        }
        positions.sort();

        for (let i = 1; i < positions.length; i++) {
            // Prevent sharp angles by ensuring very close positions also have small perpendicular variation.
            let scale = (length * JAGGEDNESS) * (positions[i] - positions[i - 1]);

            // Points near the middle of the bolt can be further from the central line.
            let envelope = positions[i] > 0.95 ? 20 * (1 - positions[i]) : 1;
            let displacement = Random.range(-SWAY, SWAY);

            displacement -= (displacement - prevDisplacement) * (1 - scale);
            displacement *= envelope;

            let point = Vector2
                .add(A, (Vector2.multiply(tangent, positions[i])))
                .add(Vector2.multiply(normal, displacement).turnLeft());

            this.bolt.push(new Segment(prevPoint, point, this.thickness));
            prevPoint = point;
            prevDisplacement = displacement;
        }

        this.bolt.push(new Segment(prevPoint, B, this.thickness));
    };

    refresh() {
        if (this.bolt.length > 0) {
            this.bolt = [];
            this.container.removeChildren();
            this.createLightningBolt();
            this.alpha = 1;
            this._rendered = false;
        }
    }

    setPosition(A, B) {
        this.A = A;
        this.B = B;
        this.refresh();
    }

    isComplete() {
        return this._rendered && this.alpha <= 0;
    };

    render(color) {
        if (this.alpha <= 0) return;
        for (let segment of this.bolt) {
            segment.render(color);
            this.container.addChild(...segment.children);
        }
        this._rendered = true;
    };

    update() {
        if (this._rendered) {
            this.container.alpha -= this.fadeRate;
        }
    };

}

// Upcoming implementation

/*class BranchLightning {
    constructor(A, B, color) {
        this.A = A;
        this.B = B;
        this.color = color || '#FFFFFF';
        this.direction = Vector2.subtract(B, A).normalize();
        this.bolts = [];
        this._createBranchs();
    }

    _createBranchs() {
        let mainLightningBolt = new LightningBolt(this.A, this.B, this.color),
            bolts = this.bolts,
            numBranches = Random.range(3, 6),
            branchPoints = [], i, len;

        bolts.push(mainLightningBolt);

        while (numBranches--) {
            branchPoints.push(Math.random());
        }

        branchPoints.sort();

        for (i = 0, len = branchPoints.length; i < len; i++) {

            // LightningBolt.GetPoint() gets the position of the lightning branchLightning at specified fraction (0 = start of branchLightning, 1 = end)
            let boltStart = mainLightningBolt.getPoint(branchPoints[i]),
                diff = this.B.getSubtracted(this.A),
                shouldInvert;

            // rotate 30 degrees. Alternate between rotating left and right.
            shouldInvert = ( (i & 1 ) === 0 ? 1 : -1 );

            diff.scale(1 - branchPoints[i]);

            //if we are going to use Matrix:
//                let rot = new Yals.Matrix2D( 1, 0, 0, 1, 0, 0 );
//                rot.rotate( 30 * shouldInvert );
//
//                rot.applyToVector( diff );
//
//                diff.add( boltStart );

            //or them, the proper method in the Vector object:
            diff.add(boltStart).rotateAroundPivot(boltStart, ( 30 * shouldInvert ) * DEGREES_TO_RADIANS);

            bolts.push(new LightningBolt(boltStart, diff, this.color));
        }
    };

    update() {
        let bolts = this.bolts;
        for (let i = 0, len = bolts.length; i < len; i++) {
            if (!bolts[i].isComplete())
                bolts[i].update();
        }
    };

    render(ctx) {
        let bolts = this.bolts;
        for (let i = 0, len = bolts.length; i < len; i++) {
            bolts[i].render(ctx);
        }
    };
}*/

// Display ==========================================================
class ScreenText extends PIXI.Text {
    constructor() {
        super("Tap for thunder ...", {fontFamily: 'Impact', fill: 0xffffff});
        this.anchor.set(0.5);
        this.position.set(app.screen.width / 2, 240);
    }
}

PIXI.loader
    .add('Cap', 'img/Cap.png')
    .add('Segment', 'img/Segment.png')
    .load(function () {
        let p1 = new Vector2();
        let p2 = new Vector2();
        let bolt = new LightningBolt(p1, p2, 1);
        app.stage.addChild(bolt.container);
        app.ticker.add(() => {
            bolt.update();
        });

        function onPointerDown(event) {
            switch (Random.int(4)) {
                case 0:
                    p1.set(Random.int(app.screen.width), 0);
                    break;
                case 1:
                    p1.set(app.screen.width, Random.int(app.screen.height));
                    break;
                case 2:
                    p1.set(Random.int(app.screen.width), app.screen.height);
                    break;
                case 3:
                    p1.set(0, Random.int(app.screen.height));
                    break;
                default:
                    throw new Error('Unknown ID!');
            }

            AudioHelper.playRandom();

            let thickness = parseInt($('#thickness').val());
            let tint = Utils.css2hex($('#tint').val());
            tint = Math.max(tint, 1);

            p2.set(event.data.global.x, event.data.global.y);
            bolt.thickness = thickness;
            bolt.refresh();
            bolt.render(tint);
        }

        app.stage.addChild(new ScreenText());
        app.stage.on('pointerdown', onPointerDown);
    });