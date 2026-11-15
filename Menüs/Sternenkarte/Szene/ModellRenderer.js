import * as THREE from "three";
import { Line2 } from "three/addons/lines/Line2.js";
import { LineGeometry } from "three/addons/lines/LineGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { bahnPunkte, positionVon } from "../Sternsysteme/Bahnphysik.js";
import { sammleAsteroiden } from "../Sternsysteme/Asteroidenguertel.js";
import { formePunkt, objektform } from "./Objektformen.js";
import { kreisPunkte, sammleUmlaufbahnen } from "../Sternsysteme/Umlaufbahnen.js";
import { modellURL, parseModell } from "../../adapter/Sternenkarte/3D-Modelle/3D-Modelle.js";

export function bereiteModellVor(modell) {
    const bounds = new THREE.Box3().setFromObject(modell);
    const sphere = bounds.getBoundingSphere(new THREE.Sphere());
    if (!Number.isFinite(sphere.radius) || sphere.radius <= 0 || bounds.isEmpty()) {
        throw new Error("Das Modell enthält keine darstellbare Geometrie.");
    }
    const zentriert = new THREE.Group();
    zentriert.add(modell);
    zentriert.position.copy(sphere.center).negate();
    const normiert = new THREE.Group();
    normiert.add(zentriert);
    normiert.scale.setScalar(1 / sphere.radius);
    modell.traverse(node => { node.frustumCulled = false; });
    return normiert;
}

export function erzeugeModellRenderer(canvas, meldeFehler) {
    const ebene = document.createElement("canvas");
    ebene.className = "map-model-canvas";
    ebene.setAttribute("aria-hidden", "true");
    ebene.hidden = true;
    const renderer = new THREE.WebGLRenderer({ canvas: ebene, antialias: true, logarithmicDepthBuffer: true });
    canvas.after(ebene);
    const scene = new THREE.Scene();
    scene.background = new THREE.Color().setRGB(0.025, 0.047, 0.075, THREE.SRGBColorSpace);
    const light = new THREE.DirectionalLight(0xffffff, 2.1);
    light.position.set(-4, 7, 8);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x394257, 1.7), light);
    const kamera = new THREE.PerspectiveCamera(45, 1, 0.04, 400);
    const basis = new THREE.Matrix4();
    const right = new THREE.Vector3(), up = new THREE.Vector3(), back = new THREE.Vector3();
    const formen = new Map();
    function geometrieFuer(form) {
        if (!formen.has(form)) {
            const geometrie = new THREE.SphereGeometry(1, 32, 20);
            if (form !== "kugel") {
                const position = geometrie.getAttribute("position");
                for (let i = 0; i < position.count; i++) {
                    position.setXYZ(i, ...formePunkt(form, position.getX(i), position.getY(i), position.getZ(i)));
                }
                geometrie.computeVertexNormals();
            }
            formen.set(form, geometrie);
        }
        return formen.get(form);
    }
    const knoten = new Map();
    function geschlosseneLinie(punkte) {
        const geschlossen = new Float32Array(punkte.length + 3);
        geschlossen.set(punkte);
        geschlossen.set(punkte.subarray(0, 3), punkte.length);
        return new LineGeometry().setPositions(geschlossen);
    }
    const kreisGeometrie = geschlosseneLinie(kreisPunkte);
    const bahnlinien = [];
    const bahngeometrien = new WeakMap();
    const steinMaterial = new THREE.MeshStandardMaterial({ flatShading: true });
    const steinMatrix = new THREE.Object3D();
    const steinFarbe = new THREE.Color();
    let steineMesh;
    let steinKapazitaet = 0;

    function zeichneGuertel(objekte, alleObjekte, tage) {
        const steine = sammleAsteroiden(objekte, alleObjekte, tage);
        if (!steine.length) {
            if (steineMesh) steineMesh.count = 0;
            return;
        }
        if (!steineMesh || steinKapazitaet < steine.length) {
            if (steineMesh) {
                scene.remove(steineMesh);
                steineMesh.dispose();
            }
            steinKapazitaet = steine.length;
            steineMesh = new THREE.InstancedMesh(geometrieFuer("brocken"), steinMaterial, steinKapazitaet);
            steineMesh.frustumCulled = false;
            scene.add(steineMesh);
        }
        steineMesh.count = steine.length;
        steine.forEach(({ position, radius, farbe, winkel }, index) => {
            steinMatrix.position.set(...position);
            steinMatrix.rotation.set(winkel * 2, winkel, 0);
            steinMatrix.scale.setScalar(radius);
            steinMatrix.updateMatrix();
            steineMesh.setMatrixAt(index, steinMatrix.matrix);
            steinFarbe.setRGB(...farbe, THREE.SRGBColorSpace);
            steineMesh.setColorAt(index, steinFarbe);
        });
        steineMesh.instanceMatrix.needsUpdate = true;
        steineMesh.instanceColor.needsUpdate = true;
    }
    const vorbereitet = new Map();
    let breite = 0, hoehe = 0;

    function fuelleModell(eintrag, modell) {
        eintrag.gruppe.add(modell);
        eintrag.kugel.visible = false;
    }

    function fuegeHinzu(objekt) {
        const gruppe = new THREE.Group();
        const kugel = new THREE.Mesh(geometrieFuer(objektform(objekt)), new THREE.MeshStandardMaterial());
        kugel.frustumCulled = false;
        gruppe.add(kugel);
        scene.add(gruppe);
        const eintrag = { gruppe, kugel };
        knoten.set(objekt, eintrag);
        if (!objekt.modell) return eintrag;
        const lokal = vorbereitet.get(objekt.modell);
        if (lokal) {
            vorbereitet.delete(objekt.modell);
            fuelleModell(eintrag, lokal);
        } else {
            (async () => {
                const response = await fetch(modellURL(objekt.modell));
                if (!response.ok) throw new Error("Modelldatei nicht gefunden.");
                const datei = new File([await response.blob()], objekt.modell);
                const modell = bereiteModellVor(await parseModell(datei));
                if (knoten.get(objekt) === eintrag) fuelleModell(eintrag, modell);
                else entsorgeModell(modell);
            })().catch(error => meldeFehler(objekt.name + ": " + error.message));
        }
        return eintrag;
    }

    function entsorgeModell(gruppe) {
        const ressourcen = new Set();
        gruppe.traverse(node => {
            if (node.geometry && ![...formen.values()].includes(node.geometry)) ressourcen.add(node.geometry);
            for (const material of [node.material].flat().filter(Boolean)) {
                ressourcen.add(material);
                for (const wert of Object.values(material)) {
                    if (wert?.isTexture) ressourcen.add(wert);
                }
            }
        });
        for (const ressource of ressourcen) ressource.dispose();
    }

    return {
        vorbereiten: (dateiname, modell) => vorbereitet.set(dateiname, modell),
        verwerfeVorbereitung(dateiname) {
            const modell = vorbereitet.get(dateiname);
            if (modell) entsorgeModell(modell);
            vorbereitet.delete(dateiname);
        },
        zeichnen(stand, width, height, editor, tage) {
            const aktiv = editor.objekte.some(objekt => objekt.modell);
            ebene.hidden = !aktiv;
            const vorhanden = new Set(aktiv ? editor.objekte : []);
            for (const [objekt, { gruppe }] of knoten) {
                if (vorhanden.has(objekt)) continue;
                scene.remove(gruppe);
                entsorgeModell(gruppe);
                knoten.delete(objekt);
            }
            if (!aktiv) return false;
            if (breite !== width || hoehe !== height) {
                renderer.setSize(width, height, false);
                breite = width;
                hoehe = height;
            }
            kamera.aspect = width / height;
            kamera.near = stand.near;
            kamera.far = Math.max(400, stand.near * 1e6);
            kamera.updateProjectionMatrix();
            kamera.position.set(...stand.eye);
            basis.makeBasis(right.set(...stand.right), up.set(...stand.up), back.set(...stand.back));
            kamera.quaternion.setFromRotationMatrix(basis);
            for (const objekt of vorhanden) {
                const { gruppe, kugel } = knoten.get(objekt) ?? fuegeHinzu(objekt);
                gruppe.position.set(...positionVon(objekt));
                gruppe.scale.setScalar(objekt.radius);
                const form = objektform(objekt);
                kugel.geometry = geometrieFuer(form);
                const color = (objekt === editor.auswahl || editor.istMarkiert(objekt)) && form !== "schwarzes-loch" ? objekt.color.map(kanal => kanal * 0.55 + 0.45) : objekt.color;
                kugel.material.color.setRGB(...color, THREE.SRGBColorSpace);
                kugel.material.emissive.setRGB(...(objekt.emissionsfarbe ?? objekt.color), THREE.SRGBColorSpace);
                kugel.material.emissiveIntensity = objekt.emission ?? 0;
            }
            const bahnen = sammleUmlaufbahnen(editor.objekte);
            bahnen.forEach(({ position, radius, farbe, bahn }, index) => {
                if (!bahnlinien[index]) {
                    bahnlinien[index] = new Line2(kreisGeometrie, new LineMaterial({ linewidth: 1.65 }));
                    bahnlinien[index].frustumCulled = false;
                    scene.add(bahnlinien[index]);
                }
                const linie = bahnlinien[index];
                linie.visible = true;
                linie.material.linewidth = 1.65 * width / Math.max(1, canvas.clientWidth);
                if (bahn && !bahngeometrien.has(bahn)) {
                    bahngeometrien.set(bahn, geschlosseneLinie(bahnPunkte(bahn)));
                }
                linie.geometry = bahn ? bahngeometrien.get(bahn) : kreisGeometrie;
                linie.position.set(...position);
                linie.scale.setScalar(radius);
                linie.material.color.setRGB(...farbe, THREE.SRGBColorSpace);
            });
            for (let i = bahnen.length; i < bahnlinien.length; i++) bahnlinien[i].visible = false;
            zeichneGuertel(editor.objekte, editor.alleObjekte, tage);
            renderer.render(scene, kamera);
            return true;
        }
    };
}
