import * as express from "express";
export let msgRouter = express.Router();


msgRouter.get('/read/:mid', getMessage);

async function getMessage(req: express.Request, res: express.Response) {
    const mid = req.params.mid;
    res.status(200).send(`You requested msg for mid = ${mid}`);
}

async function putContact(req: express.Request, res: express.Response) {
  res.status(200).send({"contact":`${req.params.contactId}`,"action":"put"}) ;
}


async function getContact(req: express.Request, res: express.Response) {
  res.status(200).send({"contact":`${req.params.contactId}`,"action":"get"});
}
async function deleteContact(req: express.Request, res: express.Response) {
  res.status(200).send({"contact":`${req.params.contactId}`,"action":"delete"});
}
async function addContact(req: express.Request, res: express.Response) {
  res.status(200).send({"contact":`${req.params.contactId}`,"action":"Add"});
}

// Useful: Let's make sure we intercept un-matched routes and notify the client with a 404 status code
msgRouter.get("*", async (req: express.Request, res: express.Response) => {
	res.status(404).send("This msg route does not exist.");
});

msgRouter.route('/contact') 
// GET endpoint 
.get((req: express.Request, res: express.Response) => {
// Get all contacts            
    res.status(200).send({
        message: 'GET request successfulll!!!!'
    })
})        
// POST endpoint
.post((req: express.Request, res: express.Response) => {   
// Create new contact         
    res.status(200).send({
        message: 'POST request successfulll!!!!'
    })
})

// Contact detail
msgRouter.route('/contact/:contactId')
.get(getContact)
.post(addContact)
.put(putContact)
.delete(deleteContact);
