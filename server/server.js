import app from './src/app.js'
import { config } from './src/config/config.js'
import connectDB from './src/config/db.js'


const startServer = async()=>{

    await connectDB()
    const PORT = config.port || 3000

    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`)
    })
}

startServer()