/*
 *   Stripe WebGl Gradient Animation
 *   All Credits to Stripe.com
 *   ScrollObserver functionality to disable animation when not scrolled into view has been disabled and
 *   commented out for now.
 *   https://kevinhufnagl.com
 */

//Converting colors to proper format
function normalizeColor(hexCode: string) {
  let hex = hexCode.replace("#", "");
  if (hex.length === 3) {
    hex = `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`;
  }
  const rgb = parseInt(hex, 16);
  return [(rgb >> 16) & 255, (rgb >> 8) & 255, rgb & 255];
}

const blendModes = ["SCREEN", "LINEAR_LIGHT"].reduce(
  (acc, t, n) =>
    Object.assign(acc, {
      [t]: n,
    }),
  {} as Record<string, number>,
);

//Essential functionality of WebGl
//t = width
//n = height
class MiniGl {
  readonly canvas: HTMLCanvasElement;
  readonly gl: WebGLRenderingContext;
  meshes: any[] = [];
  debug: (msg: string, ...args: any[]) => void;
  lastDebugMsg: Date | null = null;

  constructor(
    canvas: HTMLCanvasElement,
    width?: number,
    height?: number,
    debug = false,
  ) {
    this.canvas = canvas;
    this.gl = canvas.getContext("webgl", {
      antialias: true,
    })!;

    const debug_output = document.location.search
      .toLowerCase()
      .includes("debug=webgl");
    this.debug =
      debug && debug_output
        ? (msg: string, ...args: any[]) => {
            const t = new Date();
            if (t.getTime() - (this.lastDebugMsg?.getTime() ?? 0) > 1000) {
              console.log("---");
            }
            console.log(
              t.toLocaleTimeString() +
                Array(Math.max(0, 32 - msg.length)).join(" ") +
                msg +
                ": ",
              ...args,
            );
            this.lastDebugMsg = t;
          }
        : () => void 0;

    width && height && this.setSize(width, height);
  }

  setSize(width: number = 640, height: number = 480): void {
    this.canvas.width = width;
    this.canvas.height = height;
    this.gl.viewport(0, 0, width, height);
  }
}

export class Gradient {
  private readonly minigl: MiniGl;
  private readonly uniforms: Record<string, any> = {};
  private material: any;
  private mesh: any;
  private amp = 320;
  private seed = 5;
  private freqX = 14e-5;
  private freqY = 29e-5;
  private freqDelta = 1e-5;
  private activeColors = [1, 1, 1, 1];
  private isMetaKey = false;
  private isGradientLegendVisible = false;
  private isMouseDown = false;

  constructor(
    private readonly el: HTMLElement,
    private readonly colors = ["#ef008f", "#6ec3f4", "#7038ff", "#ffba27"],
  ) {
    this.minigl = new MiniGl(el as HTMLCanvasElement);
    this.initGradient();
  }

  public initGradient(selector?: string): this {
    // Initialize other properties and start animation
    // Add your initialization code here
    return this;
  }

  // Add other methods as needed
}

export default Gradient;
