(function() {
    "use strict";

    var TILE_SIZE = 1;

    var scene, camera, renderer;
    var piece;

    /* Enums */
    var COLOR = {
        "RED"   : 0xff0000,
        "GREEN" : 0x00ff00,
        "BLUE"  : 0x0000ff,
        "YELLOW": 0xffff00,
        "ORANGE": 0xff7f00,
        "WHITE" : 0xffffff
    };

    var SIDE = {
        "TOP"   : 0,
        "BOTTOM": 1,
        "RIGHT" : 2,
        "LEFT"  : 3,
        "FRONT" : 4,
        "BACK"  : 5
    };

    function Tile(position, rotation, color) {
        this.geometry = new THREE.PlaneGeometry(TILE_SIZE, TILE_SIZE);
        this.material = new THREE.MeshLambertMaterial({color: color});
        /* Render both sides of the plane. */
        this.material.side = THREE.DoubleSide;
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh.position.set(position.x, position.y, position.z);
        this.mesh.rotation.set(rotation.x, rotation.y, rotation.z);

        scene.add(this.mesh);
    }

    function Piece(position, rotation, faces) {
        /**
         * @faces - an array of objects containing position and color.
         *   example:
         *     @faces = [
         *       {
         *          position: SIDE.FRONT,
         *          color: COLOR.RED
         *       },
         *       {
         *          position: SIDE.LEFT,
         *          color: COLOR.GREEN
         *       }
         *     ];
         */
        this.position = position;
        this.rotation = rotation;
        this.tiles = new Array();
        this.makeTiles(faces);
    }
    Piece.prototype.setRotation = function(rotation) {
        this.rotation = rotation;
    }
    Piece.prototype.makeTiles = function(faces) {
        faces.forEach(function(face) {
            /* The position of the tile's center. */
            var tilePosition = {
                "x": this.position.x,
                "y": this.position.y,
                "z": this.position.z
            };

            /* The orientation of the tile in Euler angles. */
            var tileRotation = {
                "x": 0,
                "y": 0,
                "z": 0
            };

            /* Calculate the position and rotation depending on
               which side the tile is on. */
            switch (face.side) {
                case SIDE.TOP:
                    tilePosition.z = this.position.z + TILE_SIZE/2;
                    break;
                case SIDE.BOTTOM:
                    tilePosition.z = this.position.z - TILE_SIZE/2;
                    break;
                case SIDE.RIGHT:
                    tilePosition.x = this.position.x + TILE_SIZE/2;
                    tileRotation.y = Math.PI/2;
                    break;
                case SIDE.LEFT:
                    tilePosition.x = this.position.x - TILE_SIZE/2;
                    tileRotation.y = Math.PI/2;
                    break;
                case SIDE.FRONT:
                    tilePosition.y = this.position.y + TILE_SIZE/2;
                    tileRotation.x = Math.PI/2;
                    break;
                case SIDE.BACK:
                    tilePosition.y = this.position.y - TILE_SIZE/2;
                    tileRotation.x = Math.PI/2;
                    break;
                default:
                    console.log("Error: Invalid tile position");
            }
            this.tiles.push(new Tile(tilePosition, tileRotation, face.color));
        }, this);
    }

    function gameLoop() {
        renderer.render(scene, camera);

        requestAnimationFrame(gameLoop);
    }

    function init() {
        /* Setup scene */
        scene = new THREE.Scene();
        renderer = new THREE.WebGLRenderer({alpha: false});
        renderer.setSize(800, 800);
        document.body.appendChild(renderer.domElement);
        camera = new THREE.PerspectiveCamera(75, 800/800, 0.1, 1000);

        /* Make camera look into YZ plane at a nice angle. */
        camera.position.set(-4, 5, -2);
        camera.rotation.set(-Math.PI/2, -0.6, 0);

        var ambientLight = new THREE.AmbientLight(0x444444);
        scene.add(ambientLight);
        var directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(0, 1, 0);
        scene.add(directionalLight);

        var position = {"x": 0, "y": 0, "z": 0};
        var rotation = {"x": 0, "y": 0, "z": 0};
        var faces = [
            {"side": SIDE.FRONT, "color": COLOR.RED},
            {"side": SIDE.BOTTOM, "color": COLOR.WHITE},
            {"side": SIDE.LEFT,  "color": COLOR.GREEN}
        ];
        piece = new Piece(position, rotation, faces);

        gameLoop();
    }

    init();
})();
