module.exports = {
  errorHandler: (error) => {
    console.log('-------------');
    console.log(`【ERROR】${error.plugin}`);
    console.log(`【file】${error.fileName}`);
    console.log(`【line】${error.lineNumber}`);
    console.log(`【column】${error.columnNumber}`);
    console.log(`【message】${error.message}`);
    console.log('');
  }
}
