import axios, { AxiosResponse, isCancel } from "./node_modules/axios/index";

type FetchItem = {
  fetchRequest: Promise<AxiosResponse>;
  onSuccess: (responseData) => void;
  onError: (error: ErrorLog) => void;
  tries: number;
};

class FetchQueue {
  queue: FetchItem[] = [];
  isFetching = false;
  maxRequestCalls = 5;
  constructor(private readonly errorHandler: ErrorHandler) {}

  addToQueue(
    fetchRequest: Promise<AxiosResponse>,
    onSuccess: (responseData: AxiosResponse) => void,
    onError: (error: ErrorLog) => void
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
    /* TRY */
    try {
      console.log("tries");
      const response = await item.fetchRequest;
      item.onSuccess(response.data);
      this.isFetching = false;
      this.startFetching();
    } catch (error) {
      const errorLog = this.errorHandler.handle(error);
      if (errorLog.type === ErrorTypes.Cancel) {
        item.onError(errorLog);
        this.restart();
        return;
      }

      item.tries++;
      if (item.tries > this.maxRequestCalls) {
        item.onError(errorLog);
        this.restart();
        return;
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

  private restart() {
    this.dequeue();
    this.isFetching = false;
    this.startFetching();
  }

  get isEmpty(): boolean {
    return this.queue.length < 1;
  }
}

interface ErrorLog {
  title: string;
  type: string;
  message: string;
  details: string;
}

interface ResponseError extends ErrorLog {
  status: string;
}

enum ErrorTypes {
  Response = "response",
  Request = "request",
  Cancel = "cancel",
  Other = "other",
}

class ErrorHandler {
  handle(error) {
    if (error.response) {
      return this.createResponseError(error);
    }
    if (isCancel(error)) {
      return this.createCancelError(error);
    }
    if (error.request) {
      return this.createRequestError(error);
    }

    return this.createOtherError(error);
  }

  createResponseError(error): ResponseError {
    return {
      title: "Oops! algo salió mal 🥹",
      type: ErrorTypes.Response,
      message: "El servidor respondió con un error",
      details: `${error.message}`,
      status: error.response.status,
    };
  }

  createRequestError(error): ErrorLog {
    return {
      title: "Oops, algo ha pasado",
      type: ErrorTypes.Request,
      message: "La solicitud no se pudo completar de manera correcta",
      details: `Mensaje: ${error.message}`,
    };
  }

  createCancelError(error): ErrorLog {
    return {
      title: "Vale, no pasa nada, cancelado",
      type: ErrorTypes.Cancel,
      message: "La solicitud se ha cancelado exitosamente",
      details: "El usuario ha cancelado la petición",
    };
  }

  createOtherError(error): ErrorLog {
    return {
      title: "Oops, hemos hecho algo mal",
      type: ErrorTypes.Other,
      message: "Un error inesperado ha ocurrido, por favor contacta a soporte",
      details: `Mensaje: ${error.message}`,
    };
  }
}

const fetchQueue = new FetchQueue(new ErrorHandler());
fetchQueue.addToQueue(
  axios.get("https://api.github.com/users/Trictonicmp"),
  (data) => {
    console.log("fetch 1");
    //console.log(data);
  },
  (error) => {
    console.log("error", error);
  }
);

fetchQueue.addToQueue(
  axios.get("https://api.publicapis.org/entries"),
  (data) => {
    console.log("fetch 2");
    //console.log(data);
  },
  (error) => {
    console.log("error", error);
  }
);

fetchQueue.addToQueue(
  axios.get("https://catfact.ninja/fact"),
  (data) => {
    console.log("fetch 3");
    //console.log(data);
  },
  (error) => {
    console.log("error", error);
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
    console.log("error", error);
  }
);

fetchQueue.addToQueue(
  axios.get("https://api.github.om/users/Trictonicmp"),
  (data) => {
    console.log("fetch 10");
  },
  (error) => {
    console.log("error", error);
  }
);

fetchQueue.addToQueue(
  axios.get("https://www.boredapi.com/api/activity"),
  (data) => {
    console.log("fetch 5");
    //console.log(data);
  },
  (error) => {
    console.log("error", error);
  }
);

fetchQueue.addToQueue(
  axios.get("https://api.genderize.io/?name=luc"),
  (data) => {
    console.log("fetch 6");
    //console.log(data);
  },
  (error) => {
    console.log("error", error);
  }
);

fetchQueue.addToQueue(
  axios.get("https://api.nationalize.io/?name=nathaniel"),
  (data) => {
    console.log("fetch 7");
    //console.log(data);
  },
  (error) => {
    console.log("error", error);
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
    console.log("error", error);
  }
);

fetchQueue.addToQueue(
  axios.get("https://dog.ceo/api/breeds/image/random"),
  (data) => {
    console.log("fetch 9");
    //console.log(data);
  },
  (error) => {
    console.log("error", error);
  }
);
