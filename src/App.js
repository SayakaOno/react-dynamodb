import React from 'react';
import AWS from 'aws-sdk';
import { region, endpoint, accessKeyId, secretAccessKey } from './keys';

let dynamodb = null;
var docClient = null;

class App extends React.Component {
  componentDidMount() {
    AWS.config.update({
      region,
      endpoint,
      // accessKeyId default can be used while using the downloadable version of DynamoDB.
      // For security reasons, do notå store AWS Credentials in your files. Use Amazon Cognito instead.
      accessKeyId,
      // secretAccessKey default can be used while using the downloadable version of DynamoDB.
      // For security reasons, do not store AWS Credentials in your files. Use Amazon Cognito instead.
      secretAccessKey
    });

    dynamodb = new AWS.DynamoDB();
    docClient = new AWS.DynamoDB.DocumentClient();
  }

  // create;
  createMovies = () => {
    var params = {
      TableName: 'Movies',
      KeySchema: [
        { AttributeName: 'year', KeyType: 'HASH' },
        { AttributeName: 'title', KeyType: 'RANGE' }
      ],
      AttributeDefinitions: [
        { AttributeName: 'year', AttributeType: 'N' },
        { AttributeName: 'title', AttributeType: 'S' }
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
      }
    };

    dynamodb.createTable(params, function(err, data) {
      if (err) {
        document.getElementById('textarea').value =
          'Unable to create table: ' + '\n' + JSON.stringify(err, undefined, 2);
      } else {
        document.getElementById('textarea').value =
          'Created table: ' + '\n' + JSON.stringify(data, undefined, 2);
      }
    });
  };

  // GET
  readItem = () => {
    var table = 'Movies';
    var year = 2015;
    var title = 'The Big New Movie';

    var params = {
      TableName: table,
      Key: {
        year: year,
        title: title
      }
    };
    docClient.get(params, function(err, data) {
      if (err) {
        document.getElementById('textarea').value =
          'Unable to read item: ' + '\n' + JSON.stringify(err, undefined, 2);
      } else {
        document.getElementById('textarea').value =
          'GetItem succeeded: ' + '\n' + JSON.stringify(data, undefined, 2);
      }
    });
  };

  // Update
  putItem = () => {
    var params = {
      TableName: 'Movies',
      Item: {
        year: 2015,
        title: 'The Big New Movie',
        info: {
          plot: 'Nothing happens at all.',
          rating: 0
        }
      }
    };
    docClient.put(params, function(err, data) {
      if (err) {
        document.getElementById('textarea').value =
          'Unable to add item: ' + '\n' + JSON.stringify(err, undefined, 2);
      } else {
        document.getElementById('textarea').value =
          'PutItem succeeded: ' + '\n' + JSON.stringify(data, undefined, 2);
      }
    });
  };

  conditionalDelete = () => {
    var table = 'Movies';
    var year = 2015;
    var title = 'The Big New Movie';

    var params = {
      TableName: table,
      Key: {
        year: year,
        title: title
      },
      ConditionExpression: 'info.rating <= :val',
      ExpressionAttributeValues: {
        ':val': 5.0
      }
    };

    docClient.delete(params, function(err, data) {
      if (err) {
        document.getElementById('textarea').value =
          'The conditional delete failed: ' +
          '\n' +
          JSON.stringify(err, undefined, 2);
      } else {
        document.getElementById('textarea').value =
          'The conditional delete succeeded: ' +
          '\n' +
          JSON.stringify(data, undefined, 2);
      }
    });
  };

  render() {
    return (
      <div className="App">
        <input
          id="createTableButton"
          type="button"
          value="Create Table"
          onClick={this.createMovies}
        />
        <br />
        <input
          id="createTableButton"
          type="button"
          value="Read Item"
          onClick={this.readItem}
        />
        <br />
        <input
          id="createTableButton"
          type="button"
          value="Add Item"
          onClick={this.putItem}
        />
        <br />
        <input
          id="createTableButton"
          type="button"
          value="Delete Item"
          onClick={this.conditionalDelete}
        />
        <br />
        <textarea
          readOnly
          id="textarea"
          style={{ width: '400px', height: '800px' }}
        />
      </div>
    );
  }
}

export default App;
