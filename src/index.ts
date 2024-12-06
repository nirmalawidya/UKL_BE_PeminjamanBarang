import Express from "express"
import UserRoute from "./router/userRouter"
import ItemRoute from "./router/itemRouter"
import BorrowRoute from "./router/borrowRouter"
const app = Express()

app.use(Express.json())

app.use(`/User`, UserRoute)
app.use(`/Item`, ItemRoute)
app.use(`/Borrow`, BorrowRoute)

const PORT = 1911
app.listen(PORT, () => { 
    console.log(`Server peminjaman barang run on port ${PORT}`)
})