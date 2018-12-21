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

//////////////////////////////////////////////////////////////////////////////////
//		add an object in the scene
//////////////////////////////////////////////////////////////////////////////////

// add a torus knot	
const cube_geometry = new THREE.CubeGeometry(0.3, 0.3, 0.3)
const cube_material = new THREE.MeshNormalMaterial({
  transparent: true,
  opacity: 0.7,
  side: THREE.DoubleSide
})
const cube_mesh = new THREE.Mesh(cube_geometry, cube_material)
// cube_mesh.position.y = cube_geometry.parameters.height / 15
cube_mesh.position.y = 1
scene.add(cube_mesh)

onRenderFcts.push(function (delta) {
  cube_mesh.position.y -= Math.PI * delta
  if (cube_mesh.position.y < -1) {
    cube_mesh.position.y  = 1
  }
  console.log(cube_mesh.position.x)
  
  cube_mesh.rotation.x += Math.PI * delta
  cube_mesh.rotation.y += Math.PI * delta
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
requestAnimationFrame(animate)

function animate(nowMsec) {
  // keep looping
  requestAnimationFrame(animate)
  // measure time
  lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60
  const deltaMsec = Math.min(200, nowMsec - lastTimeMsec)
  lastTimeMsec = nowMsec
  // call each update function
  onRenderFcts.forEach(function (onRenderFct) {
    onRenderFct(deltaMsec / 5000, nowMsec / 5000)
  })
}
