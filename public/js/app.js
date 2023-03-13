//DOM 
const datos = document.getElementById('datos')
const fragmentDatos = document.createDocumentFragment()
const templateDatos = document.getElementById('templateDatos').content
/* const templateError = document.getElementById('templateError').content */

//Retorna TODAS las mascotas
const pintarDatos = async (data) => {
    try {
        while (datos.firstChild) {
            datos.removeChild(datos.firstChild);
        }

        data.map(item => {
            let t1 = templateDatos.getElementById('1')
            let t2 = templateDatos.getElementById('2')
            let t3 = templateDatos.getElementById('3')
            let t4 = templateDatos.getElementById('4')
            let t5 = templateDatos.getElementById('5')
            t1.textContent = item.nombre
            t3.textContent = `${item.pib_2019}`
            t4.textContent = `${item.pib_2020}`
            t5.textContent = `${item.diferencia}`

            const clone = templateDatos.cloneNode(true)
            fragmentDatos.appendChild(clone)
        })
        datos.appendChild(fragmentDatos)
    } catch (error) {
        console.log(error)
    }
}

function pintarAscendente() {
    const btn = document.getElementById('btnRenderGrowing')
    btn.addEventListener('click', async () => {
        const response = await axios.get('http://localhost:3000/creciendo')
        const data = response.data
        pintarDatos(data)
    })

}
pintarAscendente()
function pintarDescendente() {
    const btn = document.getElementById('btnRenderDescending')
    btn.addEventListener('click', async () => {
        const response = await axios.get('http://localhost:3000/decreciendo')
        const data = response.data
        pintarDatos(data)
    })
}
pintarDescendente()
function pintarTodos() {
    const btn = document.getElementById('btnRenderAll')
    btn.addEventListener('click', async () => {
        const response = await axios.get('http://localhost:3000/all')
        const data = response.data
        pintarDatos(data)
    })
}
pintarDescendente()
function pintarPorNumero() {
    const btn = document.getElementById('btnSearch')

    btn.addEventListener('click', async () => {
        const pib = document.querySelector('#idModify').value
        const response = await axios.get(`http://localhost:3000/${pib}`)
        const data = response.data
        /* console.log(data) */
        pintarDatos(data)
    })
}
pintarPorNumero()
function agregarPais() {
    const btn = document.getElementById('btnAdd')
    btn.addEventListener('click', async () => {
        const name = document.querySelector('#nameModify').value
        console.log(name)
        const pib2019 = document.querySelector('#Modify2019').value
        console.log(pib2019)
        const pib2020 = document.querySelector('#Modify2020').value
        const response = await axios.post(`http://localhost:3000/add/${name}/${pib2019}/${pib2020}`)
        console.log(response)
    })
}
agregarPais()
function eliminarPais() {
    const btn = document.getElementById('btnDelete')
    btn.addEventListener('click', async () => {
        const name = document.querySelector('#idDelete').value
        const response = await axios.delete(`http://localhost:3000/${name}`)
        console.log(response)
    })
}
eliminarPais()
pintarTodos()
