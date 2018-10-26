var Kafka = require('node-rdkafka');

var stream = Kafka.Producer.createWriteStream({
  'metadata.broker.list': 'localhost:9092'
}, {}, {
  topic: 'new-test'
});

// Writes a message to the stream
var queuedSuccess = stream.write(Buffer.from('Awesome message'));