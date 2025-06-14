import express from 'express'
import globalErrorHandling from './middlewares/globalErrorHandling.js';
import userRouter from './users/userRouter.js';
// import bookRouter from './books/bookRouter.js';
import cors from 'cors'

const app = express()


app.get('/api/users/signup', (req, res, next) => {
    res.status(200).json({ message: 'Welcome to the expense tracker API' })
})

app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173',
}))
app.use('/api/users', userRouter)
// app.use('/api/books', bookRouter)
app.use(globalErrorHandling)

export default app

