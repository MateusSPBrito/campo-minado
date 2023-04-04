const tab = document.getElementById('tab')
let data = []
const numberBombs = 10
const resetBtn = document.querySelector('#reset')
let inGame = true
const bombsCont = document.querySelector('#bombs')
const time = document.querySelector('#time')
let started = false

resetBtn.addEventListener('click', () => reset())

const setTime = () => {
    if (inGame && started) {
        const cont = parseInt(time.innerText) + 1
        if (cont < 10) time.innerText = `00${cont}`
        else if (cont < 100) time.innerText = `0${cont}`
        else time.innerText = `${cont}`
    }
}

const generateData = () => {
    data = []
    for (let i = 0; i < 10; i++) {
        data.push([])
        for (let j = 0; j < 10; j++) {
            data[i].push({ bomb: false, flag: false, visible: false, value: 0 })
            let casa = document.createElement('div')
            casa.setAttribute('class', 'casa')
            casa.setAttribute('id', `i${i}j${j}`)
            tab.appendChild(casa)
            casa.addEventListener('click', () => clickCasa(i, j))
            casa.addEventListener('contextmenu', (event) => clickFlag(event, i, j))
        }
    }
    bombsCont.innerText = `0${numberBombs}`
    setBombs()
}

const setBombs = () => {
    for (let aux = 0; aux < numberBombs; aux++) {
        const i = Math.floor(Math.random() * 10)
        const j = Math.floor(Math.random() * 10)
        if (data[i][j].bomb == false) {
            data[i][j].bomb = true
            if (i < 9) data[i + 1][j].value++
            if (i > 0) data[i - 1][j].value++
            if (j < 9) data[i][j + 1].value++
            if (j > 0) data[i][j - 1].value++
            if (i > 0 && j < 9) data[i - 1][j + 1].value++
            if (i > 0 && j > 0) data[i - 1][j - 1].value++
            if (i < 9 && j < 9) data[i + 1][j + 1].value++
            if (i < 9 && j > 0) data[i + 1][j - 1].value++
        }
        else aux--
    }
}

const clickFlag = (event, i, j) => {
    event.preventDefault()
    if (data[i][j].visible == false && inGame) {
        const casa = document.getElementById(`i${i}j${j}`)
        if (data[i][j].flag == false) {
            let img = document.createElement('img')
            img.setAttribute('src', 'imgs/flag.png')
            img.setAttribute('width', '75%')
            img.setAttribute('id', `img-i${i}j${j}`)
            casa.appendChild(img)
            data[i][j].flag = true

            if (bombsCont.innerText > 0) {
                const cont = parseInt(bombsCont.innerText) - 1
                if (cont < 10) bombsCont.innerText = `00${cont}`
                else bombsCont.innerText = `0${cont}`
            }
        } else {
            let img = document.getElementById(`img-i${i}j${j}`)
            casa.removeChild(img)
            data[i][j].flag = false

            const cont = parseInt(bombsCont.innerText) + 1
            if (cont < 10) bombsCont.innerText = `00${cont}`
            else bombsCont.innerText = `0${cont}`
        }
        if (time.innerText == '000') started = true
    }
}

const clickCasa = (i, j) => {
    if (data[i][j].flag == false && data[i][j].visible == false && inGame) {
        const casa = document.getElementById(`i${i}j${j}`)
        if (data[i][j].bomb == true) {
            let img = document.createElement('img')
            img.setAttribute('src', 'imgs/bomb.png')
            img.setAttribute('width', '75%')
            casa.appendChild(img)
            casa.classList.add('visible')
            casa.classList.add('bomb')
            data[i][j].visible = true
            const emoji = document.querySelector('#emoji')
            emoji.setAttribute('src', './imgs/dead.png')
            inGame = false
        }
        else {
            if (data[i][j].value == 0) openVisibles(i, j)
            else setValue(i, j)
            check()
        }
        if (time.innerText == '000') started = true
    }
}

const check = () => {
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            if (data[i][j].bomb == false && data[i][j].visible == false) return
        }
    }
    winner()
}

const winner = () => {
    inGame = false
    const emoji = document.querySelector('#emoji')
    emoji.setAttribute('src', './imgs/winner.png')
}

const openVisibles = (i, j) => {
    const casa = document.querySelector(`#i${i}j${j}`)
    if (i > 9 || i < 0 || j > 9 || j < 0) return
    if (casa.classList.contains('visible')) return

    setValue(i, j)
    if (data[i][j].value > 0) return


    openVisibles(i, j + 1)
    openVisibles(i, j - 1)
    openVisibles(i + 1, j)
    openVisibles(i - 1, j)

    openVisibles(i + 1, j + 1)
    openVisibles(i + 1, j - 1)
    openVisibles(i - 1, j + 1)
    openVisibles(i - 1, j - 1)
}

const setValue = (i, j) => {
    if (!data[i][j].visible) {
        const casa = document.getElementById(`i${i}j${j}`)
        casa.classList.add('visible')
        data[i][j].visible = true

        if (data[i][j].value > 0) {
            const text = document.createTextNode(`${data[i][j].value}`)
            let p = document.createElement('p')
            p.classList.add('number')
            p.classList.add(`n${data[i][j].value}`)
            p.appendChild(text)
            casa.appendChild(p)
        }
    }
}

const reset = () => {
    const casas = document.querySelectorAll('.casa')
    casas.forEach((casa) => {
        casa.remove()
    })
    const emoji = document.querySelector('#emoji')
    emoji.setAttribute('src', './imgs/smile.png')
    inGame = true
    time.innerText = '000'
    started = false
    generateData()
}

generateData()
setInterval(() => { setTime() }, 1000)


