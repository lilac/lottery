/**
 * Created by junjun.deng on 15/11/2017.
 */
const { Pool, Client } = require('pg');

function get_args(requiredArguments){
    var arguments = {};

    for (var index = 0; index < process.argv.length; index++) {
        var re = new RegExp('--([A-Za-z0-9_]+)=(.*)'),
            matches = re.exec(process.argv[index]);

        if(matches !== null) {
            arguments[matches[1]] = matches[2];
        }
    }
    return arguments;
}

var args = get_args(['user', 'pw', 'host', 'port', 'db']);

// Initiate connection pool
var con  = {
    user:     args.user,
    password: args.pw,
    host:     args.host,
    port:     args.port,
    database: args.db
};

var pool = new Pool(con)

console.log(`Connecting through: ${JSON.stringify(con)}`)

global.i = 0;
global.max = 10000;
global.last_email = null;
global.last_age = null;

function randstr(length, current) {
    current = current ? current : '';
    return length ? randstr(--length, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz".charAt(Math.floor(Math.random() * 60)) + current) : current;
}

async function insert(){
    let qs = [];
    while(i < max){
        var fname = randstr(15);
        var lname = randstr(10);
        global.last_age = Math.floor(Math.random() * 70) + 1;
        global.last_email = `${lname}@${fname}.com`;

        let q = pool.query(`INSERT INTO customers_bench (first_name, last_name, email, age) VALUES ('${fname}', '${lname}', '${last_email}', ${last_age})`);
        qs.push(q);
        i += 1;
    }
    return await Promise.all(qs);
}

async function query() {
    while (i < max) {
        var t = new Date();
        await pool.query(`SELECT * FROM customers_bench WHERE age = ${last_age}`);
        console.log(`Select by age in ${new Date() - t} ms`);
    }
}

async function setup(){
    await pool.query(`DROP TABLE IF EXISTS customers_bench`)
    await pool.query(`CREATE TABLE customers_bench (
    id SERIAL NOT NULL,
    first_name varchar(250) DEFAULT NULL,
    last_name varchar(250) DEFAULT NULL,
    email varchar(250) DEFAULT NULL,
    age INT DEFAULT NULL,
    PRIMARY KEY (id)
  );`);
    await pool.query('CREATE INDEX ON customers_bench (email)');
    await pool.query('CREATE INDEX ON customers_bench (age)');
}

async function run(){
    await setup();

    var t = new Date();
    await insert();
    console.log(`Inserted ${max} records in ${new Date() - t} ms`);

    var t = new Date();
    await pool.query(`SELECT * FROM customers_bench WHERE email = '${last_email}'`);
    console.log(`Select by email in ${new Date() - t} ms`);

    var t = new Date();
    await pool.query(`SELECT * FROM customers_bench WHERE age = ${last_age}`);
    console.log(`Select by age in ${new Date() - t} ms`);

    process.exit();
}

run();
// query();

console.log("Running benchmark..");
