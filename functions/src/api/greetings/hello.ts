import * as express from "express";
export let helloRouter = express.Router();
import { Greetings } from './greetings'

helloRouter.get('/:name',greetUser);

async function greetUser(req: express.Request, res: express.Response){
    const name = req.params.name;
    const g = new Greetings(name,"welcome to baseApis");
    res.status(200).send(g.greet());
}


// Useful: Let's make sure we intercept un-matched routes and notify the client with a 404 status code
helloRouter.get("*", async (req: express.Request, res: express.Response) => {
	res.status(404).send("This msg route does not exist.");
});
