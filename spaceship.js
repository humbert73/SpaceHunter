var spaceshipShader;

function initSpaceshipShader() {
    spaceshipShader = initShaders("spaceship-vs", "spaceship-fs");

    // active ce shader
    gl.useProgram(spaceshipShader);

    // recupere la localisation de l'attribut dans lequel on souhaite acceder aux positions
    spaceshipShader.vertexPositionAttribute = gl.getAttribLocation(spaceshipShader, "aVertexPosition");
    gl.enableVertexAttribArray(spaceshipShader.vertexPositionAttribute); // active cet attribut 

    // pareil pour les coordonnees de texture 
    spaceshipShader.vertexCoordAttribute = gl.getAttribLocation(spaceshipShader, "aVertexCoord");
    gl.enableVertexAttribArray(spaceshipShader.vertexCoordAttribute);

    // adresse de la variable uniforme uOffset dans le shader
    spaceshipShader.positionUniform = gl.getUniformLocation(spaceshipShader, "uPosition");

    spaceshipShader.textureUniform = gl.getUniformLocation(spaceshipShader, "uTexture");
    spaceshipShader.maTextureUniform = gl.getUniformLocation(spaceshipShader, "uMaTexture");
    spaceshipShader.canalAlpha = gl.getUniformLocation(spaceshipShader, "uAlpha");

    console.log("spaceship shader initialized");
}

function Spaceship() {
    this.initParameters();

    // cree un nouveau buffer sur le GPU et l'active
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

    // un tableau contenant les positions des sommets (sur CPU donc)
    var wo2 = 0.5 * this.width;
    var ho2 = 0.5 * this.height;

    var vertices = [
        -wo2, -ho2, -0.5,
        wo2, -ho2, -0.5,
        wo2, ho2, -0.5,
        -wo2, ho2, -0.5
    ];

    // on envoie ces positions au GPU ici (et on se rappelle de leur nombre/taille)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    this.vertexBuffer.itemSize = 3;
    this.vertexBuffer.numItems = 4;

    // meme principe pour les couleurs
    this.coordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.coordBuffer);
    var coords = [
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(coords), gl.STATIC_DRAW);
    this.coordBuffer.itemSize = 2;
    this.coordBuffer.numItems = 4;

    // creation des faces du cube (les triangles) avec les indices vers les sommets
    this.triangles = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.triangles);
    var tri = [0, 1, 2, 0, 2, 3];
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tri), gl.STATIC_DRAW);
    this.triangles.numItems = 6;

    console.log("spaceship initialized");
}

Spaceship.prototype.initParameters = function () {
    this.width = 0.2;
    this.height = 0.2;
    this.position = [0.0, -0.7];
    this.life = 100;
    this.texture = initTexture('images/spaceship.png');

};

Spaceship.prototype.isAlive = function () {
    return this.life > 0;
};

Spaceship.prototype.reduceLife = function () {
    if (this.isAlive()) {
        this.life--;
    } else {
        this.life = 0;
    }
};

Spaceship.prototype.setParameters = function (elapsed) {
    // on pourrait animer des choses ici
};

Spaceship.prototype.setPosition = function (x, y) {
    this.position = [x, y];
};

Spaceship.prototype.shader = function () {
    return spaceshipShader;
};

Spaceship.prototype.sendUniformVariables = function () {
    gl.uniform2fv(spaceshipShader.positionUniform, this.position);
    gl.uniform1i(spaceshipShader.textureUniform, this.texture);
};

Spaceship.prototype.draw = function () {
    // active le buffer de position et fait le lien avec l'attribut aVertexPosition dans le shader
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(spaceshipShader.vertexPositionAttribute, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // active le buffer de coords
    gl.bindBuffer(gl.ARRAY_BUFFER, this.coordBuffer);
    gl.vertexAttribPointer(spaceshipShader.vertexCoordAttribute, this.coordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0); // on active l'unite de texture 0
    gl.bindTexture(gl.TEXTURE_2D, spaceship.texture); // on place maTexture dans l'unité active
    gl.uniform1i(spaceshipShader.maTextureUniform, 0); // on dit au shader que maTextureUniform se trouve sur l'unite de texture 0

    gl.enable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);
    gl.blendEquation( gl.FUNC_ADD );
    gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );

    // dessine les buffers actifs
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.triangles);
    gl.drawElements(gl.TRIANGLES, this.triangles.numItems, gl.UNSIGNED_SHORT, 0);
};