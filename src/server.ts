import app from "./app"
import { prisma } from "./lib/prisma"
const PORT = process.env.PORT 
async function main() {
    try {
        await prisma.$connect()
        console.log("Connected to the database successfully")
        app.listen(PORT,()=>{
            console.log(`Server is Running ${PORT}`)
        })
    } catch (error) {
        console.log("An error occurred", error)
        await prisma.$disconnect()
        process.exit(1)
    }

}
main()