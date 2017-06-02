/**
 * Created by chacatod on 02/06/17.
 */
var invadersShader;

function initInvadersShader() {
    invadersShader = initShaders("invaders-vs","invaders-fs");

    // active ce shader
    gl.useProgram(invadersShader);

    // recupere la localisation de l'attribut dans lequel on souhaite acceder aux positions
    invadersShader.vertexPositionAttribute = gl.getAttribLocation(invadersShader, "aVertexPosition");
    gl.enableVertexAttribArray(invadersShader.vertexPositionAttribute); // active cet attribut 

    // pareil pour les coordonnees de texture 
    invadersShader.vertexCoordAttribute = gl.getAttribLocation(invadersShader, "aVertexCoord");
    gl.enableVertexAttribArray(invadersShader.vertexCoordAttribute);

    // adresse de la variable uniforme uOffset dans le shader
    invadersShader.positionUniform = gl.getUniformLocation(invadersShader, "uPosition");

    console.log("invaders shader initialized");
}

function Invaders() {
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

    console.log("invaders initialized");
}

Invaders.prototype.initParameters = function() {
    this.width = 0.2;
    this.height = 0.2;
    this.position = [0.3,0.7];
    this.texture = initTexture("images/Vengeance.png");
}

Invaders.prototype.setParameters = function(elapsed) {
    // on pourrait animer des choses ici
}

Invaders.prototype.setPosition = function(x,y) {
    this.position = [x,y];
}

Invaders.prototype.shader = function() {
    return invadersShader;
}

Invaders.prototype.sendUniformVariables = function() {
    gl.uniform2fv(invadersShader.positionUniform,this.position);
}

Invaders.prototype.draw = function() {
    // active le buffer de position et fait le lien avec l'attribut aVertexPosition dans le shader
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(invadersShader.vertexPositionAttribute, this.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // active le buffer de coords
    gl.bindBuffer(gl.ARRAY_BUFFER, this.coordBuffer);
    gl.vertexAttribPointer(invadersShader.vertexCoordAttribute, this.coordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    // dessine les buffers actifs
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.triangles);
    gl.drawElements(gl.TRIANGLES, this.triangles.numItems, gl.UNSIGNED_SHORT, 0);
}


