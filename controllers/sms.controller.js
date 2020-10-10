const mysql = require('mysql');
const oracledb = require('oracledb');
const request = require('request');
const accountSid = 'AC54a626f8b615f0eebd80aeb46dce6eb9';
const authToken = '7b519cb921bf82747bd2b19f9a454605';
const client = require('twilio')(accountSid, authToken);

//const createCsvWriter = require('csv-writer').createObjectCsvWriter;
//const json2csv = require('json2csv');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

//local mysql db connection
const connection = mysql.createConnection({
  host     : '192.168.30.148',
  user     : 'ussd',
  password : 'ussdLogin',
  database : 'concurso'
});

const oraConn = oracledb.getConnection({
    user: "adem",
    password: "AdeM123",
    connectString: "srvussd.adem.co.mz:1521/orcl.adem.co.mz"
});
  
exports.getAll = async function (req, res, id) {
    //try {
    connection.connect();
    //let results = ''
      // run query to get employee with employee_id
    connection.query('SELECT * FROM to_message WHERE flag IS NULL', (err, rows) => {
        if(err) throw err;
      
        console.log('Data fetched from MySQL DB');
        //let results = rows
        //res.send(response);
        
        //rows.forEach( (row) => { //async function (req, res, id) {
        //    console.log(row);
            const csvWriter = createCsvWriter({
                path: 'c:/dev/cupoes.csv',
                header: [
                    {id: 'name', title: 'ID'},
                    {id: 'lang', title: 'CREATED_AT'},
                    {id: 'name', title: 'UPDATED_AT'},
                    {id: 'name', title: 'CLIENTE'},
                    {id: 'lang', title: 'CUPAO'},
                    {id: 'lang', title: 'FLAG'}
                ]
            });
             
            const records = JSON.stringify(rows); /*[
                {name: 'Bob',  lang: 'French, English'},
                {name: 'Mary', lang: 'English'}
            ];*/
             
            csvWriter.writeRecords(records)       // returns a promise
                .then(() => {
                    console.log('...Done');
                });
            // convert JSON array to CSV string
            /*
            converter.json2csv(todos, (err, csv) => {
                if (err) {
                    throw err;
                }

                // print CSV string
                console.log(csv);

                // write CSV to a file
                fs.writeFileSync('cupoes.csv', csv);
                
            });          */  
        //});
        
        res.send(records)
    });
   
   connection.end();
   console.log('===== THE END =====')

   //jsonResults = JSON.stringify(results);
   //console.log(results);
   //res.send(results)

  };


  exports.smsSend = async function (req, res, id) {
      try {
        const oraConnection = await oracledb.getConnection({
            user: "adem",
            password: "AdeM123",
            connectString: "srvussd.adem.co.mz:1521/orcl.adem.co.mz"
            //connectString: "192.168.30.146:1521/orcl.adem.co.mz"
        });

        const results = await connection.execute('SELECT phoneNumber, Cliente FROM welcome_test WHERE status IS NULL');

        if (result.rows.length == 0) {
            //No unsent SMS found
            return res.status(404).send('Número não registado!');
        } else {
            let message = `Recebemos o pagamento de sua(s) factura(s). 
            O seu brinde PAGOU GANHOU será entregue com a próxima factura.
            
            #FiqueEmCasa`

            //Send SMS through Twilio API        
            for (i = 0; i < results.length; i++) {
                client.messages
                    .create({
                        body: message,
                        from: 'AdeM',
                        statusCallback: 'http://41.223.153.252:4000/status',
                        to: '+'.concat(results.rows[i]["PHONENUMBER"])
                    })
                    .then(message => console.log(message.sid));
            }

            return res.status(200).send(result.rows);
        }
      
    } catch (err) {
        //send error message
        return res.send(err.message);
    } finally {
        if (connection) {
        try {
            // Always close connections
            await connection.close(); 
        } catch (err) {
            //return console.error(err.message);
        }
        }
    }
};