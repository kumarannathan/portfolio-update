declare module 'ogl' {
  export class Renderer {
    gl: WebGL2RenderingContext & { canvas: HTMLCanvasElement };
    constructor(options?: {
      webgl?: number;
      alpha?: boolean;
      antialias?: boolean;
      dpr?: number;
    });
    setSize(width: number, height: number): void;
    render(options: { scene: unknown }): void;
  }

  export class Program {
    uniforms: Record<string, unknown>;
    constructor(
      gl: WebGL2RenderingContext,
      options: {
        vertex: string;
        fragment: string;
        uniforms?: Record<string, unknown>;
      }
    );
  }

  export class Mesh {
    constructor(
      gl: WebGL2RenderingContext,
      options: { geometry: unknown; program: Program }
    );
  }

  export class Triangle {
    constructor(gl: WebGL2RenderingContext);
  }
}
