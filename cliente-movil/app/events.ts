/*
// src/events.ts
import mitt, { Emitter } from "mitt";

export type Events = {
  // emitiremos el código de invitación que hay que quitar
  invitacionRemoved: string;
};

// Emitter<Events> para que TS infiera bien las firmas de .on() y .emit()
const emitter: Emitter<Events> = mitt<Events>();

export default emitter;
*/