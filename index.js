const express = require("express")
const mysql = require("mysql")
const app = express();
const bcrypt = require("bcrypt")

app.use(express.json());

const port = process.env.port || 8080;
app.listen(port, ()=>{
	console.log(`Waras REST API listening on port ${port}`);
});

app.get("/", async (req, res)=> {
	res.json({ status: "Waras APP READY!!"})
});

// GET ALL DATA
app.get("/:tbuserwaras", async (req, res)=>{
	const query = "SELECT * FROM tbuserwaras";
	pool.query(query, [req.params.tbuserwaras], (error, result)=>{
		if (!result[0]) {
			res.json({ status: "Not found!"});
		} else {
			req.json(result[0]);
		} 
	});
});

// GET USER DATA BY USERNAME
app.get("/:tbuserwaras", async (req, res)=>{
	const query = "SELECT * FROM tbuserwaras WHERE username= ?";
	pool.query(query, [req.params.tbuserwaras], (error, result)=>{
		if (!result[0]) {
			res.json({ status: "Not found!"});
		} else {
			req.json(result[0]);
		} 
	});
});

const pool = mysql.createPool({
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	socketPath: process.env.INSTANCE_CONNECTION_NAME,
});

// POST USER DATA TO DB
app.post("/", async (req, res)=>{
	const hashedPassword = await bcrypt.hash(req.body.password, 10)
	const data = {
		username: req.body.username,
		full_name: req.body.full_name,
		email: req.body.email,
		password: hashedPassword,
		telephone: req.body.telephone,
		date_of_birth: req.body.date_of_birth,
		created_at: new Date().toISOString(),
		updated_at: created_at,
	}
	//DATABASE
	const query = "INSERT INTO tbuserwaras VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
	pool.query(query, Object.values(data), (error)=>{
		if (error){
			res.json({ status: "failure", reason: error.code });
		} else {
			res.json({ status: "success", data: data });
		}
	});
});

app.post('/:tbuserwaras', async (req, res) => {
  const query = "SELECT * FROM tbuserwaras WHERE username= ?";
	pool.query(query, [req.params.tbuserwaras], (error, result)=>{
		if (!result[0]) {
			res.json({ status: "User not found!", reason: error.code});
		}	
		try {
			if(await bcrypt.compare(req.body.password, query.password)) {
				res.json({ status: "Success"});
			} else {
				res.json({ status: "password or username does't match" });
			}
		} catch {
			res.json({reason: error.code});
		}
	});
});
