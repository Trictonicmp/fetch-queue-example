// Import stylesheets
import './style.css';

// Write TypeScript code!
const appDiv: HTMLElement = document.getElementById('app');
appDiv.innerHTML = `<h1>TypeScript Starter asd </h1>`;

type FetchItem = {
  fetchRequest: Promise<Response>;
  callback: (responseData) => void;
  tries: number;
};

class FetchQueue {
  queue = [];
  isFetching = false;
  maxRequestCalls = 5;

  addToQueue(fetchRequest, callback: (responseData) => void) {
    const newItem: FetchItem = {
      fetchRequest,
      callback,
      tries: 0,
    };

    this.queue.push(newItem);
    if (!this.isFetching) {
      this.startFetching();
      this.isFetching = true;
    }
  }

  dequeue() {
    this.queue.shift();
  }

  async startFetching() {
    if (this.isEmpty) return;

    const item = this.next();

    try {
      const response = await item.fetchRequest;
      const data = await response.json();
      item.callback(data);
      this.dequeue();
      this.isFetching = false;
      this.startFetching();
    } catch (error) {
      item.tries++;
      if (item.tries > this.maxRequestCalls) {
        console.log('error');
        this.dequeue();
        this.isFetching = false;
        this.startFetching();
      }

      this.queue.push(item);
    }
  }

  private next(): FetchItem {
    return this.queue[0];
  }

  get isEmpty(): boolean {
    return this.queue.length < 1;
  }
}

const fetchQueue = new FetchQueue();
fetchQueue.addToQueue(
  fetch('https://api.github.com/users/Trictonicmp'),
  (data) => {
    console.log('fetch 1');
    console.log(data);
  }
);

fetchQueue.addToQueue(fetch('https://api.publicapis.org/entries'), (data) => {
  console.log('fetch 2');
  console.log(data);
});

fetchQueue.addToQueue(fetch('https://catfact.ninja/fact'), (data) => {
  console.log('fetch 3');
  console.log(data);
});

fetchQueue.addToQueue(
  fetch('https://api.coindesk.com/v1/bpi/currentprice.json'),
  (data) => {
    console.log('fetch 4');
    console.log(data);
  }
);

fetchQueue.addToQueue(
  fetch('https://api.github.com/users/Trictonicmo'),
  (data) => {
    console.log('fetch 10');
  }
);

fetchQueue.addToQueue(
  fetch('https://www.boredapi.com/api/activity'),
  (data) => {
    console.log('fetch 5');
    console.log(data);
  }
);

fetchQueue.addToQueue(fetch('https://api.genderize.io/?name=luc'), (data) => {
  console.log('fetch 6');
  console.log(data);
});

fetchQueue.addToQueue(
  fetch('https://api.nationalize.io/?name=nathaniel'),
  (data) => {
    console.log('fetch 7');
    console.log(data);
  }
);

fetchQueue.addToQueue(
  fetch('https://datausa.io/api/data?drilldowns=Nation&measures=Population'),
  (data) => {
    console.log('fetch 8');
    console.log(data);
  }
);

fetchQueue.addToQueue(
  fetch('https://dog.ceo/api/breeds/image/random'),
  (data) => {
    console.log('fetch 9');
    console.log(data);
  }
);
