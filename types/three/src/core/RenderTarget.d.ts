import { Vector4 } from "../math/Vector4.js";
import { DepthTexture } from "../textures/DepthTexture.js";
import { Texture, TextureParameters } from "../textures/Texture.js";
import { EventDispatcher } from "./EventDispatcher.js";

export interface RenderTargetOptions extends TextureParameters {
    depthBuffer?: boolean | undefined; // true
    stencilBuffer?: boolean | undefined; // false
    resolveDepthBuffer?: boolean | undefined; // true
    resolveStencilBuffer?: boolean | undefined; // true
    depthTexture?: DepthTexture | null | undefined; // null
    /**
     * Defines the count of MSAA samples. Can only be used with WebGL 2. Default is **0**.
     * @default 0
     */
    samples?: number | undefined;
    count?: number | undefined;
    depth?: number | undefined;
    multiview?: boolean | undefined;
}

export class RenderTarget<TTexture extends Texture | Texture[] = Texture> extends EventDispatcher<{ dispose: {} }> {
    readonly isRenderTarget: true;

    width: number;
    height: number;
    depth: number;

    scissor: Vector4;
    /**
     * @default false
     */
    scissorTest: boolean;
    viewport: Vector4;
    textures: TTexture[];

    /**
     * @default true
     */
    depthBuffer: boolean;

    /**
     * @default false
     */
    stencilBuffer: boolean;

    /**
     * Defines whether the depth buffer should be resolved when rendering into a multisampled render target.
     * @default true
     */
    resolveDepthBuffer: boolean;

    /**
     * Defines whether the stencil buffer should be resolved when rendering into a multisampled render target.
     * This property has no effect when {@link .resolveDepthBuffer} is set to `false`.
     * @default true
     */
    resolveStencilBuffer: boolean;

    /**
     * Defines the count of MSAA samples. Can only be used with WebGL 2. Default is **0**.
     * @default 0
     */
    samples: number;

    /**
     * Whether to this target is used in multiview rendering.
     *
     * @default false
     */
    multiview: boolean;

    constructor(width?: number, height?: number, options?: RenderTargetOptions);

    get texture(): TTexture;
    set texture(value: TTexture);

    set depthTexture(current: DepthTexture | null);
    get depthTexture(): DepthTexture | null;

    setSize(width: number, height: number, depth?: number): void;
    clone(): this;
    copy(source: RenderTarget): this;
    dispose(): void;
}
