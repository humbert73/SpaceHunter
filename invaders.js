var invaderShader;

function initInvaderShader() {
    invaderShader = initShaders("invader-vs","invader-fs");

    // active ce shader
    gl.useProgram(invaderShader);

    // recupere la localisation de l'attribut dans lequel on souhaite acceder aux positions
    invaderShader.vertexPositionAttribute = gl.getAttribLocation(invaderShader, "aVertexPosition");
    gl.enableVertexAttribArray(invaderShader.vertexPositionAttribute); // active cet attribut 

    // pareil pour les coordonnees de texture 
    invaderShader.vertexCoordAttribute = gl.getAttribLocation(invaderShader, "aVertexCoord");
    gl.enableVertexAttribArray(invaderShader.vertexCoordAttribute);

    // adresse de la variable uniforme uOffset dans le shader
    invaderShader.positionUniform = gl.getUniformLocation(invaderShader, "uPosition");
    invaderShader.textureUniform = gl.getUniformLocation(invaderShader, "uTexture");

    invaderShader.maTextureUniform = gl.getUniformLocation(invaderShader, "uMaTexture");

    invaderShader.canalAlpha = gl.getUniformLocation(invaderShader, "uAlpha");

    console.log("invader shader initialized");
}

function Invader() {
    this.initParameters();

    // cree un nouveau buffer sur le GPU et l'active
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

    // un tableau contenant les positions des sommets (sur CPU donc)
    var wo2 = 0.5*this.width;
    var ho2 = 0.5*this.height;

    var vertices = [
        -wo2,-ho2, -0.5,
        wo2,-ho2, -0.5,
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
    var tri = [0,1,2,0,2,3];
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(tri), gl.STATIC_DRAW);
    this.triangles.numItems = 6;

    console.log("invader initialized");
}

Invader.prototype.initParameters = function () {
    this.width    = 0.2;
    this.height   = 0.2;
    this.position = [ 0.5, 0.7 ];
    this.texture  = initTexture( 'images/Bigboy.png' );
    this.drawn = true;
};

Invader.prototype.setParameters = function(elapsed) {
    // on pourrait animer des choses ici
}

Invader.prototype.setPosition = function(x,y) {
    this.position = [x,y];
}

Invader.prototype.shader = function() {
    return invaderShader;
}

Invader.prototype.sendUniformVariables = function() {
    gl.uniform2fv(invaderShader.positionUniform,this.position);
    gl.uniform1i(invaderShader.textureUniform, this.texture);
}

Invader.prototype.draw = function() {
    // active le buffer de position et fait le lien avec l'attribut aVertexPosition dans le shader
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(invaderShader.vertexPositionAttribute, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // active le buffer de coords
    gl.bindBuffer(gl.ARRAY_BUFFER, this.coordBuffer);
    gl.vertexAttribPointer(invaderShader.vertexCoordAttribute, this.coordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0); // on active l'unite de texture 0
    gl.bindTexture(gl.TEXTURE_2D,invader.texture); // on place maTexture dans l'unité active
    gl.uniform1i(invaderShader.maTextureUniform, 0); // on dit au shader que maTextureUniform se trouve sur l'unite de texture 0

    gl.enable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);
    gl.blendEquation( gl.FUNC_ADD );
    gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );

    // dessine les buffers actifs
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.triangles);
    gl.drawElements(gl.TRIANGLES, this.triangles.numItems, gl.UNSIGNED_SHORT, 0);
}


