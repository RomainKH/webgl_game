import './css/style.styl'
import * as THREE from 'three'
import CameraControls from 'camera-controls'
import GLTFLoader from 'three-gltf-loader'
import sansTalking from './images/characters/talking.gif'
import imgHouseTex from './images/nav/house.png'
import imgHotelTex from './images/nav/hotel.png'
import imgFactoryTex from './images/nav/factory.png'
import imgNuclearTex from './images/nav/tank.png'
import imgTrashTex from './images/nav/trash.png'
import navArrow from './images/nav/arrow.png'
import textureP0 from './images/textures/texture0.png'
import textureMap0 from './images/textures/textureMap0.png'
import textureP1 from './images/textures/texture1.jpg'
import textureMap1 from './images/textures/textureMap1.png'
import textureP2 from './images/textures/texture2.png'
import textureMap2 from './images/textures/textureMap2.png'
import bgTexture from './images/textures/skyTexture.png'
const houseObj = 'models/house/scene.gltf'
const bigHouseObj = 'models/bigHouse/scene.gltf'
const forageObj = 'models/oilPump/scene.gltf'
const eObj = 'models/tank/scene.gltf'
CameraControls.install( { THREE: THREE } )

const body = document.querySelector('body')
const canvas = document.querySelector('canvas')
const screenMoney = body.querySelector('.dollarsCounter')
const screenPop = body.querySelector('.popCounter')
let money = 10000, popNb = 0

/**
 * Sizes
 */
const sizes = {}
sizes.width = window.innerWidth
sizes.height = window.innerHeight
window.addEventListener('resize', () => {
    //Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    //update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    //update
    renderer.setSize(sizes.width, sizes.height)
})
/**
 * Cursor
 */
const cursor = new THREE.Vector2()
window.addEventListener('mousemove', (event) =>
{
    cursor.x = ( event.clientX / window.innerWidth ) * 2 - 1
    cursor.y = - ( event.clientY / window.innerHeight ) * 2 + 1
})
/**
 * Nav
 */
const leftA = document.createElement('img')
leftA.src = navArrow
leftA.classList.add('leftA')
const rightA = document.createElement('img')
rightA.src = navArrow
rightA.classList.add('rightA')
body.appendChild(leftA)
body.appendChild(rightA)
const leftArrow = () => {
    if(solarSystem.position.x >= 0.1 && solarSystem.position.x <= 9) {
        solarSystem.position.x += 0.1
        window.requestAnimationFrame(leftArrow)
    }
    else if(solarSystem.position.x > -9.1 && solarSystem.position.x <= 0){
        solarSystem.position.x += 0.1
        window.requestAnimationFrame(leftArrow)
    }
    else if(solarSystem.position.x >= 0 && solarSystem.position.x <= 0.1){
        solarSystem.position.x = 0
    }
}
const rightArrow = () => {
    if(solarSystem.position.x >= 0.1 && solarSystem.position.x <= 9.1) {
        solarSystem.position.x -= 0.1
        window.requestAnimationFrame(rightArrow)
    }
    else if(solarSystem.position.x >= -9 && solarSystem.position.x <= 0){
        solarSystem.position.x -= 0.1
        window.requestAnimationFrame(rightArrow)
    }
    else if(solarSystem.position.x >= -0.1 && solarSystem.position.x <= 0.1){
        solarSystem.position.x = 0
    }
}
leftA.addEventListener('mousedown', () => {   
    leftArrow()
    setTimeout(function(){ leftA.style.zIndex = -1 }, 10)
    setTimeout(function(){ rightA.style.zIndex = -1 }, 10)
    setTimeout(function(){ choosePlanet.style.zIndex = -1 }, 10)
    setTimeout(function(){ leftA.style.zIndex = 1 }, 1700)
    setTimeout(function(){ rightA.style.zIndex = 1 }, 1700)
    setTimeout(function(){ choosePlanet.style.zIndex = 1 }, 1700)
})
rightA.addEventListener('mousedown', () => {   
    rightArrow()
    setTimeout(function(){ leftA.style.zIndex = -1 }, 10)
    setTimeout(function(){ rightA.style.zIndex = -1 }, 10)
    setTimeout(function(){ choosePlanet.style.zIndex = -1 }, 10)
    setTimeout(function(){ leftA.style.zIndex = 1 }, 1700)
    setTimeout(function(){ rightA.style.zIndex = 1 }, 1700)
    setTimeout(function(){ choosePlanet.style.zIndex = 1 }, 1700)
    
})
/**
 * Choose your planet button
 */
let wichPlanet
const choosePlanet = document.createElement('button')
const title = body.querySelector('h1')
body.appendChild(choosePlanet)
choosePlanet.innerHTML = 'Choose This Planet'
choosePlanet.classList.add('choose')
choosePlanet.addEventListener(('click'), () => {
    inMenu = false
    rightA.classList.add('addFadeout')
    leftA.classList.add('addFadeout')
    choosePlanet.classList.add('addFadeout')
    title.classList.add('addFadeout')
    if (solarSystem.position.x <= 9.1 && solarSystem.position.x >= 8.9) {wichPlanet = 0}
    else if (solarSystem.position.x <= 0.1 && solarSystem.position.x >= -0.1) {wichPlanet = 1}
    else{wichPlanet = 2}
    menuLoop()
    checkingUpdates()
    screenMoney.style.opacity = 1
    screenPop.style.opacity = 1
    setTimeout(function(){controlBar()}, 500)
    setTimeout(function(){removingStuff()}, 700)
    setTimeout(function(){buildMessage()}, 500)
})
/**
 * remove dom
 */
const removingStuff = () => {
    title.remove()
    rightA.remove()
    leftA.remove()
    choosePlanet.remove()
}
/**
 * Scene
 */
const scene = new THREE.Scene()

/**
 * OBJECT 3D LOADER
*/
const loader = new GLTFLoader()

/**
 * Solar System
 */
const solarSystem = new THREE.Object3D()
scene.add(solarSystem)
/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 5
scene.add(camera)
/**
 * Background
 */
const backgroundR = new THREE.Mesh(
    new THREE.BoxGeometry(400, 400, 400, 1, 1, 1),
    new THREE.MeshStandardMaterial({ map: new THREE.TextureLoader().load(bgTexture), side: THREE.BackSide })
)
backgroundR.position.z = -5
scene.add(backgroundR)
/**
 * Sphere
 */
const sphere0 = new THREE.Mesh(
    new THREE.SphereGeometry( 1.4, 20, 20),
    new THREE.MeshStandardMaterial( {
        map: new THREE.TextureLoader().load(textureP0),
        normalMap: new THREE.TextureLoader().load(textureMap0)
    } )
)
sphere0.position.x = -9
solarSystem.add(sphere0)

const sphere1 = new THREE.Mesh(
    new THREE.SphereGeometry( 1.4, 20, 20),
    new THREE.MeshStandardMaterial( {
        map: new THREE.TextureLoader().load(textureP1),
        normalMap: new THREE.TextureLoader().load(textureMap1)
    } )
)
sphere1.position.x = 0
solarSystem.add(sphere1)

const sphere2 = new THREE.Mesh(
    new THREE.SphereGeometry( 1.4, 20, 20),
    new THREE.MeshStandardMaterial( {
        map: new THREE.TextureLoader().load(textureP2),
        normalMap: new THREE.TextureLoader().load(textureMap2)
    } )
)
sphere2.position.x = 9
solarSystem.add(sphere2)
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer()
renderer.setPixelRatio( window.devicePixelRatio )
renderer.setSize(sizes.width, sizes.height)
body.appendChild(renderer.domElement)
/**
 * Loop Render
 */
let inMenu = true
const clock = new THREE.Clock()
const cameraControls = new CameraControls( camera, body )
const loop = () =>
{
    window.requestAnimationFrame(loop)
    if (inMenu == true) {
        // Update mesh
        sphere0.rotation.y += 0.002
        sphere1.rotation.y += 0.002
        sphere2.rotation.y += 0.002

        // Update camera
        camera.position.x = - cursor.x * 0.5
        camera.position.y = cursor.y * 0.5
        camera.lookAt(scene.position)     
    }
    else{
        const delta = clock.getDelta()
        const hasControlsUpdated = cameraControls.update(delta)
        cameraControls.dollySpeed = 0.08
        cameraControls.setTarget(0.5,1,-2)
    }
    // Render
    renderer.render( scene, camera )   
}
loop()
/**
 * Menu Transition
 */
const menuLoop = () => {
    window.requestAnimationFrame(menuLoop)
    if(solarSystem.position.z >= 0 && solarSystem.position.z <= 12){
        solarSystem.position.z += 0.2
        setTimeout(function(){ solarSystem.position.z += 50 }, 500)
    }
}
/**
 * adding chunks
 */
const chunksGrid = new THREE.Object3D()
scene.add(chunksGrid)

/**
 * Create Creative Field
 */
let tabPositionBuilding = new Array()
let tabElementBuilding = new Array()
let mapTexture
let normalMap
const createField = () => {
    for (let i = 0; i < 66; i++) {tabElementBuilding.push(0)}
    if (wichPlanet == 0) {
        mapTexture = new THREE.TextureLoader().load(textureP0)
        normalMap = new THREE.TextureLoader().load(textureMap0)
    }
    else if (wichPlanet == 1) {
        mapTexture = new THREE.TextureLoader().load(textureP1)
        normalMap = new THREE.TextureLoader().load(textureMap1)
    }
    else {
        mapTexture = new THREE.TextureLoader().load(textureP2)
        normalMap = new THREE.TextureLoader().load(textureMap2)
    }
    
    /**
    * Creative Map
    */
    const creativeMap = new THREE.Object3D()
    scene.add(creativeMap)
    const mapPlanet = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 15),
        new THREE.MeshStandardMaterial({ map: mapTexture, side: THREE.DoubleSide, normalMap: normalMap })
    )
    mapPlanet.position.z = -2
    mapPlanet.position.y = -10
    mapPlanet.rotation.x = 1.57
    creativeMap.add(mapPlanet)
    for (let j = -4.5; j < 1; j++) {
        for (let i = -5; i < 6; i++) {
            const chunk = new THREE.Mesh(
                new THREE.PlaneGeometry(1, 1, 0, 0),
                new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.BackSide, wireframe: true})
            )
            chunk.rotation.x = 1.57
            chunk.position.y = -9.99
            chunk.position.x = i
            chunk.position.z = j
            chunksGrid.add(chunk)
            tabPositionBuilding.push({x: chunk.position.x, z: chunk.position.z})
        }
    }
    over3D()
    const animMap = () => {
        window.requestAnimationFrame(animMap)
        if (mapPlanet.position.y >= -10 && mapPlanet.position.y <= -1) {
            mapPlanet.position.y += 0.1
            chunksGrid.position.y += 0.1
        }
    }
    animMap()
}

/**
 * Generated Block Object
 */
const blockGrid = new THREE.Object3D()
scene.add(blockGrid)

/**
 * raycasting three.js
 */
let lastObject = new Array()
let lastObjectPos = {x: null, z:null}
let onOffClick = false
let over3D = () => {
    let raycaster = new THREE.Raycaster()
    // update the picking ray with the camera and mouse position
    window.requestAnimationFrame(over3D)
    raycaster.setFromCamera( cursor, camera )
    // calculate objects intersecting the picking ray
    let intersects = raycaster.intersectObjects( chunksGrid.children )
    if(intersects.length > 0){
        lastObject.push(intersects[0].object)
        intersects[0].object.material.color.set(0xff0000)
        lastObjectPos.z = intersects[0].object.position.z
        lastObjectPos.x = intersects[0].object.position.x
        body.style.cursor = 'pointer'
    }
    else if(lastObject[0] == null){}
    else{
        lastObject[0].material.color.set(0xffffff)
        lastObject.splice(0,lastObject.length)
        lastObjectPos.z = null
        lastObjectPos.x = null
        body.style.cursor = 'default'
    }
    for (let i = 0; i < lastObject.length; i++) {
        if(lastObject[0] == null){}
        else if(lastObject[0] != intersects[0].object){
            lastObject[0].material.color.set(0xffffff)
            lastObject.splice(0,1)
            lastObjectPos.z = null
            lastObjectPos.x = null
            body.style.cursor = 'default'
        }
    }
    if(intersects.length <= 0){
        for (let i = 0; i < chunksGrid.children.length; i++){
            chunksGrid.children[i].material.color.set(0xffffff)
            lastObjectPos.z = null
            lastObjectPos.x = null
            body.style.cursor = 'default'
        }
    }
    else if(lastObject[0] == intersects[0].object && lastObject[0] != null){
        window.addEventListener('mousedown', () => {
            var wichIsSelected
            var numberSelected
            wichIsSelected = document.querySelector('.selected')
            for (let i = 0; i < 5; i++) {
                if (wichIsSelected != null && wichIsSelected.classList.contains(`button${i}`) == true) {
                    numberSelected = i
                }
            }
            let deleteMode = false
            var objectModel
            var yPos
            var scaleObj
            let moneyToLoose = 0
            if (numberSelected == 0 && money >= 250) {
                moneyToLoose = 250
                objectModel = houseObj
                yPos = -0.87
                scaleObj = 0.009
            }
            else if (numberSelected == 1 && money >= 700) {
                moneyToLoose = 700
                objectModel = bigHouseObj
                yPos = -0.87
                scaleObj = 0.043
            }
            else if (numberSelected == 2 && money >= 450) {
                moneyToLoose = 450
                objectModel = forageObj
                yPos = -0.9
                scaleObj = 0.002
            }
            else if (numberSelected == 3 && money >= 1050) {
                moneyToLoose = 1050
                objectModel = eObj
                yPos = -0.44
                scaleObj = 0.0005
            }
            else if (numberSelected == 4 && money >= 20) {
                moneyToLoose = 20
                deleteMode = true
            }
            else {
                onOffClick = true
            }

            // detect if you have enough money in the bank
            if (onOffClick == false && intersects.length > 0 && lastObjectPos.z != null && lastObjectPos.x != null && deleteMode == false) {
                onOffClick = true
                loader.load(
                    objectModel,
                    ( gltf ) => {
                        gltf.scene.children[0].position.z = lastObjectPos.z
                        gltf.scene.children[0].position.x = lastObjectPos.x
                        gltf.scene.children[0].position.y = yPos
                        gltf.scene.children[0].scale.x = gltf.scene.children[0].scale.y = gltf.scene.children[0].scale.z = scaleObj
                        for (let i = 0; i < tabPositionBuilding.length; i++) {
                          if (tabPositionBuilding[i].x == lastObjectPos.x && tabPositionBuilding[i].z == lastObjectPos.z) {
                              if (tabElementBuilding[i] >= 1) {}
                              else{
                                if (numberSelected == 0) {
                                    tabElementBuilding[i] = 1
                                    money -= moneyToLoose
                                }
                                else if (numberSelected == 1) {
                                    tabElementBuilding[i] = 2
                                    money -= moneyToLoose
                                }
                                else if (numberSelected == 2) {
                                    tabElementBuilding[i] = 3
                                    money -= moneyToLoose
                                }
                                else if (numberSelected == 3) {
                                    tabElementBuilding[i] = 4
                                    money -= moneyToLoose
                                }
                                blockGrid.add(gltf.scene.children[0])
                              }
                          }
                        }
                    }
                )
            }
            else if (deleteMode == true && onOffClick == false){
                money -= moneyToLoose
                let posToDelete = {x:0,z:0}
                onOffClick = true
                let indexOfBlockToDelete = new Array()
                for (let j = 0; j < tabPositionBuilding.length; j++) {
                    for (let k = 0; k < blockGrid.children.length; k++) {
                        if (tabPositionBuilding[j].x == blockGrid.children[k].position.x && tabPositionBuilding[j].z == blockGrid.children[k].position.z) {
                            indexOfBlockToDelete.push(j)
                        }
                    }
                }
                for (let i = 0; i < blockGrid.children.length; i++) {
                    if (blockGrid.children[i].position.x == lastObjectPos.x && blockGrid.children[i].position.z == lastObjectPos.z){
                        posToDelete.x = blockGrid.children[i].position.x
                        posToDelete.z = blockGrid.children[i].position.z
                        blockGrid.remove(blockGrid.children[i])
                        for (let j = 0; j < tabPositionBuilding.length; j++) {
                            if (posToDelete.x == tabPositionBuilding[j].x && posToDelete.z == tabPositionBuilding[j].z) {
                                tabElementBuilding[j] = 0
                            }
                        }
                    }
                }
            }
            else{
                setTimeout(function(){ onOffClick = false }, 100)
            }

        } )
    }
}

/**
 * Add Buildings
 */
const controlBar = () => {
    scene.remove(solarSystem)
    const controlPannel = document.createElement('div')
    controlPannel.classList.add('controlPannel')
    body.appendChild(controlPannel)
    const smallContainer = document.createElement('div')
    const houseBuilding = document.createElement('button')
    const imgHouse = document.createElement('img')
    imgHouse.src = imgHouseTex
    houseBuilding.appendChild(imgHouse)
    const bigHouseBuilding = document.createElement('button')
    const imgBigHouse = document.createElement('img')
    imgBigHouse.src = imgHotelTex
    bigHouseBuilding.appendChild(imgBigHouse)
    const factoryBuilding = document.createElement('button')
    const imgFactory = document.createElement('img')
    imgFactory.src = imgFactoryTex
    factoryBuilding.appendChild(imgFactory)
    const bigFactoryBuilding = document.createElement('button')
    const imgNuclear = document.createElement('img')
    imgNuclear.src = imgNuclearTex
    bigFactoryBuilding.appendChild(imgNuclear)
    const destroy = document.createElement('button')
    const imgTrash = document.createElement('img')
    imgTrash.src = imgTrashTex
    destroy.appendChild(imgTrash)
    smallContainer.classList.add('buttonContainer')
    factoryBuilding.classList.add('controlPannelButtons')
    houseBuilding.classList.add('controlPannelButtons')
    bigFactoryBuilding.classList.add('controlPannelButtons')
    bigHouseBuilding.classList.add('controlPannelButtons')
    destroy.classList.add('controlPannelButtons')

    houseBuilding.classList.add('button0')
    bigHouseBuilding.classList.add('button1')
    factoryBuilding.classList.add('button2')
    bigFactoryBuilding.classList.add('button3')
    destroy.classList.add('button4')
    controlPannel.appendChild(smallContainer)
    smallContainer.appendChild(houseBuilding)
    smallContainer.appendChild(bigHouseBuilding)
    smallContainer.appendChild(factoryBuilding)
    smallContainer.appendChild(bigFactoryBuilding)
    smallContainer.appendChild(destroy)

    for (let i = 0; i < smallContainer.childNodes.length; i++) {
        smallContainer.childNodes[i].addEventListener('click', () => {
            smallContainer.childNodes[0].classList.remove('selected')
            smallContainer.childNodes[1].classList.remove('selected')
            smallContainer.childNodes[2].classList.remove('selected')
            smallContainer.childNodes[3].classList.remove('selected')
            smallContainer.childNodes[4].classList.remove('selected')
            smallContainer.childNodes[i].classList.add('selected')
        })    
    }
    for (let i = 0; i < smallContainer.childNodes.length; i++) {
        const info = document.createElement(`div`)
        info.classList.add(`info${i}`)
        smallContainer.childNodes[i].appendChild(info)
        const title = document.createElement('h2')
        if (i == 0) {
            title.innerHTML = 'House'
        }
        else if(i == 1) {
            title.innerHTML = 'Big House'
        }
        else if(i == 2) {
            title.innerHTML = 'Drilling'
        }
        else if(i == 3) {
            title.innerHTML = 'Oil Tank'
        }
        else if(i == 4) {
            title.innerHTML = 'Destruction'
        }
        info.appendChild(title)

        const para = document.createElement('p')
        if (i == 0) {
            para.innerHTML = 'It is a simple house to stocks peoples up in it</br></br><strong>250$</strong>'
        }
        else if(i == 1) {
            para.innerHTML = "Basically it's just like a simple house but bigger and fancier </br></br><strong>700$</strong>"
        }
        else if(i == 2) {
            para.innerHTML = 'The ground seems full of oil and other rare ressources, by buying this you can become really fast the king of the oil </br></br><strong>450$</strong>'
        }
        else if(i == 3) {
            para.innerHTML = "So you can sell more oil, buy this tank to get much more money</br></br><strong>1050$</strong>"
        }
        else if(i == 4) {
            para.innerHTML = 'Wipe everything you want on the map in exchange of money </br></br><strong>20$ per case</strong>'
        }
        info.appendChild(para)
    }
    
}

/**
 * Lights
 */

const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

const sunLight = new THREE.DirectionalLight(0xffcccc, 0.6)
sunLight.castShadow = true
sunLight.position.x = -2
sunLight.position.y = 5 
sunLight.position.z = -1
scene.add(sunLight)


/**
 * Update Money + Population
 */
const moneyC = body.querySelector('.dollarsCounter p')
const pop = body.querySelector('.popCounter p')
let nbHouses, nbBigHouses
let popDuplication = 0
const checkingUpdates = () => {
    setTimeout(function(){window.webkitRequestAnimationFrame(checkingUpdates)}, 5000)
    let houses = 0
    let bigHouses = 0
    let forages = 0
    let tank = 0
    for (let i = 0; i < tabElementBuilding.length; i++) {
        if (tabElementBuilding[i] == 1) {
            houses++
        }
        else if (tabElementBuilding[i] == 2) {
            bigHouses++
        }
        else if (tabElementBuilding[i] == 3) {
            forages++
        }
        else if (tabElementBuilding[i] == 4) {
            tank++
        }
    }
    // population counter
    
    if (isNaN(popDuplication) || popDuplication < 0) {
        popDuplication = 0
    }
    else if(popDuplication > 0) {
        var rand = Math.round(Math.random())
        if (rand >= 1) {
            popDuplication -= 0.6
        }
    }

    if (houses < nbHouses) {
        var diff = houses - nbHouses
        popNb -= diff * 5
    }
    else if (houses > nbHouses) {
        var diff = houses - nbHouses
        let proba = 0
        for (let j = 0; j <= diff; j++) {
            proba = Math.random()
            popDuplication += proba
        }
    }
    else if (bigHouses < nbBigHouses) {
        var diff = bigHouses - nbBigHouses
        popNb = popNb + (Math.round(diff * Math.random())*2)
        popDuplication = popDuplication + (Math.round(diff * Math.random()* 3))
    }
    nbHouses = houses
    if (bigHouses > nbBigHouses) {
        var diff = bigHouses - nbBigHouses
        let multi = 0
        for (let j = 0; j <= diff; j++) {
            multi = Math.random()*3
            popDuplication += multi
        }
    }
    else if (bigHouses < nbBigHouses) {
        var diff = bigHouses - nbBigHouses
        popNb = popNb + Math.round(diff * Math.random()*3)
        popDuplication = popDuplication + Math.round(diff * Math.random()*4)
    }
    nbBigHouses = bigHouses
    popNb += popDuplication
    if (bigHouses == 0 && houses == 0) {
        popNb = 0
    }
    if (popNb < 0) {
        popNb = 0
    }

    // update money
    if (forages > 0) {
        money += popNb * forages * 0.5
        if (bigHouses > 10 || houses > 25) {
            popNb += forages * Math.random() * 2
        }
    }
    if (tank > 0 && forages > 0) {
        money += tank * forages
    }
    if (tank == 1 && forages > 0) {
        money += tank * forages * 1.5
    }
    pop.innerHTML = Math.round(popNb)
    moneyC.innerHTML = Math.round(money)
}

// pop up story

const buildMessage = () => {
    const popUpMessage = document.createElement('div')
    const greyBg = document.createElement('div')
    const story = document.createElement('p')
    const talkingGuy = document.createElement('img')
    talkingGuy.src = sansTalking
    body.appendChild(greyBg)
    greyBg.appendChild(popUpMessage)
    popUpMessage.appendChild(talkingGuy)
    popUpMessage.appendChild(story)
    greyBg.classList.add('bg')
    popUpMessage.classList.add('message')
    story.innerHTML = 'Hello there, you are here to become rich and exploit hundreds and hundreds of peoples, so in order to do it, the guy behind his screen told me to explain you how this game is working. First, you need to create houses to make peoples come to your planet, then build drill to exploit the oil from the ground. Also you can see the money you have in bank on the top left and besides it the number of peoples in your city. To move your camera and see your empire from a better angle, you can drag your mouse around and scroll to zoom-in or zoom-out, got it ?'
    const buttonOk = document.createElement('button')
    popUpMessage.appendChild(buttonOk)
    buttonOk.innerHTML = 'ok'
    buttonOk.addEventListener('click', () => {
        greyBg.remove()
        createField()
        bgBuilder()
    })
} 

// create background for peoples & dollars counters
const bgBuilder = () => {
    const bgPopDoll = document.createElement('div')
    bgPopDoll.classList.add('bgPopDoll')
    body.appendChild(bgPopDoll)
}