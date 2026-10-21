import { analyzeSequence } from "@/lib/sequence/analyze";

interface SequenceWorkerScope {
  onmessage: (event: MessageEvent<string>) => void;
  postMessage: (message: ReturnType<typeof analyzeSequence>) => void;
}

declare const self: SequenceWorkerScope;

self.onmessage = (event) => {
  self.postMessage(analyzeSequence(event.data));
};
