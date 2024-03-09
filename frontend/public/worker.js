const consoleResults = [];

const interceptConsole = () => {
  const add = (...args) => {
    consoleResults.push(...args);
  };

  const tempLog = console.log;
  const tempInfo = console.info;
  const tempError = console.error;

  console.error = (...args) => {
    tempError(...args);
    add(args);
  };

  console.log = (...args) => {
    tempLog(...args);
    add(args);
  };

  console.info = (...args) => {
    tempInfo(...args);
    add(args);
  };

  console.clear = () => {
    tempInfo("Console was cleared programmatically.");
    add([]);
  };
};

self.onmessage = (e) => {
  const message = e.data;
  if (message === "terminate") {
    self.close();
    return;
  }
  try {
    interceptConsole();
    new Function(message)();
    self.postMessage(consoleResults);
    consoleResults.length = 0;
  } catch (err) {
    console.error(err);
    postMessage({ error: err.message });
  }
};
