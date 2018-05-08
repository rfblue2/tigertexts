const express = require('express');

const router = express.Router();
const cmd = require('node-cmd');
const PythonShell = require('python-shell');

/* GET home page. */
router.get('/', (req, res) => {
  res.render('admin', { title: 'Admin Dashboard' });
});

router.get('/update', (req, res) => {
  function updateClasses() {
    cmd.run('find ./server/public/scripts -name "*.json" -delete');
    // Starting directory is root folder
    // cmd.get(
    //   `cd ./server/public/scripts
    //   pwd
    //   `,
    //   function(err, data, stderr){
    //     console.log('the current working dir is : ',data)
    //   }
    // );
    // cmd.run(
    //   `cd ./server/public/scripts/blackboard_crawler
    //   scrapy crawl blackboard -o results.json
    //   `);
    // var options = {
    //   args: ['Testing the function']
    // };
    // PythonShell.run('./server/public/scripts/test.py', options, function(err, results) {
    //   if (err) throw err;
    //   console.log('results: %j', results);
    // });
  }
  updateClasses();
  // Figure out how to make dynamic
  res.render('update', { title: 'Updating Database', status: 'Updated classes' });
});

module.exports = router;
