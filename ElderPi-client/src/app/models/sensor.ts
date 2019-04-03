export class Sensor {
  public deviceName: string;  // Name of the device (custorm)
  public deviceID: string;    // Number of the device (unique)
  public battery: number;     // Level of battery
  public time: string;        // Time in the room (human readable)
  public duration: number;    // Time in the room (ms)
  public timestamp: string;   // Date of the lecture

  constructor() {  }
}
