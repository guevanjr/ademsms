const mysql = require('mysql');
const oracledb = require('oracledb');
const request = require('request');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
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


  exports.insertAll = async function (req, res, id) {
    //try {
      const oraConnection = await oracledb.getConnection({
        user: "adem",
        password: "AdeM123",
        connectString: "srvussd.adem.co.mz:1521/orcl.adem.co.mz"
        //connectString: "192.168.30.146:1521/orcl.adem.co.mz"
      });

      //var params = req.body;
      //console.log(params);
      var fs = require('fs');
    var result = JSON.parse(fs.readFileSync('c:/Dev/cupoes.json', 'utf8'));

      res.send(result);

      for (i = 0; i < result.length; i++) {
        //text += result.rows[i]["DATA"].concat(' : ', result.rows[i]["VALOR"]) + "\n\r";
        connection.execute('INSERT INTO cupoes SET ? ', 
            [result[i]["id"], result[i]["created_at"], result[i]["updated_at"], result[i]["cliente"], result[i]["cupao"], result[i]["flag"]], 
            { autoCommit: true },
            function (error, results, fields) {
                if (error) throw error;
                
                return res.send({ message: 'User '.concat(result[i]["cliente"], ' has been created successfully.') });
                
            }
        );

        connection.close();
    }
/*
      //const values = id;
      // run query to get employee with employee_id
        connection.execute('INSERT INTO cupoes SET ? ' /*(id, created_at, updated_at, cliente, cupao, flag) VALUES(:0, :1, :2, :3, :4, :5)'*//*, 
            [req.row.id, req.row.created_at, req.updated_at, req.row.cliente, req.row.cupao, req.row.flag], 
            { autoCommit: true },
            function (error, results, fields) {
                if (error) throw error;
                
                return res.send({ message: 'User '.concat(req.row.id, ' has been created successfully.') });
                
            }
        );
  
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

    //connection.close();*/
  };