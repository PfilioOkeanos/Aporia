const cdn = "https://esm.sh/three@0.180.0";
export async function loadModel(host, item, format) {
    if (format !== "fbx" && format !== "obj") {
        if (!customElements.get("model-viewer")) await import("https://cdn.jsdelivr.net/npm/@google/model-viewer@4.1.0/dist/model-viewer.min.js");
        const model = document.createElement("model-viewer");
        for (const [name, value] of Object.entries({ alt: item.title || "3D-Modell", "camera-controls": "", "touch-action": "pan-y", reveal: "auto", loading: "eager" })) model.setAttribute(name, value);
        host.append(model);
        await new Promise((resolve, reject) => {
            model.addEventListener("load", resolve, { once: true });
            model.addEventListener("error", reject, { once: true });
            model.src = item.url;
        });
        return {
            reset() {
                model.cameraOrbit = "auto auto auto";
                model.cameraTarget = "auto auto auto";
                model.fieldOfView = "auto";
                model.jumpCameraToGoal();
            },
            setVisible(visible) {
                model.style.visibility = visible ? "" : "hidden";
                if (!visible) model.pause();
            },
            dispose() { model.remove(); }
        };
    }
    const [T, { OrbitControls }, loader] = await Promise.all([
        import(cdn), import(cdn + "/examples/jsm/controls/OrbitControls.js"),
        import(cdn + "/examples/jsm/loaders/" + (format === "fbx" ? "FBXLoader" : "OBJLoader") + ".js")
    ]);
    const instance = format === "fbx" ? new loader.FBXLoader() : new loader.OBJLoader();
    if (format === "obj" && item.mtl) {
        const { MTLLoader } = await import(cdn + "/examples/jsm/loaders/MTLLoader.js");
        const materials = await new MTLLoader().loadAsync(new URL(item.mtl, item.url).href);
        materials.preload();
        instance.setMaterials(materials);
    }
    const object = await instance.loadAsync(item.url);
    const bounds = new T.Box3().setFromObject(object);
    if (bounds.isEmpty()) throw new Error("Das Modell enthält keine sichtbare Geometrie.");
    const sphere = bounds.getBoundingSphere(new T.Sphere());
    const radius = Math.max(sphere.radius, .001);
    const scene = new T.Scene();
    scene.add(object, new T.HemisphereLight(0xe6f4ff, 0x9f856b, 2.2));
    const lamp = new T.DirectionalLight(0xffffff, 2);
    lamp.position.set(3, 5, 4);
    scene.add(lamp);
    const renderer = new T.WebGLRenderer({ alpha:true, antialias:true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    const camera = new T.PerspectiveCamera(40, 1, radius / 1000, radius * 100);
    const canvas = renderer.domElement;
    canvas.tabIndex = 0;
    canvas.setAttribute("aria-label", "3D-Ansicht. Pfeiltasten drehen, Plus und Minus zoomen.");
    host.append(canvas);
    const orbit = new OrbitControls(camera, canvas);
    orbit.target.copy(sphere.center);
    camera.position.copy(sphere.center).addScaledVector(new T.Vector3(1,.45,1.4).normalize(), radius * 3.5);
    orbit.minDistance = radius * .3;
    orbit.maxDistance = radius * 18;
    orbit.enablePan = false;
    orbit.update();
    orbit.saveState();
    let visible = false;
    const draw = () => { if (visible) renderer.render(scene, camera); };
    function resize() {
        if (!visible) return;
        const width = host.clientWidth, height = host.clientHeight;
        if (!width || !height) return;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
        draw();
    }
    orbit.addEventListener("change", draw);
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    canvas.addEventListener("keydown", e => {
        const step = {ArrowLeft:-.15, ArrowRight:.15, ArrowUp:-.12, ArrowDown:.12, "+":.85, "-":1.18}[e.key];
        if (!step) return;
        e.preventDefault();
        const angles = new T.Spherical().setFromVector3(camera.position.clone().sub(orbit.target));
        if (e.key.startsWith("Arrow")) {
            if (e.key === "ArrowLeft" || e.key === "ArrowRight") angles.theta += step;
            else angles.phi += step;
        } else angles.radius *= step;
        camera.position.setFromSpherical(angles.makeSafe()).add(orbit.target);
        orbit.update();
        draw();
    });
    return {
        resize,
        setVisible(value) { visible = value; if (visible) resize(); },
        reset() { orbit.reset(); draw(); },
        dispose() {
            observer.disconnect();
            orbit.dispose();
            const resources = new Set();
            object.traverse(node => {
                if (node.geometry) resources.add(node.geometry);
                for (const material of [node.material].flat().filter(Boolean)) {
                    for (const value of Object.values(material)) if (value?.isTexture) resources.add(value);
                    resources.add(material);
                }
            });
            resources.forEach(resource => resource.dispose());
            renderer.dispose();
            canvas.remove();
        }
    };
}
