import mitt from 'mitt';

// Define the type for the events we'll emit
type Events = {
  loading_start: undefined;
  loading_end: undefined;
};

// Create the emitter instance
const emitter = mitt<Events>();

export default emitter;
