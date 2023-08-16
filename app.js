const express = require('express')
const crypto = require('crypto')
const z = require('zod')
const MoviesJson = require('./movies.json')
const {validateMovie,validateParcialMovie} = require('./schemas/movies.js')


const app = express()
app.use(express.json())

app.get('/',(req,res) => {
    res.json({message : 'hola mundo'})
})

app.get('/movies1',(req,res) => {
    res.json(MoviesJson)

})

app.get('/movies',(req,res) => {
    const {genre} = req.query
    if (genre) {
        const filteredMovies = MoviesJson.filter(
            movie => movie.genre.some(g => g.toLowerCase() == genre.toLowerCase())
        )
        return res.json(filteredMovies)
    }
    res.json(MoviesJson)
})

app.get('/movies/:id', (req,res) => {
    const {id} = req.params
    const movie = MoviesJson.find(movie => movie.id == id)
    if (movie) return res.json(movie)

    res.status(404).json({message: 'Movie not found'})
})


app.post('/movies',(req,res) => {
    
    const result = validateMovie(req.body)

    if (result.error) {
        return res.status(400).json({ error : result.error.message })
    }

    const newMovie = {
        id : crypto.randomUUID(), // crea id ramdoms
        ...result.data
    }

    MoviesJson.push(newMovie)

    res.status(201).json(newMovie)

})


app.patch('/movies/:id', (req,res) => {
    
    const result = validateParcialMovie(req.body)

    if (!result.success) {
        return res.status(400).json({error: JSON.parse(result.error.message)})
    }
    const {id} = req.params
    const movieIndex = MoviesJson.findIndex(movie => movie.id == id)

    if (movieIndex == -1) {
        return res.status(404).json({ message: 'Movie not found'})
    }

    const updateMovie = {
        ...MoviesJson[movieIndex],
        ...result.data
    }

    MoviesJson[movieIndex] = updateMovie

    return res.json(updateMovie)

})




PORT = process.env.PORT ?? 1234

app.listen( PORT, () => {
    console.log(`Escuchando en el puerto ${PORT}`)
})