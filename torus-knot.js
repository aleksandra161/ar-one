//////////////////////////////////////////////////////////////////////////////////
//		Init
//////////////////////////////////////////////////////////////////////////////////

// init renderer
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
})
renderer.setClearColor(new THREE.Color('lightgrey'), 0)
renderer.setSize(640, 480)
renderer.domElement.style.position = 'absolute'
renderer.domElement.style.top = '0px'
renderer.domElement.style.left = '0px'
document.body.appendChild(renderer.domElement)

// array of functions for the rendering loop
const onRenderFcts = []

// init scene and camera
const scene = new THREE.Scene()

//////////////////////////////////////////////////////////////////////////////////
//		Initialize a basic camera
//////////////////////////////////////////////////////////////////////////////////

// Create a camera
const camera = new THREE.Camera()
scene.add(camera)

////////////////////////////////////////////////////////////////////////////////
//          handle arToolkitSource
////////////////////////////////////////////////////////////////////////////////

const arToolkitSource = new THREEx.ArToolkitSource({
  // to read from the webcam 
  sourceType: 'webcam',

  // // to read from an image
  // sourceType : 'image',
  // sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/images/img.jpg',		

  // to read from a video
  // sourceType : 'video',
  // sourceUrl : THREEx.ArToolkitContext.baseURL + '../data/videos/headtracking.mp4',		
})

arToolkitSource.init(function onReady() {
  onResize()
})

// handle resize
window.addEventListener('resize', function () {
  onResize()
})
function onResize() {
  arToolkitSource.onResize()
  arToolkitSource.copySizeTo(renderer.domElement)
  if (arToolkitContext.arController !== null) {
    arToolkitSource.copySizeTo(arToolkitContext.arController.canvas)
  }
}
////////////////////////////////////////////////////////////////////////////////
//          initialize arToolkitContext
////////////////////////////////////////////////////////////////////////////////


// create atToolkitContext
const arToolkitContext = new THREEx.ArToolkitContext({
  cameraParametersUrl: THREEx.ArToolkitContext.baseURL + '../data/data/camera_para.dat',
  detectionMode: 'mono',
})
// initialize it
arToolkitContext.init(function onCompleted() {
  // copy projection matrix to camera
  camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix())
})

// update artoolkit on every frame
onRenderFcts.push(function () {
  if (arToolkitSource.ready === false) return

  arToolkitContext.update(arToolkitSource.domElement)

  // update scene.visible if the marker is seen
  scene.visible = camera.visible
})

////////////////////////////////////////////////////////////////////////////////
//          Create a ArMarkerControls
////////////////////////////////////////////////////////////////////////////////

// init controls for camera
const markerControls = new THREEx.ArMarkerControls(arToolkitContext, camera, {
  type: 'pattern',
  patternUrl: THREEx.ArToolkitContext.baseURL + '../data/data/patt.hiro',
  // patternUrl : THREEx.ArToolkitContext.baseURL + '../data/data/patt.kanji',
  // as we controls the camera, set changeMatrixMode: 'cameraTransformMatrix'
  changeMatrixMode: 'cameraTransformMatrix'
})
// as we do changeMatrixMode: 'cameraTransformMatrix', start with invisible scene
scene.visible = false

//////////////////////////////////////////////////////////////////////////////////
//		add an object in the scene
//////////////////////////////////////////////////////////////////////////////////

// add a torus knot	
const cube_geometry = new THREE.CubeGeometry(1, 1, 1)
const cube_material = new THREE.MeshNormalMaterial({
  transparent: true,
  opacity: 0.5,
  side: THREE.DoubleSide
})
const cube_mesh = new THREE.Mesh(cube_geometry, cube_material)
cube_mesh.position.y = cube_geometry.parameters.height / 2
scene.add(cube_mesh)

const torus_geometry = new THREE.TorusKnotGeometry(0.3, 0.1, 64, 16)
const torus_material = new THREE.MeshNormalMaterial()
const torus_mesh = new THREE.Mesh(torus_geometry, torus_material)
torus_mesh.position.y = 0.5
scene.add(torus_mesh)

onRenderFcts.push(function (delta) {
  torus_mesh.rotation.x += Math.PI * delta
})

//////////////////////////////////////////////////////////////////////////////////
//		render the whole thing on the page
//////////////////////////////////////////////////////////////////////////////////

// render the scene
onRenderFcts.push(function () {
  renderer.render(scene, camera)
})

// run the rendering loop
let lastTimeMsec = null
requestAnimationFrame(function animate(nowMsec) {
  // keep looping
  requestAnimationFrame(animate)
  // measure time
  lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60
  const deltaMsec = Math.min(200, nowMsec - lastTimeMsec)
  lastTimeMsec = nowMsec
  // call each update function
  onRenderFcts.forEach(function (onRenderFct) {
    onRenderFct(deltaMsec / 1000, nowMsec / 1000)
  })
})