const express = require('express')
const app = express()
const cors = require('cors')
const { Pool } = require('pg')


app.use(cors())
const host = 'localhost'

app.use(express.static('public'))
const pool = new Pool({
    user: 'postgres',
    host: host,
    database: 'Practica',
    password: 'cerezasazules98',
    port: 5432
})


const getAll = {
    text: 'SELECT *, (pib_2019-pib_2020) as diferencia FROM paises_pib',
    values: []
}

const growing = {
    text: 'SELECT *, (pib_2019-pib_2020) as diferencia FROM paises_pib where (pib_2019-pib_2020)>0',
    values: []
}

const decreasing = {
    text: 'SELECT *, (pib_2019-pib_2020) as diferencia FROM paises_pib where (pib_2019-pib_2020)<0',
    values: []
}

app.get('/', (req, res) => {
    res.sendFile('/public/index.html')
})

app.get('/all', (req, res) => {
    pool.query(getAll, async (err, data_set) => {
        if (err) throw err
        await res.send(JSON.stringify(data_set.rows))
    })
})

app.get('/:option', (req, res) => {
    console.log(req.params.option)
    try {
        if (req.params.option == 'creciendo') {
            pool.query(growing, async (err, data_set) => {
                if (err) throw err
                await res.send(JSON.stringify(data_set.rows))
            })
        } else if (req.params.option == 'decreciendo') {
            pool.query(decreasing, async (err, data_set) => {
                if (err) throw err
                await res.send(JSON.stringify(data_set.rows))
            })
        } else {
            const number = {
                text: 'SELECT *, (pib_2019-pib_2020) as diferencia FROM paises_pib where $1<=pib_2020',
                values: [req.params.option]
            }
            pool.query(number, async (err, data_set) => {
                if (err) throw err
                await res.send(JSON.stringify(data_set.rows))
            })
        }
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})


app.post('/add/:country/:pib2019/:pib2020', (req, res) => {
    //http://localhost:3000/add/chile/5000/10000 ejemplo
    const newCountry = {
        text: "INSERT INTO paises_pib (nombre,pib_2019,pib_2020) VALUES ($1::text, $2::integer, $3::integer)",
        values: [req.params.country, parseInt(req.params.pib2019), parseInt(req.params.pib2020)]
    }
    try {
        pool.query(newCountry, async (err, data_set) => {
            if (err) throw err
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain')
            await res.send('Cliente agregado')
            await pool.query('COMMIT')
        })
    } catch (err) {
        return res.status(500).json({ message: error.message })
    }
})

app.delete('/:nombre', async (req, res) => {
    //http://localhost:3000/chile 
    const deleteCountry = {
        text: " delete from paises_pib where nombre=$1",
        values: [req.params.nombre]
    }
    pool.query(deleteCountry, async (err, data_set) => {
        try {
            if (err) throw err
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain')/* preguntar */
            await res.send('País eliminado')
        } catch {
            return res.status(500).json({ message: error.message })
        }
    })
})


app.listen(3000)
console.log(`Server on port 3000`)