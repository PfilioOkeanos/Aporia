
import { kreisPunkte, sammleUmlaufbahnen } from "../Sternsysteme/Umlaufbahnen.js";
import { bahnPunkte, positionVon } from "../Sternsysteme/Bahnphysik.js";
import { sammleAsteroiden, sichtbarerSteinRadius } from "../Sternsysteme/Asteroidenguertel.js";
import { formePunkt, objektform } from "./Objektformen.js";
import { starteObjektbewegung } from "./Objektbewegung.js";

const VERTEX = `
    attribute vec3 aPoint;
    uniform vec3 uCenter, uRight, uUp, uBack;
    uniform float uRadius, uAspect, uNear;
    uniform vec2 uLinienOffset;
    varying vec3 vNormal;
    void main() {
        vec3 point = uCenter + aPoint * uRadius;
        vec3 view = vec3(dot(point, uRight), dot(point, uUp), dot(point, uBack));
        gl_Position = vec4(view.x * 2.414 / uAspect, view.y * 2.414,
                           -view.z - 2.0 * uNear, -view.z);
        gl_Position.xy += uLinienOffset * gl_Position.w;
        vNormal = aPoint;
    }
`;

const FRAGMENT = `
    precision mediump float;
    uniform vec3 uColor, uEmissionColor;
    uniform float uEmission;
    varying vec3 vNormal;
    void main() {
        float light = max(0.0, dot(normalize(vNormal), normalize(vec3(-0.4, 0.7, 0.8))));
        vec3 base = uColor * (0.33 + 0.67 * light);
        vec3 emitted = pow(uEmissionColor, vec3(2.2)) * uEmission;
        gl_FragColor = vec4(pow(clamp(pow(base, vec3(2.2)) + emitted, 0.0, 1.0), vec3(1.0 / 2.2)), 1.0);
    }
`;

function ladeProgramm(gl) {
    const program = gl.createProgram();
    for (const [type, source] of [[gl.VERTEX_SHADER, VERTEX], [gl.FRAGMENT_SHADER, FRAGMENT]]) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw new Error(gl.getShaderInfoLog(shader));
        }
        gl.attachShader(program, shader);
        gl.deleteShader(shader);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program));
    }
    return program;
}

function kugelGeometrie(rows = 20, columns = 32) {
    const points = [];
    const indices = [];
    for (let row = 0; row <= rows; row++) {
        const latitude = Math.PI * row / rows;
        for (let column = 0; column <= columns; column++) {
            const longitude = 2 * Math.PI * column / columns;
            points.push(Math.sin(latitude) * Math.cos(longitude),
                Math.cos(latitude), Math.sin(latitude) * Math.sin(longitude));
            if (row < rows && column < columns) {
                const index = row * (columns + 1) + column;
                const next = index + columns + 1;
                indices.push(index, next, index + 1, next, next + 1, index + 1);
            }
        }
    }
    return { points: new Float32Array(points), indices: new Uint16Array(indices) };
}

export function starteSzene(canvas, reset, status, zeichneNavigation, editor, kamera, modellEbene, simuliere, bearbeitbar = true) {
    const gl = canvas.getContext("webgl", { alpha: false });
    if (!gl) {
        status.hidden = false;
        reset.disabled = true;
        return;
    }

    const program = ladeProgramm(gl);
    const { points, indices } = kugelGeometrie();
    const formPuffer = new Map();
    function bindeForm(form) {
        if (!formPuffer.has(form)) {
            const puffer = gl.createBuffer();
            formPuffer.set(form, puffer);
            const koordinaten = new Float32Array(points.length);
            for (let i = 0; i < points.length; i += 3) {
                koordinaten.set(formePunkt(form, points[i], points[i + 1], points[i + 2]), i);
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, puffer);
            gl.bufferData(gl.ARRAY_BUFFER, koordinaten, gl.STATIC_DRAW);
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, formPuffer.get(form));
    }
    bindeForm("kugel");
    const kugelIndex = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, kugelIndex);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    const point = gl.getAttribLocation(program, "aPoint");
    gl.enableVertexAttribArray(point);
    gl.vertexAttribPointer(point, 3, gl.FLOAT, false, 0, 0);
    const bahnPuffer = gl.createBuffer();
    const ellipsen = new WeakMap();
    gl.bindBuffer(gl.ARRAY_BUFFER, bahnPuffer);
    gl.bufferData(gl.ARRAY_BUFFER, kreisPunkte, gl.STATIC_DRAW);
    const stein = kugelGeometrie(6, 10);
    const steinPuffer = gl.createBuffer();
    const steinIndex = gl.createBuffer();
    for (let i = 0; i < stein.points.length; i += 3) {
        stein.points.set(formePunkt("brocken", stein.points[i], stein.points[i + 1], stein.points[i + 2]), i);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, steinPuffer);
    gl.bufferData(gl.ARRAY_BUFFER, stein.points, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, steinIndex);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, stein.indices, gl.STATIC_DRAW);
    gl.useProgram(program);
    gl.clearColor(0.025, 0.047, 0.075, 1);
    gl.enable(gl.DEPTH_TEST);

    const uniforms = Object.fromEntries(
        ["Center", "Right", "Up", "Back", "Radius", "Aspect", "Near", "LinienOffset", "Color", "EmissionColor", "Emission"].map(name =>
            [name, gl.getUniformLocation(program, "u" + name)])
    );
    let stand;
    if (bearbeitbar) starteObjektbewegung(canvas, editor, () => stand);
    let previousTime = performance.now();
    let frame;

    function zeichnen(time) {
        const scale = Math.min(window.devicePixelRatio || 1, 2);
        const width = Math.max(1, Math.round(canvas.clientWidth * scale));
        const height = Math.max(1, Math.round(canvas.clientHeight * scale));
        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
        }

        const seconds = Math.max(0, Math.min((time - previousTime) / 1000, 0.05));
        const tage = simuliere(seconds);
        stand = kamera.stand(seconds);
        const { eye, right, up, back } = stand;
        const relativ = position => position.map((wert, achse) => wert - eye[achse]);
        zeichneNavigation(stand, width / height);
        previousTime = time;
        if (modellEbene.zeichnen(stand, width, height, editor, tage)) {
            frame = requestAnimationFrame(zeichnen);
            return;
        }
        gl.viewport(0, 0, width, height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.uniform1f(uniforms.Aspect, width / height);
        gl.uniform1f(uniforms.Near, stand.near);
        gl.uniform3fv(uniforms.Right, right);
        gl.uniform3fv(uniforms.Up, up);
        gl.uniform3fv(uniforms.Back, back);

        gl.bindBuffer(gl.ARRAY_BUFFER, bahnPuffer);
        gl.vertexAttribPointer(point, 3, gl.FLOAT, false, 0, 0);
        gl.uniform3fv(uniforms.Color, [0, 0, 0]);
        gl.uniform1f(uniforms.Emission, 1);
        const px = scale / width;
        const py = scale / height;
        const linienOffset = [[0, 0], [px, 0], [-px, 0], [0, py], [0, -py]];
        for (const { position, radius, farbe, bahn } of sammleUmlaufbahnen(editor.objekte)) {
            let puffer = bahnPuffer;
            let anzahl = kreisPunkte.length / 3;
            if (bahn) {
                if (!ellipsen.has(bahn)) {
                    const punkte = bahnPunkte(bahn);
                    puffer = gl.createBuffer();
                    gl.bindBuffer(gl.ARRAY_BUFFER, puffer);
                    gl.bufferData(gl.ARRAY_BUFFER, punkte, gl.STATIC_DRAW);
                    ellipsen.set(bahn, { puffer, anzahl: punkte.length / 3 });
                }
                ({ puffer, anzahl } = ellipsen.get(bahn));
            }
            gl.bindBuffer(gl.ARRAY_BUFFER, puffer);
            gl.vertexAttribPointer(point, 3, gl.FLOAT, false, 0, 0);
            gl.uniform3fv(uniforms.Center, relativ(position));
            gl.uniform1f(uniforms.Radius, radius);
            gl.uniform3fv(uniforms.EmissionColor, farbe);
            for (const [x, y] of linienOffset) {
                gl.uniform2f(uniforms.LinienOffset, x, y);
                gl.drawArrays(gl.LINE_LOOP, 0, anzahl);
            }
        }

        gl.uniform2f(uniforms.LinienOffset, 0, 0);
        const steine = sammleAsteroiden(editor.objekte, editor.alleObjekte, tage);
        if (steine.length) {
            gl.bindBuffer(gl.ARRAY_BUFFER, steinPuffer);
            gl.vertexAttribPointer(point, 3, gl.FLOAT, false, 0, 0);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, steinIndex);
            gl.uniform1f(uniforms.Emission, 0);
            for (const brocken of steine) {
                const { position, farbe } = brocken;
                const nah = relativ(position);
                gl.uniform3fv(uniforms.Center, nah);
                gl.uniform1f(uniforms.Radius, sichtbarerSteinRadius(brocken, Math.hypot(...nah), height));
                gl.uniform3fv(uniforms.Color, farbe);
                gl.drawElements(gl.TRIANGLES, stein.indices.length, gl.UNSIGNED_SHORT, 0);
            }
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, kugelIndex);
        for (const objekt of editor.objekte) {
            const form = objektform(objekt);
            bindeForm(form);
            gl.vertexAttribPointer(point, 3, gl.FLOAT, false, 0, 0);
            const { radius, color } = objekt;
            const position = positionVon(objekt);
            gl.uniform3fv(uniforms.Center, relativ(position));
            gl.uniform1f(uniforms.Radius, radius);
            gl.uniform3fv(uniforms.Color, (objekt === editor.auswahl || editor.istMarkiert(objekt)) && form !== "schwarzes-loch"
                ? color.map(kanal => kanal * 0.55 + 0.45) : color);
            gl.uniform3fv(uniforms.EmissionColor, objekt.emissionsfarbe ?? color);
            gl.uniform1f(uniforms.Emission, objekt.emission ?? 0);
            gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
        }

        frame = requestAnimationFrame(zeichnen);
    }

    canvas.addEventListener("webglcontextlost", () => {
        cancelAnimationFrame(frame);
        status.hidden = false;
        reset.disabled = true;
    });
    frame = requestAnimationFrame(zeichnen);
    return true;
}
