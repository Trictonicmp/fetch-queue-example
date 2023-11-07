import axios, { AxiosResponse, isCancel } from "./node_modules/axios/index";

type FetchItem = {
  fetchRequest: Promise<AxiosResponse>;
  onSuccess: (responseData) => void;
  onError: (error: unknown) => void;
  tries: number;
};

class FetchQueue {
  queue: FetchItem[] = [];
  isFetching = false;
  maxRequestCalls = 5;

  addToQueue(
    fetchRequest: Promise<AxiosResponse>,
    onSuccess: (responseData: AxiosResponse) => void,
    onError: (error: unknown) => void
  ) {
    const newItem: FetchItem = {
      fetchRequest,
      onSuccess,
      onError,
      tries: 0,
    };

    this.queue.push(newItem);
    console.log("Added");
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

    console.log("start fetching", item.tries);
    try {
      console.log("tries");
      const response = await item.fetchRequest;
      item.onSuccess(response.data);

      this.isFetching = false;
      this.startFetching();
    } catch (error) {
      console.log("error", axios.isCancel(error));
      item.onError(error);
      if (axios.isCancel(error)) {
        this.dequeue();
        this.startFetching();
        return;
      }
      item.tries++;
      if (item.tries > this.maxRequestCalls) {
        console.log("out");
        this.dequeue();
        this.isFetching = false;
        this.startFetching();
      }

      this.queue.push(item);
      this.startFetching();
    } finally {
      this.dequeue();
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
  axios.get("https://api.github.com/users/Trictonicmp"),
  (data) => {
    console.log("fetch 1");
    //console.log(data);
  },
  (error) => {
    console.log("error", error.message);
  }
);

fetchQueue.addToQueue(
  axios.get("https://api.publicapis.org/entries"),
  (data) => {
    console.log("fetch 2");
    //console.log(data);
  },
  (error) => {
    console.log("error", error.message);
  }
);

fetchQueue.addToQueue(
  axios.get("https://catfact.ninja/fact"),
  (data) => {
    console.log("fetch 3");
    //console.log(data);
  },
  (error) => {
    console.log("error", error.message);
  }
);

const controller = new AbortController();
setTimeout(() => {
  controller.abort();
}, 300);
fetchQueue.addToQueue(
  axios.get("https://api.coindesk.com/v1/bpi/currentprice.json", {
    signal: controller.signal,
  }),
  (data) => {
    console.log("fetch 4");
  },
  (error) => {
    console.log("error", error.message);
  }
);

fetchQueue.addToQueue(
  axios.get("https://api.github.om/users/Trictonicmp"),
  (data) => {
    console.log("fetch 10");
  },
  (error) => {
    console.log("error", error.message);
  }
);

fetchQueue.addToQueue(
  axios.get("https://www.boredapi.com/api/activity"),
  (data) => {
    console.log("fetch 5");
    //console.log(data);
  },
  (error) => {
    console.log("error", error.message);
  }
);

fetchQueue.addToQueue(
  axios.get("https://api.genderize.io/?name=luc"),
  (data) => {
    console.log("fetch 6");
    //console.log(data);
  },
  (error) => {
    console.log("error", error.message);
  }
);

fetchQueue.addToQueue(
  axios.get("https://api.nationalize.io/?name=nathaniel"),
  (data) => {
    console.log("fetch 7");
    //console.log(data);
  },
  (error) => {
    console.log("error", error.message);
  }
);

fetchQueue.addToQueue(
  axios.get(
    "https://datausa.io/api/data?drilldowns=Nation&measures=Population"
  ),
  (data) => {
    console.log("fetch 8");
    //console.log(data);
  },
  (error) => {
    console.log("error", error.message);
  }
);

fetchQueue.addToQueue(
  axios.get("https://dog.ceo/api/breeds/image/random"),
  (data) => {
    console.log("fetch 9");
    //console.log(data);
  },
  (error) => {
    console.log("error", error.message);
  }
);
