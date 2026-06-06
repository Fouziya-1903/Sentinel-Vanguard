import express from 'express';
import dotenv from 'dotenv';
import router from './src/routes/apiRoutes';
dotenv.config();
const server = express();
const port = process.env.PORT;

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use('/api/v1', router);

server.get('/', (req, res) => {
    res.status(200).send("Sentinel API Gateway is healthy and executing.");
});
server.listen(port, ()=>{
    console.log(`Server is running on port: ${port}`);
});