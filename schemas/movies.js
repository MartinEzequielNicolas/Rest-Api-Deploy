const z = require('zod')

const movieSchema = z.object({
    tittle : z.string({
        invalid_type_error: 'Movie tittle must be a string',
        required_error:'movie tittle is required.'

    }),
    year: z.number().int().positive().min(1900).max(2024),
    director: z.string(),
    duration: z.number().int().min(0),
    rate: z.number.apply().min(0).max(10),
    poster: z.string().url({
        mesagge: 'Poster must be a valid URL'
    }),
    genre: z.array(z.enum(['Action','Adventure','Comedy','Drama','Crime','Fantasy','Horror','Thriller','Sci-Fi']))

})

function validateMovie(object) {
    return movieSchema.safeParse(object)
}

 function validateParcialMovie(object) {
    return movieSchema.partial().safeParse(object)
 } 


module.exports = {
    validateMovie,
    validateParcialMovie
}