// types/index.d.ts
interface ViewportConfig {
    themeColor: string
    width: string
    initialScale: number
  }

declare module 'simple-peer' {
  export default class Peer {
    constructor(opts: any);
    signal(data: any): void;
    on(event: string, callback: (...args: any[]) => void): void;
    destroy(): void;
    send(data: any): void;
  }

  export type Instance = Peer;
}
