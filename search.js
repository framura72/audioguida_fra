/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

var elasticsearch = require('elasticsearch');


var text = process.argv[2];
var card = process.argv[3];

var client = new elasticsearch.Client({
  host: 'localhost:9200',
});

client.indices.analyze({
        index: "myindex",
        analyzer: "my_synonyms",
        text: text

}, function(error, response){console.log(response)});

var query = "question:" + text + " AND title:" + card;
console.log(query);
client.search({
  index: 'myindex',
  //analyzer: 'my_synonyms',
  //q: query
  
body: {
                query: {
                    bool: {
                        must: [
                            {
                                bool: {
                                    should: [
                                        {match: {question: {query: text, boost: 2}}},
                                        {match: {answer: text}}

                                    ]
                                }
                            },
                            {
                                bool: {
                                    should: [
                                        {match: {title: "Pinacoteca"}},
                                        {match: {title: card}}

                                    ]
                                }
                            }
                        ]
                    }
                }
            }
}, function (error, response) {
        console.log("error:",error);
        console.log("resp:",response.hits.hits[0]);
});
